import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { CoreAPI } from 'react-kinetic-core';
import { Line } from 'rc-progress';
import { Table, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Set, List, fromJS } from 'immutable';
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
 * @param {Array} formFieldNames - All the names of the fields on the form.
 * @return {}
 */
export const createHeaderToFieldMap = (headers, formFieldNames) => {
  const headersSet = Set(headers);
  const missingFields = headersSet.subtract(formFieldNames);

  const tempSetA = headersSet.intersect(formFieldNames).reduce((acc, val) => {
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
 *  This function returns "missing fields" which are any objects in the headerToFieldMap that have an empty string
 * for a field value or have checked equal to true (which mean to omit on import).  We also ignore the object that
 * has a header with the value of 'Datastore Record ID' because that object hold the submission id for updating a
 * record.
 *
 * @param {List} headerMapList - A map of headers to field names that is stored as a attribute on the form as a List.
 * @return {List}
 */
const findMissingFields = headerMapList =>
  headerMapList
    .filter(
      obj =>
        obj.field === '' &&
        !obj.checked &&
        obj.header.toLocaleLowerCase() !== 'datastore record id',
    )
    .reduce((acc, obj) => {
      return acc.push(obj.header);
    }, List([]));

/**
 *  This is a support function for checkHeaderToFieldMap
 *
 * @param {Set} headersSet - First Row of the csv as a Set
 * @param {List} headerMapList - A map of headers to field names that is stored as a attribute on the form as a List.
 * @returns {Object}
 */
const buildHeaderToFieldMap = (headersSet, headerMapList) => {
  const missing = findMissingFields(headerMapList);
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
 * @param {Array} headers - First Row of the csv
 * @param {Array} headerMap - A map of headers to field names that is stored as a attribute on the form.
 * @param {Array} formFieldNames - All the names of the fields on the form.
 * @returns {Object}
 */
export const checkHeaderToFieldMap = (headers, headerMap, formFieldNames) => {
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
      if (
        obj.field.toLocaleLowerCase() !== 'datastore record id' &&
        obj.field
      ) {
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
  const removedFields = existingFieldsSet.subtract(Set(formFieldNames));

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
            field: formFieldNames.find(field => field === header) || '',
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
      recordsHeaders: Set([]),
      formSlug: this.props.match.params.slug,
      missingFields: List([]),
      mapHeadersShow: false,
      percentComplete: 0,
      modal: false,
    };
    this.form = {};
    this.formFieldNames = [];
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

    /*  The below code will to a sequential post/put for all of the records on state. 
     * It has been written to extend it functionality to batch calls in the future.
     */

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
          // This is used to reset the progress bar after the post process completes.
          this.setState({
            processing: false,
            percentComplete: 0,
            postResult: true,
          });
          this.fetch();
          this.handleReset();
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
    // percentComplete is used to dynamically change the progress bar.
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
          // This is used to reset the progress bar after the delete process completes.
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
      include: 'fields.details,attributesMap',
    }).then(response => {
      if (response.serverError || response.errors) {
      } else {
        this.form = response.form;
        this.formFieldNames = response.form.fields.reduce((acc, field) => {
          acc.push(field.name);
          return acc;
        }, []);
        this.formFields = response.form.fields;
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
      recordsHeaders: Set([]),
      missingFields: List([]),
      percentComplete: 0,
    });
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
    this.calls = [];
    this.post(this.state.records);
  };

  /*  headerToFieldMap must be passed in because handleSelect and handleOmit update headerToFieldMap
   * in state just before calling handleCsvToJson.  If we used this.state.headerToFieldMap we would
   * get a stale version of the data.
  */
  handleCsvToJson = headerToFieldMap => {
    const resultsList = fromJS(this.parseResults.data);
    this.setState({
      records: resultsList.reduce((arr, csvRowMap) => {
        let obj = {
          values: {},
        };
        csvRowMap.forEach((val, header) => {
          const found = headerToFieldMap.find(obj => obj.header === header);
          if (
            found.header.toLocaleLowerCase() === 'datastore record id' &&
            !(val === '')
          ) {
            obj.id = val;
          } else if (!found.checked) {
            const fieldObject = this.formFields.find(
              field => field.name === header,
            );
            if (fieldObject && fieldObject.dataType === 'json') {
              obj.values = {
                ...obj.values,
                [found.field]: val ? JSON.parse(val) : [],
              };
            } else {
              obj.values = { ...obj.values, [found.field]: val ? val : null };
            }
          }
        });
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
          this.formFieldNames,
        ))
      : (obj = createHeaderToFieldMap(headers, this.formFieldNames));

    this.setState({
      headerToFieldMap: obj.headerToFieldMap,
      missingFields: obj.missingFields,
      recordsHeaders: obj.recordsHeaders,
    });
    if (obj.missingFields.size <= 0) {
      this.handleCsvToJson(obj.headerToFieldMap);
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
    const updatedList = this.state.headerToFieldMap.update(
      event.target.getAttribute('index'),
      obj => ({ ...obj, header: event.target.name, field: event.target.value }),
    );
    const missingFields = findMissingFields(updatedList);
    this.setState({
      headerToFieldMap: updatedList,
      missingFields,
    });
    if (missingFields.size <= 0) {
      this.handleCsvToJson(updatedList);
    }
  };

  handleOmit = event => {
    const updatedList = this.state.headerToFieldMap.update(
      event.target.getAttribute('index'),
      () => ({
        header: event.target.name,
        field: event.target.value,
        checked: event.target.checked,
      }),
    );
    const missingFields = findMissingFields(updatedList);
    this.setState({
      headerToFieldMap: updatedList,
      missingFields,
    });
    if (missingFields.size <= 0) {
      this.handleCsvToJson(updatedList);
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
              <div className="page-title__wrapper">
                <h3>
                  <Link to="/">home</Link> /{` `}
                  <Link to="/settings">settings</Link> /{` `}
                  <Link to={`/settings/datastore/`}>datastore</Link> /{` `}
                </h3>
                <h1>Import Datastore</h1>
              </div>
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
              {this.state.mapHeadersShow && (
                <Fragment>
                  <table>
                    <tbody>
                      {this.state.headerToFieldMap.map((obj, idx) => {
                        console.log(obj.header);
                        if (
                          obj.header.toLocaleLowerCase() !==
                          'datastore record id'
                        ) {
                          return (
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
                                  {this.formFieldNames.map(fieldName => (
                                    <option key={fieldName} value={fieldName}>
                                      {fieldName}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  id="omit"
                                  name={obj.header}
                                  index={idx}
                                  value={obj.field}
                                  checked={obj.checked}
                                  onChange={this.handleOmit}
                                />
                                <label htmlFor="omit">
                                  Omit Column from Import
                                </label>
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
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
                    <Table className="table-responsive table-sm">
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
                                if (
                                  obj.field.toLocaleLowerCase() ===
                                  'datastore record id'
                                ) {
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
