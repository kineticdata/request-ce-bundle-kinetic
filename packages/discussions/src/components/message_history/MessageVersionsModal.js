import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { MessageVersions } from './MessageVersions';

export class MessageVersionsModal extends Component {
  render() {
    return (
      <Modal isOpen={this.props.message !== null} toggle={this.props.close}>
        <div className="modal-header">
          <h4 className="modal-title">
            <button
              type="button"
              className="btn btn-link"
              onClick={this.props.close}
            >
              Close
            </button>
            <span>Message History</span>
          </h4>
        </div>
        <ModalBody>
          <MessageVersions
            discussion={this.props.discussion}
            message={this.props.message}
          />
        </ModalBody>
      </Modal>
    );
  }
}
