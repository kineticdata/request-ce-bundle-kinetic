import React, { Component } from 'react';
import { CoreAPI } from 'react-kinetic-core';
import { Table } from 'reactstrap';
import { Toast } from 'common';
import csv from 'csvtojson';

export class DatastoreImport extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.match.params.slug);
    this.state = {
      submissions: [],
      formSlug: this.props.match.params.slug,
      missingFields: [],
    };
    this.form = {};
    this.formFields = [];
    this.calls = [];
    this.failedCalls = [];
    this.readFile = null;
  }

  responseHandler = arr => result => {
    if (result.serverError || result.errors) {
      this.failedCalls.push(result);
    }

    if (arr.length > 0) {
      this.post(arr);
    } else {
      Promise.all(this.calls).then(this.fetch);
    }

    return result;
  };

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

    promise.then(this.responseHandler(tail));
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
      include: 'fields',
    }).then(response => {
      if (response.serverError || response.errors) {
      } else {
        this.form = response.form;
        this.formFields = response.form.fields.reduce((acc, field) => {
          acc.push(field.name);
          return acc;
        }, []);
      }
    });
  };

  handleDelete = () => this.delete(this.state.submissions);

  handleImport = () => {
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
        this.post(arr);
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
          let acc = [];
          const allHeadersFound = headers.every(header => {
            if (
              classThis.formFields.includes(header) ||
              header === 'Datastore Record ID'
            ) {
              return true;
            }
            acc.push(header);
            return false;
          });
          if (!allHeadersFound) {
            classThis.setState({ missingFields: acc });
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
            <button
              className="btn btn-primary btn-sm"
              onClick={this.handleDelete}
            >
              Delete Records
            </button>
            {this.readFile &&
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
            {this.state.submissions.length > 0 && (
              <Table style={{ maxWidth: '80%' }}>
                <thead>
                  <tr>
                    {Object.keys(this.state.submissions[0].values)
                      .sort()
                      .map(header => <th>{header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {this.state.submissions.map(submission => {
                    const { values, id } = submission;
                    return (
                      <tr key={id}>
                        {Object.keys(values)
                          .sort()
                          .map(fieldName => <td>{values[fieldName]}</td>)}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </div>
    );
  }
}
