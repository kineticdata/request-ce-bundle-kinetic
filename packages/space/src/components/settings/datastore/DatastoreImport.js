import React, { Component, Fragment } from 'react';
import { CoreAPI } from 'react-kinetic-core';
import { Table } from 'reactstrap';

import csv from 'csvtojson';

export class DatastoreImport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submissions: [],
      csvObjects: [],
      records: [],
      recordsHeaders: [],
      formSlug: this.props.match.params.slug,
      missingFields: [],
    };
    this.form = {};
    this.formFields = [];
    this.calls = [];
    this.failedCalls = [];
    this.readFile = null;
  }

  post = ([head, ...tail]) => {
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
        Promise.all(this.calls).then(this.fetch);
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
    if (head.id) {
      CoreAPI.deleteSubmission({
        datastore: true,
        id: head.id,
      }).then(() => {
        if (tail.length > 0) {
          this.delete(tail);
        } else {
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

  handleDelete = () => this.delete(this.state.submissions);

  handleImport = () => {
    this.setState({ records: [], recordsHeaders: [] });
    this.post(this.state.records);
  };

  handleCsvToJson = () => {
    const classThis = this;
    let arr = [];
    csv({ noheader: false })
      .fromString(this.readFile.result)
      .on('json', csvRow => {
        let obj = {};
        if (csvRow['Datastore Record ID'] !== '') {
          obj.id = csvRow['Datastore Record ID'];
        }
        delete csvRow['Datastore Record ID'];
        obj.values = csvRow;
        arr.push(obj);
      })
      .on('end', () => {
        classThis.setState({ records: arr });
      });
  };

  handleChange = event => {
    const classThis = this;
    const reader = new FileReader();
    reader.readAsText(this.fileEl.files[0]);
    this.readFile = reader;
    reader.onload = event => {
      csv({ noheader: false })
        .fromString(event.target.result)
        .on('header', headers => {
          const missingFields = [];
          const allHeadersFound = headers.every(header => {
            if (
              classThis.formFields.includes(header) ||
              header === 'Datastore Record ID'
            ) {
              return true;
            }
            missingFields.push(header);
            return false;
          });
          if (!allHeadersFound) {
            classThis.setState({ missingFields });
          } else {
            classThis.handleCsvToJson();
            classThis.setState({ recordsHeaders: headers });
          }
        });
    };
  };

  componentWillMount() {
    this.fetchForm();
    this.fetch();
  }

  render() {
    return (
      <div className="page-container page-container--datastore">
        <div className="page-panel page-panel--scrollable page-panel--datastore-content">
          <div className="page-title">
            <h1>Import Datastore</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {this.state.submissions.length > 0 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={this.handleDelete}
              >
                Delete Records
              </button>
            )}
            {this.state.records.length > 0 &&
              this.state.missingFields.length <= 0 && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={this.handleImport}
                >
                  Import Records
                </button>
              )}
            <input
              type="file"
              onChange={this.handleChange}
              ref={element => {
                this.fileEl = element;
              }}
            />
          </div>
          <div className="forms-list-wrapper">
            {this.state.missingFields.length > 0 && (
              <div>
                <h3>The CSV has headers that do not exist on the form</h3>
                {this.state.missingFields.map(fieldName => <p>{fieldName}</p>)}
              </div>
            )}
            {this.state.submissions.length > 0 ? (
              <div>
                <p>This datastore currently has records</p>
              </div>
            ) : (
              <div>
                <p>This datastore currently has no records</p>
              </div>
            )}
            {this.state.records.length > 0 &&
              this.state.recordsHeaders.length > 0 && (
                <Fragment>
                  <div>
                    <p>CSV to Json results for review.</p>
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
    );
  }
}
