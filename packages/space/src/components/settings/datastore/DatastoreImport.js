import React, { Component, Fragment } from 'react';
import { CoreAPI } from 'react-kinetic-core';
import { Line } from 'rc-progress';
import { Table, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Set } from 'immutable';

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

/**
 *  This function checks if all of the headers have matching form fields.
 *
 * @param {*} headers - First Row of the csv
 * @param {*} headerMap - A map of headers to field names that is stored as a attribute on the form.
 * @param {*} formFields - All the names of the fields on the form.
 */
export const checkHeaders = (headers, headerMap, formFields) => {
  let existingHeadersSet = Set();

  // If the form has the attribute "CSV Header To Form Map" the headerMap will be truthy.
  if (headerMap) {
    // Filter the headers out of the array returned form the form.
    existingHeadersSet = Set(
      headerMap.reduce((acc, obj) => {
        acc.push(obj.header);
        return acc;
      }, []),
    );
  }

  // Check to see if headers have changed on the CSV file since the import was last run.
  if (existingHeadersSet.subtract(headers).size <= 0) {
    const headersSet = Set(headers);
    const missingFields = headersSet.subtract(formFields);

    const tempSetA = headersSet.intersect(formFields).reduce((acc, val) => {
      const obj = { header: val, field: val };
      return acc.add(obj);
    }, Set([]));

    const tempSetB = missingFields.reduce((acc, val) => {
      const obj = { header: val, field: '' };
      return acc.add(obj);
    }, Set([]));

    const unionSet = tempSetA
      .union(tempSetB)
      .sort((a, b) => {
        if (a.field < b.field) {
          return -1;
        }
        if (a.field > b.field) {
          return 1;
        }
        if (a.field === b.field) {
          return 0;
        }
      })
      .toList();

    return {
      headerToFieldMap: unionSet,
      missingFields,
      recordsHeaders: headersSet,
    };
  } else {
    const missing = Set(
      headerMap.filter(obj => obj.field === '').reduce((acc, obj) => {
        acc.push(obj.header);
        return acc;
      }, []),
    );
    return {
      headerToFieldMap: Set(headerMap)
        .sort((a, b) => {
          if (a.field < b.field) {
            return -1;
          }
          if (a.field > b.field) {
            return 1;
          }
          if (a.field === b.field) {
            return 0;
          }
        })
        .toList(),
      missingFields: missing,
      recordsHeaders: existingHeadersSet,
    };
  }
};

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
      mapHeadersShow: false,
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
    // percentComplete is used to dynamically change the progress bar.
    this.setState({
      percentComplete:
        100 - Math.round((tail.length / this.state.records.length) * 100),
    });
    const promise = head.id
      ? CoreAPI.updateSubmission({
          datastore: true,
          formSlug: this.state.formSlug,
          values: head.values,
          id: head.id,
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
        this.headerToFieldMapFormAttribute =
          response.form.attributesMap['CSV Header To Form Map'].length > 0
            ? JSON.parse(
                response.form.attributesMap['CSV Header To Form Map'][0],
              )
            : null;
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
  updateForm = () => {
    CoreAPI.updateForm({
      datastore: true,
      formSlug: this.state.formSlug,
      form: {
        attributesMap: {
          'CSV Header To Form Map': [
            JSON.stringify(this.state.headerToFieldMap.toJS()),
          ],
        },
      },
    });
  };

  handleImport = () => {
    this.setState({
      processing: true,
      mapHeadersShow: false,
    });
    this.post(this.state.records);
  };

  handleCsvToJson = () => {
    this.setState({
      records: this.parseResults.data.reduce((arr, csvRow) => {
        let obj = {};
        if (csvRow['Datastore Record ID'] !== '') {
          obj.id = csvRow['Datastore Record ID'];
        }
        delete csvRow['Datastore Record ID'];
        obj.values = csvRow;
        arr.push(obj);
        return arr;
      }, []),
    });
  };

  handleFieldCheck = () => {
    const headers = this.parseResults.meta.fields;
    const obj = checkHeaders(
      headers,
      this.headerToFieldMapFormAttribute,
      this.formFields,
    );
    this.setState({
      headerToFieldMap: obj.headerToFieldMap,
      missingFields: obj.missingFields,
      recordsHeaders: obj.recordsHeaders,
    });
    if (obj.missingFields.size <= 0) {
      this.handleCsvToJson();
    }
  };

  handleShow = () => {
    this.setState({ mapHeadersShow: !this.state.mapHeadersShow });
  };

  handleSave = () => {
    this.updateForm();
    this.setState({ mapHeadersShow: false });
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

  handleSelect = event => {
    const missingFields = this.state.missingFields.delete(event.target.name);
    this.setState({
      headerToFieldMap: this.state.headerToFieldMap.update(
        event.target.getAttribute('index'),
        () => ({ header: event.target.name, field: event.target.value }),
      ),
      missingFields,
    });
    if (missingFields.size <= 0) {
      this.handleCsvToJson();
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
                <div>
                  <p>This datastore currently has records</p>
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
                this.state.missingFields.size <= 0 && (
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
              {this.state.recordsHeaders.size > 0 && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={this.handleShow}
                >
                  Map Headers
                </button>
              )}
            </div>
            <div className="forms-list-wrapper">
              {this.state.missingFields.size > 0 && (
                <div>
                  <h4>The CSV has headers that do not exist on the form</h4>
                  {this.state.missingFields.map((fieldName, idx) => (
                    <p key={fieldName + idx}>{fieldName}</p>
                  ))}
                </div>
              )}
              {this.state.mapHeadersShow && (
                <Fragment>
                  <table>
                    <tbody>
                      {this.state.headerToFieldMap.map((obj, idx) => (
                        <tr key={obj.header + idx}>
                          <td>{obj.header}</td>
                          <td>
                            <select
                              onChange={this.handleSelect}
                              name={obj.header}
                              index={idx}
                              value={obj.field}
                            >
                              <option value={''}>Select Option</option>
                              {this.formFields.map(fieldName => (
                                <option key={fieldName} value={fieldName}>
                                  {fieldName}
                                </option>
                              ))}
                              <option value={'Datastore Record ID'}>
                                Datastore Record ID
                              </option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={this.handleSave}
                  >
                    Save
                  </button>
                </Fragment>
              )}

              {!this.state.processing &&
                !this.state.postResult &&
                !this.state.mapHeadersShow &&
                this.state.records.length > 0 &&
                this.state.recordsHeaders.size > 0 && (
                  <Fragment>
                    <div>
                      <p>CSV to Json results for review.</p>
                      <p>Import Records to save them.</p>
                    </div>
                    <Table style={{ maxWidth: '80%' }}>
                      <thead>
                        <tr>
                          {this.state.headerToFieldMap.map((obj, idx) => (
                            <th key={obj.header + idx}>{obj.header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.records.map((record, idx) => {
                          const { values, id } = record;
                          return (
                            <tr key={idx}>
                              {this.state.headerToFieldMap.map((obj, idx) => {
                                if (obj.field === 'Datastore Record ID') {
                                  return <td key={obj.field + idx}>{id}</td>;
                                }
                                return (
                                  <td key={obj.field + idx}>
                                    {values[obj.field]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
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
