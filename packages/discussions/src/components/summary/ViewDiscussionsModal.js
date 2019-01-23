import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { DiscussionsPanel } from './DiscussionsPanel';
import { Discussion } from '../Discussion';

export const ViewDiscussionsModal = ({
  close,
  discussionId,
  itemKey,
  itemType,
  me,
  creationParams,
  modalBodyClassName,
}) => (
  <Modal isOpen size="lg" toggle={close}>
    <div className="modal-header">
      <h4 className="modal-title">
        <button type="button" className="btn btn-link" onClick={close}>
          Close
        </button>
        <span>{discussionId ? 'View Discussion' : 'View Discussions'}</span>
        <span />
      </h4>
    </div>
    <ModalBody className={modalBodyClassName}>
      {discussionId ? (
        <Discussion id={discussionId} />
      ) : (
        <DiscussionsPanel
          itemKey={itemKey}
          itemType={itemType}
          me={me}
          isModal
          creationParams={creationParams}
        />
      )}
    </ModalBody>
  </Modal>
);
