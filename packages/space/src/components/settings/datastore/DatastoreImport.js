import React, { Component, Fragment } from 'react';
import { CoreAPI } from 'react-kinetic-core';
import { Line } from 'rc-progress';
import { Table, Modal, ModalBody, ModalFooter } from 'reactstrap';

import Papa from 'papaparse';

export const DeleteModal = ({ handleDelete, handleToggle, modal }) => (
  <Fragment>
    <Modal isOpen={modal} toggle={handleToggle}>
      <ModalBody>
        Choosing the delete button will delete all of the records that are
        currently in memory, this could be upto 1000 records.
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          Delete
        </button>
        <button className="btn btn-link btn-sm" onClick={handleToggle}>
          Cancel
        </button>
      </ModalFooter>
    </Modal>
  </Fragment>
);

export class DatastoreImport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
      postResult: false,
      submissions: [],
      records: [],
      recordsHeaders: [],
      formSlug: this.props.match.params.slug,
      missingFields: [],
      percentComplete: 0,
      modal: false,
    };
    this.form = {};
    this.formFields = [];
    this.calls = [];
    this.failedCalls = [];
    this.readFile = null;
  }

  post = ([head, ...tail]) => {
    this.setState({
      percentComplete:
        100 - Math.round((tail.length / this.state.records.length) * 100),
    });
    const promise = head.id
      ? CoreAPI.updateSubmission({
          datastore: true,
          formSlug: this.state.formSlug,
          values: head.values,
        })
      : CoreAPI.createSubmission({
          datastore: true,
          formSlug: this.state.formSlug,
          values: head.values,
        });

    promise.then(response => {
      if (response.serverError || response.errors) {
        this.failedCalls.push({ response, record: head });
      }

      if (tail.length > 0) {
        this.post(tail);
      } else {
        Promise.all(this.calls).then(() => {
          this.handlePostComplete();
        });
      }
    });
    this.calls.push(promise);
  };

  fetch = () => {
    const search = new CoreAPI.SubmissionSearch()
      .includes(['values'])
      .limit(1000)
      .build();

    CoreAPI.searchSubmissions({
      datastore: true,
      form: this.state.formSlug,
      search,
    }).then(res => {
      this.setState({ submissions: res.submissions });
    });
  };

  delete = ([head, ...tail]) => {
    this.setState({
      percentComplete:
        100 - Math.round((tail.length / this.state.submissions.length) * 100),
    });
    if (head.id) {
      CoreAPI.deleteSubmission({
        datastore: true,
        id: head.id,
      }).then(() => {
        if (tail.length > 0) {
          this.delete(tail);
        } else {
          this.setState({
            processing: false,
            percentComplete: 0,
          });
          this.fetch();
        }
      });
    }
  };

  fetchForm = () => {
    CoreAPI.fetchForm({
      datastore: true,
      formSlug: this.state.formSlug,
      include: 'fields,attributesMap',
    }).then(response => {
      if (response.serverError || response.errors) {
      } else {
        this.form = response.form;
        this.formFields = response.form.fields.reduce((acc, field) => {
          acc.push(field.name);
          return acc;
        }, []);
        const datastoreConfiguration = response.form.attributesMap[
          'Datastore Configuration'
        ]
          ? JSON.parse(
              response.form.attributesMap['Datastore Configuration'][0],
            )
          : null;
        this.setState({
          datastoreConfiguration,
        });
      }
    });
  };

  handleReset = () => {
    this.readFile = null;
    this.setState({
      records: [],
      recordsHeaders: [],
      missingFields: [],
      percentComplete: 0,
    });
  };

  handlePostComplete = () => {
    this.setState({
      processing: false,
      percentComplete: 0,
      postResult: true,
    });
    this.fetch();
    this.handleReset();
  };

  handleToggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  handleDelete = () => {
    this.setState({
      processing: true,
      modal: false,
      postResult: false,
    });
    this.delete(this.state.submissions);
  };

  handleImport = () => {
    this.setState({ processing: true });
    this.post(this.state.records);
  };

  handleCsvToJson = () => {
    let arr = [];
    this.parseResults.data.map(csvRow => {
      let obj = {};
      if (csvRow['Datastore Record ID'] !== '') {
        obj.id = csvRow['Datastore Record ID'];
      }
      delete csvRow['Datastore Record ID'];
      obj.values = csvRow;
      arr.push(obj);
    });
    this.setState({ records: arr });
  };

  handleFieldCheck = () => {
    const headers = this.parseResults.meta.fields;
    const missingFields = [];
    const allHeadersFound = headers.every(header => {
      if (
        this.formFields.includes(header) ||
        header === 'Datastore Record ID'
      ) {
        return true;
      }
      missingFields.push(header);
      return false;
    });
    if (!allHeadersFound) {
      this.setState({ missingFields });
    } else {
      this.handleCsvToJson();
      this.setState({ recordsHeaders: headers });
    }
  };

  handleChange = event => {
    const file = this.fileEl.files[0];

    // If the user chooses to cancel the open.  Avoids an error with file.name and prevents unnecessary behavior.
    if (file) {
      this.setState({ fileName: file.name, postResult: false });
      const reader = new FileReader();
      reader.readAsText(this.fileEl.files[0]);
      this.readFile = reader;
      reader.onload = event => {
        Papa.parse(event.target.result, {
          header: true,
          complete: results => {
            //When streaming, parse results are not available in this callback.
            this.parseResults = results;
            this.handleFieldCheck();
          },
          error: errors => {
            //Test error handleing here.  This might not work if error is called each time a row has an error.
          },
        });
      };
    }
  };

  componentWillMount() {
    this.fetchForm();
    this.fetch();
  }

  render() {
    return (
      <Fragment>
        <div className="page-container page-container--datastore">
          <div className="page-panel page-panel--scrollable page-panel--datastore-content">
            <div className="page-title">
              <h1>Import Datastore</h1>
            </div>
            {this.state.submissions.length > 0 ? (
              <Fragment>
                <div style={{ display: 'inline-block', marginRight: '1rem' }}>
                  <p>This datastore currently has records</p>{' '}
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={this.handleToggle}
                >
                  Delete Records
                </button>
              </Fragment>
            ) : (
              <div>
                <p>This datastore currently has no records</p>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {this.state.records.length > 0 &&
                this.state.missingFields.length <= 0 && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={this.handleImport}
                  >
                    Import Records
                  </button>
                )}
              {this.readFile ? (
                <button
                  className="btn btn-info btn-sm"
                  onClick={this.handleReset}
                >
                  Reset File
                </button>
              ) : (
                <Fragment>
                  <input
                    type="file"
                    id="file-input"
                    style={{ display: 'none' }}
                    onChange={this.handleChange}
                    ref={element => {
                      this.fileEl = element;
                    }}
                  />
                  <label htmlFor="file-input" className="btn btn-info btn-sm">
                    Choose A File
                  </label>
                </Fragment>
              )}
            </div>
            <div className="forms-list-wrapper">
              {this.state.missingFields.length > 0 && (
                <div>
                  <h3>The CSV has headers that do not exist on the form</h3>
                  {this.state.missingFields.map(fieldName => (
                    <p>{fieldName}</p>
                  ))}
                </div>
              )}
              {this.state.processing && (
                <Line
                  percent={this.state.percentComplete}
                  strokeWidth="1"
                  strokeColor="#5fba53"
                />
              )}
              {this.state.postResult && (
                <div>
                  <h4>Post Results</h4>
                  <p>{this.calls.length} records attempted to be posted</p>
                  <p>{this.failedCalls.length} records failed</p>
                </div>
              )}
              {!this.state.processing &&
                !this.state.postResult &&
                this.state.records.length > 0 &&
                this.state.recordsHeaders.length > 0 && (
                  <Fragment>
                    <div>
                      <p>
                        The below table is a preview of{' '}
                        <b>{this.state.fileName}</b>.
                      </p>
                      <p>Import Records to save them.</p>
                    </div>
                    <Table style={{ maxWidth: '80%' }}>
                      <thead>
                        <tr>
                          {this.state.recordsHeaders
                            .sort()
                            .map((header, idx) => (
                              <th key={header + idx}>{header}</th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.records.map((record, idx) => {
                          const { values, id } = record;
                          return (
                            <tr key={idx}>
                              {Object.keys(values)
                                .sort()
                                .map((fieldName, idx) => (
                                  <td key={fieldName + idx}>
                                    {values[fieldName]}
                                  </td>
                                ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Fragment>
                )}
            </div>
          </div>
        </div>
        <DeleteModal
          modal={this.state.modal}
          handleToggle={this.handleToggle}
          handleDelete={this.handleDelete}
        />
      </Fragment>
    );
  }
}
