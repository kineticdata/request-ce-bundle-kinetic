import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { DiscussionsPanel } from './DiscussionsPanel';
import { Discussion } from '../Discussion';
import { I18n } from '@kineticdata/react';

export const ViewDiscussionsModal = ({
  close,
  discussionId,
  itemKey,
  itemType,
  me,
  creationFields,
  onCreated,
  CreationForm,
  modalBodyClassName,
}) => (
  <Modal isOpen size="lg" toggle={close}>
    <div className="modal-header">
      <h4 className="modal-title">
        <button type="button" className="btn btn-link" onClick={close}>
          <I18n>Close</I18n>
        </button>
        <span>
          <I18n>{discussionId ? 'View Discussion' : 'View Discussions'}</I18n>
        </span>
      </h4>
    </div>
    <ModalBody className={modalBodyClassName}>
      {discussionId ? (
        <Discussion id={discussionId} me={me} />
      ) : (
        <DiscussionsPanel
          itemKey={itemKey}
          itemType={itemType}
          me={me}
          isModal
          creationFields={creationFields}
          onCreated={onCreated}
          CreationForm={CreationForm}
        />
      )}
    </ModalBody>
  </Modal>
);
