import React, { Component, Fragment } from 'react';
import { CoreAPI } from 'react-kinetic-core';
import { Line } from 'rc-progress';
import { Table, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Set, List } from 'immutable';

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
 *   This function creates the map that is used to match the csv's headers
 *  to feilds on the form.
 *
 * @param {Array} headers - First Row of the csv
 * @param {Array} formFields - All the names of the fields on the form.
 * @return {}
 */
export const createHeaderToFieldMap = (headers, formFields) => {
  const headersSet = Set(headers);
  const missingFields = headersSet.subtract(formFields);

  const tempSetA = headersSet.intersect(formFields).reduce((acc, val) => {
    const obj = { header: val, field: val, checked: false };
    return acc.add(obj);
  }, Set([]));

  const tempSetB = missingFields.reduce((acc, val) => {
    const obj = { header: val, field: '', checked: false };
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
};
/**
 *  This is a support function for checkHeaderToFieldMap
 *
 * @param {*} headersSet - First Row of the csv as a Set
 * @param {*} headerMapList - A map of headers to field names that is stored as a attribute on the form as a List.
 * @returns {}
 */
const buildHeaderToFieldMap = (headersSet, headerMapList) => {
  const missing = headerMapList
    .filter(obj => obj.field === '')
    .reduce((acc, obj) => {
      return acc.push(obj.header);
    }, List([]));
  return {
    headerToFieldMap: headerMapList.sort((a, b) => {
      if (a.field < b.field) {
        return -1;
      }
      if (a.field > b.field) {
        return 1;
      }
      if (a.field === b.field) {
        return 0;
      }
    }),
    missingFields: missing,
    recordsHeaders: headersSet,
  };
};

/**
 *  This function checks if all of the headers have matching form fields.
 *
 * @param {*} headers - First Row of the csv
 * @param {*} headerMap - A map of headers to field names that is stored as a attribute on the form.
 * @param {*} formFields - All the names of the fields on the form.
 * @returns {}
 */
export const checkHeaderToFieldMap = (headers, headerMap, formFields) => {
  const headersSet = Set(headers);
  const headerMapList = List(headerMap);

  // Filter the headers out of the array returned form the form.
  const existingHeadersSet = headerMapList
    .reduce((acc, obj) => {
      return acc.push(obj.header);
    }, List([]))
    .toSet();

  // Filter the fields out of the array returned form the form.
  const existingFieldsSet = headerMapList
    .reduce((acc, obj) => {
      if (obj.field !== 'Datastore Record ID' && obj.field) {
        return acc.push(obj.field);
      }
      return acc;
    }, List([]))
    .toSet();

  // There are headers that exist in the csv that do not exist in the headerMap config.
  const addedHeaders = headersSet.subtract(existingHeadersSet);
  // There are headers that exist in the headerMap config that do not exist in the csv.
  const removedHeaders = existingHeadersSet.subtract(headers);
  // There are fields in the headerMap config that do not exist on the form.
  const removedFields = existingFieldsSet.subtract(Set(formFields));

  // Check to see if headers have changed on the CSV or the fields on the form have changed.
  if (
    addedHeaders.size > 0 ||
    removedHeaders.size > 0 ||
    removedFields.size > 0
  ) {
    let modifiedList = headerMapList;
    if (addedHeaders.size > 0) {
      addedHeaders.forEach(
        header =>
          (modifiedList = modifiedList.push({
            header,
            field: formFields.find(field => field === header) || '',
            checked: false,
          })),
      );
    }
    if (removedHeaders.size > 0) {
      removedHeaders.forEach(header => {
        modifiedList = modifiedList.delete(
          modifiedList.findIndex(obj => obj.header === header),
        );
      });
    }
    if (removedFields.size > 0) {
      removedFields.forEach(field => {
        modifiedList = modifiedList.update(
          modifiedList.findIndex(obj => obj.field === field),
          obj => ({ ...obj, field: '' }),
        );
      });
    }
    return buildHeaderToFieldMap(headersSet, modifiedList);
  } else {
    return buildHeaderToFieldMap(headersSet, headerMapList);
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
    let obj;

    /*  If the form has the attribute "CSV Header To Form Map" and it has a value then
     * check that the values are still valid.  If not create the map.
    */
    this.headerToFieldMapFormAttribute
      ? (obj = checkHeaderToFieldMap(
          headers,
          this.headerToFieldMapFormAttribute,
          this.formFields,
        ))
      : (obj = createHeaderToFieldMap(headers, this.formFields));

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

  handleOmit = event => {
    this.setState({
      headerToFieldMap: this.state.headerToFieldMap.update(
        event.target.value,
        () => ({
          checked: event.target.checked,
        }),
      ),
    });
    if (this.state.missingFields <= 0) {
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
                          <td>
                            <input
                              type="checkbox"
                              id="omit"
                              value={obj.idx}
                              checked={obj.checked}
                              onClick={this.handleOmit}
                            />
                            <label htmlFor="omit">
                              Omit Column from Import
                            </label>
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
