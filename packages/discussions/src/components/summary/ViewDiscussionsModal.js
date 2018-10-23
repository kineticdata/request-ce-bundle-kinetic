import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { DiscussionsList } from './DiscussionsList';

export const ViewDiscussionsModal = ({
  close,
  handleCreateDiscussion,
  handleDiscussionClick,
  discussions,
  me,
}) => (
  <Modal isOpen size="lg" toggle={close}>
    <div className="modal-header">
      <h4 className="modal-title">
        <button type="button" className="btn btn-link" onClick={close}>
          Close
        </button>
        <span>View Discussions</span>
        <span />
      </h4>
    </div>
    <ModalBody>
      <div
        style={{ margin: '1em' }}
        className="recent-discussions-wrapper kinops-discussions"
      >
        <DiscussionsList
          handleCreateDiscussion={handleCreateDiscussion}
          handleDiscussionClick={handleDiscussionClick}
          discussions={discussions}
          me={me}
        />
      </div>
    </ModalBody>
  </Modal>
);
