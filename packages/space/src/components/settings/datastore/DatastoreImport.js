import React, { Component } from 'react';
import { CoreAPI } from 'react-kinetic-core';
import { Table } from 'reactstrap';
import csv from 'csvtojson';

export class DatastoreImport extends Component {
  constructor(props) {
    super(props);

    this.state = { submissions: [], form: {} };
    this.calls = [];
    this.failedCalls = [];
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
          formSlug: this.props.formSlug,
          values: head.values,
        })
      : CoreAPI.createSubmission({
          datastore: true,
          formSlug: this.props.formSlug,
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
      form: this.props.formSlug,
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
      formSlug: this.props.formSlug,
      include: 'fields',
    }).then(response => this.setState({ form: response.form }));
  };

  handleDelete = event => {
    this.delete(this.state.submissions);
  };

  handleChange = event => {
    let arr = [];
    const reader = new FileReader();
    reader.readAsText(this.fileEl.files[0]);
    reader.onload = event => {
      csv({ noheader: false })
        .fromString(event.target.result)
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
            <input
              type="file"
              onChange={this.handleChange}
              ref={element => {
                this.fileEl = element;
              }}
            />
          </div>
          <div className="forms-list-wrapper">
            {this.state.submissions.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Field 1</th>
                    <th>Field 2</th>
                    <th>Field 3</th>
                    <th>Field 4</th>
                    <th>Field 5</th>
                    <th>Field 6</th>
                    <th>Field 7</th>
                    <th>Field 8</th>
                    <th>Field 9</th>
                    <th>Field 10</th>
                    <th>Field 11</th>
                    <th>Field 12</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.submissions.map(submission => {
                    const { values } = submission;
                    return (
                      <tr>
                        <td>{values['Resource ID']}</td>
                        <td>{values['History Displayed']}</td>
                        <td>{values['History']}</td>
                        <td>{values['Room Name']}</td>
                        <td>{values['Phone']}</td>
                        <td>{values['Headline']}</td>
                        <td>{values['Description']}</td>
                        <td>{values['Capacity']}</td>
                        <td>{values['Seating']}</td>
                        <td>{values['Equipment-Video Conference']}</td>
                        <td>{values['Equipment-Speakerphone']}</td>
                        <td>{values['Equipment-White Board']}</td>
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
