import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { DiscussionsPanel } from './DiscussionsPanel';

export const ViewDiscussionsModal = ({
  close,
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
        <span>View Discussions</span>
        <span />
      </h4>
    </div>
    <ModalBody className={modalBodyClassName}>
      <DiscussionsPanel
        itemKey={itemKey}
        itemType={itemType}
        me={me}
        isModal
        creationParams={creationParams}
      />
    </ModalBody>
  </Modal>
);
