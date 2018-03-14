import React, { Component } from 'react';
import { CoreFormModal } from 'react-kinetic-core';
import DocumentTitle from 'react-document-title';

export class FormSample extends Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
    this.closeForm = this.closeForm.bind(this);
    this.openForm = this.openForm.bind(this);
  }

  openForm() {
    this.setState({ editing: true });
  }

  closeForm() {
    this.setState({ editing: false });
  }

  render() {
    return (
      <DocumentTitle title="Form Sample">
        <div className="form-sample">
          {this.state.editing ? (
            <CoreFormModal
              form="testing"
              dismissed={this.closeForm}
              completed={this.closeForm}
            />
          ) : (
            <button type="button" onClick={this.openForm}>
              Open Form
            </button>
          )}
        </div>
      </DocumentTitle>
    );
  }
}
