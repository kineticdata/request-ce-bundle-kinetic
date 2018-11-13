import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Line } from 'rc-progress';
import { Table } from 'reactstrap';
import { Set, List, fromJS } from 'immutable';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';

import { actions } from '../../../redux/modules/settingsDatastore';

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
  let missingFields = headersSet.subtract(formFieldNames);

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
      return null;
    })
    .toList();

  return {
    headerToFieldMap: unionSet,
    missingFields,
    recordsHeaders: headersSet,
  };
};
/**
 *  Find is there are headers that have not been mapped to fields.
 *
 * @param {List} headerMapList - A map of headers to field names.
 * @return {List}
 */
const findMissingFields = headerMapList =>
  headerMapList
    .filter(
      obj =>
        obj.field === '' &&
        !obj.checked &&
        obj.header.toLowerCase() !== 'datastore record id',
    )
    .reduce((acc, obj) => {
      return acc.push(obj.header);
    }, List([]));

const DropzoneContent = () => (
  <Fragment>
    <i className="fa fa-upload" />
    <h2>Upload a .csv file</h2>
    <p>
      Drag a file to attach or <span className="text-primary">browse</span>
    </p>
  </Fragment>
);

export class ImportComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postResult: false,
      submissions: [],
      records: List(),
      recordsHeaders: Set([]),
      formSlug: props.form.slug,
      missingFields: List([]),
      mapHeadersShow: false,
      percentComplete: 0,
      modal: false,
    };
    this.form = {};
    this.formFieldNames = [];
    this.readFile = null;
    this.formFieldNames = props.form.fields.reduce((acc, field) => {
      acc.push(field.name);
      return acc;
    }, []);
    this.formFields = props.form.fields;
  }

  handleReset = () => {
    this.readFile = null;
    this.props.resetImportFailedCall();
    this.setState({
      postResult: false,
    });
  };

  handleImport = () => {
    this.setState({
      mapHeadersShow: false,
      attemptedRecords: this.state.records.size,
    });

    this.props.executeImport({
      form: this.props.form,
      records: this.state.records,
      recordsLength: this.state.records.size,
    });
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
            found.header.toLowerCase() === 'datastore record id' &&
            !(val === '') &&
            !found.checked
          ) {
            obj.id = val;
          } else if (
            found.header.toLowerCase() !== 'datastore record id' &&
            !found.checked
          ) {
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
        return arr.push(obj);
      }, List([])),
    });
  };

  handleFieldCheck = () => {
    const headers = this.parseResults.meta.fields;
    let obj;

    obj = createHeaderToFieldMap(headers, this.formFieldNames);

    const missingFields = findMissingFields(obj.headerToFieldMap);

    this.setState({
      headerToFieldMap: obj.headerToFieldMap,
      missingFields: missingFields,
      recordsHeaders: obj.recordsHeaders,
    });
    if (missingFields.size <= 0) {
      this.handleCsvToJson(obj.headerToFieldMap);
    }
  };

  handleShow = () => {
    this.setState({ mapHeadersShow: !this.state.mapHeadersShow });
  };

  // Read file and parse results when user makes a selection.
  handleChange = files => {
    if (files && files.length > 0) {
      const file = files[0];
      // Add file name to state and reset if another file has already been chossen.
      this.setState({
        fileName: file.name,
        postResult: false,
        attemptedRecords: 0,
        failedCalls: List(),
      });
      const reader = new FileReader();
      reader.readAsText(file);
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

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.importComplete &&
      this.props.importComplete !== nextProps.importComplete
    ) {
      this.setState({
        postResult: true,
        records: List(),
        recordsHeaders: Set([]),
        missingFields: List([]),
        percentComplete: 0,
      });
    }
  }

  render() {
    return (
      <Fragment>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* // Upload CSV */}
          {!this.readFile &&
            !this.state.postResult && (
              <Fragment>
                <div className="text-center">
                  <h2>Only .csv files are permitted to be uploaded.</h2>
                  <h4>
                    Size is limited to 20<em>mb</em>
                  </h4>
                </div>
                <div className="dropzone">
                  <Dropzone
                    onDrop={this.handleChange}
                    className="dropzone__area"
                    acceptClassName="dropzone__area--active"
                    rejectClassName="dropzone__area--disabled"
                  >
                    {({ isDragActive, isDragReject }) => {
                      if (isDragReject) {
                        return 'Only .csv files are vaild';
                      }
                      if (isDragActive) {
                        return <DropzoneContent />;
                      }

                      return <DropzoneContent />;
                    }}
                  </Dropzone>
                </div>
              </Fragment>
            )}

          {/* // Missing Fields */}
          {this.state.missingFields.size > 0 && (
            <div className="text-center">
              <h2>The .csv has headers that do not exist on the form</h2>
              <h4>Please review the headers to match or omit.</h4>
            </div>
          )}

          {/* // Processing line */}
          {this.props.processing && (
            <Line
              percent={this.props.percentComplete}
              strokeWidth="1"
              strokeColor="#5fba53"
            />
          )}

          {/* //Show Results */}
          {this.state.postResult && (
            <Fragment>
              <div className="text-center">
                <h2>Post Results</h2>
                {this.state.attemptedRecords > 0 ? (
                  <Fragment>
                    <h4>
                      {this.state.attemptedRecords} record{this.state
                        .attemptedRecords > 1 && 's'}{' '}
                      attempted to be posted
                    </h4>
                    {/* TODO: Display a link to download failed files */}
                    <h4 className="text-danger">
                      {this.props.failedCalls.size} record{this.props
                        .failedCalls.size > 1 && 's'}{' '}
                      failed
                    </h4>
                    {/* <button className="btn btn-primary">Download failed records</button> */}
                  </Fragment>
                ) : (
                  <h4>No records found to post</h4>
                )}
                <button
                  className="btn btn-link"
                  style={{ alignSelf: 'flex-end' }}
                  onClick={this.handleReset}
                >
                  Upload a new file?
                </button>
              </div>
            </Fragment>
          )}

          {/* // Table of records to be imported */}
          {this.state.recordsHeaders.size > 0 && (
            <Fragment>
              <table className="table table-sm table--settings">
                <thead>
                  <tr>
                    <th scope="col">Omit</th>
                    <th scope="col">Header Name</th>
                    <th scope="col">Form Fields</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.headerToFieldMap
                    .filter(
                      obj => obj.header.toLowerCase() === 'datastore record id',
                    )
                    .map((obj, idx) => (
                      <tr key={obj.header + idx}>
                        <th scope="row">
                          <input
                            type="checkbox"
                            id="omit"
                            name={obj.header}
                            index={idx}
                            value={obj.field}
                            checked={obj.checked}
                            onChange={this.handleOmit}
                          />
                        </th>
                        <td>{obj.header}</td>
                        <td />
                      </tr>
                    ))}
                  {this.state.headerToFieldMap.map((obj, idx) => {
                    if (obj.header.toLowerCase() !== 'datastore record id') {
                      return (
                        <tr key={obj.header + idx}>
                          <th scope="row">
                            <input
                              type="checkbox"
                              id="omit"
                              name={obj.header}
                              index={idx}
                              value={obj.field}
                              checked={obj.checked}
                              onChange={this.handleOmit}
                            />
                          </th>
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

                            {this.state.missingFields.find(
                              fieldName => fieldName === obj.header,
                            ) ? (
                              <i className="fa fa-fw fa-exclamation-triangle text-warning" />
                            ) : (
                              <i className="fa fa-fw fa-check-circle text-success" />
                            )}
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            </Fragment>
          )}

          {/* // Reset or upload a new file */}
          {this.readFile && (
            <button
              className="btn btn-link"
              style={{ alignSelf: 'flex-end' }}
              onClick={this.handleReset}
            >
              Upload a new file
            </button>
          )}

          {/* // Review records that match */}
          {!this.props.processing &&
            !this.state.postResult &&
            this.state.records.size > 0 &&
            this.state.recordsHeaders.size > 0 && (
              <Fragment>
                <div className="text-center">
                  <h2>Review Records below.</h2>
                  <h4>The first 5 records are displayed below.</h4>
                </div>
                <Table className="table table-sm table--settings">
                  <thead>
                    <tr>
                      {this.state.headerToFieldMap.map((obj, idx) => (
                        <th scope="col" key={obj.header + idx}>
                          {obj.header}
                        </th>
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
                              obj.header.toLowerCase() === 'datastore record id'
                            ) {
                              return <td key={obj.field + idx}>{id}</td>;
                            }
                            return (
                              <td key={obj.field + idx}>{values[obj.field]}</td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Fragment>
            )}

          {/* // Import Records Button   */}
          {this.state.records.size > 0 &&
            this.state.missingFields.size <= 0 && (
              <button className="btn btn-secondary" onClick={this.handleImport}>
                Import Records
              </button>
            )}
        </div>
      </Fragment>
    );
  }
}

export const mapStateToProps = state => ({
  form: state.space.settingsDatastore.currentForm,
  percentComplete: state.space.settingsDatastore.importPercentComplete,
  importComplete: state.space.settingsDatastore.importComplete,
  failedCalls: state.space.settingsDatastore.importFailedCalls,
  processing: state.space.settingsDatastore.importProcessing,
});

export const mapDispatchToProps = {
  deleteAllSubmissions: actions.deleteAllSubmissions,
  executeImport: actions.executeImport,
  resetImportFailedCall: actions.resetImportFailedCall,
};

export const Import = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportComponent);
