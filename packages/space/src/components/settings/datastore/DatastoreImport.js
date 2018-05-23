import React, { Component, Fragment } from 'react';
import { CoreAPI } from 'react-kinetic-core';
import { Line } from 'rc-progress';
import { Table } from 'reactstrap';
import { Set, List } from 'immutable';

import csv from 'csvtojson';

export class DatastoreImport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posting: false,
      postResult: false,
      submissions: [],
      csvObjects: [],
      records: [],
      recordsHeaders: [],
      formSlug: this.props.match.params.slug,
      missingFields: [],
      mapHeadersShow: false,
      percentComplete: 0,
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
        100 - Math.round(tail.length / this.state.records.length * 100),
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
          this.setState({
            posting: false,
            percentComplete: 0,
            postResult: true,
          });
          this.fetch();
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
        this.headerToFieldMapFormAttribute =
          response.form.attributesMap['CSV Header To Form Map'].length > 0
            ? JSON.parse(
                response.form.attributesMap['CSV Header To Form Map'][0],
              )
            : null;
      }
    });
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

  handleDelete = () => this.delete(this.state.submissions);

  handleImport = () => {
    this.setState({ posting: true });
    this.post(this.state.records);
  };

  handleCsvToJson = () => {
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
        this.setState({ records: arr });
      });
  };

  handleChange = event => {
    const reader = new FileReader();
    reader.readAsText(this.fileEl.files[0]);
    this.readFile = reader;
    reader.onload = event => {
      csv({ noheader: false })
        .fromString(event.target.result)
        .on('header', headers => {
          // Check to see if headers have changed on the CSV file since the import was last run.
          let requiresUnion = true;
          let existingHeadersSet;

          if (this.headerToFieldMapFormAttribute) {
            existingHeadersSet = Set(
              this.headerToFieldMapFormAttribute.reduce((acc, obj) => {
                acc.push(obj.header);
                return acc;
              }, []),
            );
            if (existingHeadersSet.subtract(headers).size <= 0) {
              requiresUnion = false;
            }
          }

          if (requiresUnion) {
            const headersSet = Set(headers);
            const missingFields = headersSet.subtract(this.formFields);

            const tempSetA = headersSet
              .intersect(this.formFields)
              .reduce((acc, val) => {
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

            this.setState({ headerToFieldMap: unionSet });

            if (missingFields.size > 0) {
              this.setState({ missingFields, recordsHeaders: headersSet });
            } else {
              this.handleCsvToJson();
              this.setState({ recordsHeaders: headersSet });
            }
          } else {
            const missing = Set(
              this.headerToFieldMapFormAttribute
                .filter(obj => obj.field === '')
                .reduce((acc, obj) => {
                  acc.push(obj.header);
                  return acc;
                }, []),
            );
            this.setState({
              headerToFieldMap: Set(this.headerToFieldMapFormAttribute)
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
            });
            if (missing.size <= 0) {
              this.handleCsvToJson();
            }
          }
        });
    };
  };

  handleShow = () => {
    this.setState({ mapHeadersShow: !this.state.mapHeadersShow });
  };

  handleSave = () => {
    this.updateForm();
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
      <div className="page-container page-container--datastore">
        <div className="page-panel page-panel--scrollable page-panel--datastore-content">
          <div className="page-title">
            <h1>Import Datastore</h1>
          </div>
          {this.state.submissions.length > 0 ? (
            <div>
              <p>This datastore currently has records</p>
            </div>
          ) : (
            <div>
              <p>This datastore currently has no records</p>
            </div>
          )}
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
              this.state.missingFields.size <= 0 && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={this.handleImport}
                >
                  Import Records
                </button>
              )}
            {this.state.recordsHeaders.size > 0 && (
              <button className="btn btn-info btn-sm" onClick={this.handleShow}>
                Map Headers
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
                            <option value={'id'}>Submission Id</option>
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
            {this.state.posting && (
              <Line
                percent={this.state.percentComplete}
                strokeWidth="1"
                strokeColor="#5fba53"
              />
            )}
            {this.state.postResult && (
              <div>
                <h4>Post Results</h4>
                <p>{this.state.records.length} records were to be posted</p>
                <p>{this.calls.length} records attempted to be posted</p>
                <p>{this.failedCalls.length} records failed</p>
              </div>
            )}
            {!this.state.posting &&
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
                        {this.state.recordsHeaders
                          .sort()
                          .map((header, idx) => (
                            <th key={header + idx}>{header}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.records.map((record, idx) => {
                        const { values } = record;
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
