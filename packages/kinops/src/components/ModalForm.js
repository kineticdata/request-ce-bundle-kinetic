import React from 'react';
import { CoreForm } from 'react-kinetic-core';
import { Modal, ModalBody } from 'reactstrap';

export const ModalForm = ({
  form,
  isCompleted,
  handleCompleted,
  handleClosed,
  globals,
}) =>
  form && (
    <Modal isOpen toggle={handleClosed} size="lg">
      <div className="modal-header">
        <h4 className="modal-title">
          <button type="button" className="btn btn-link" onClick={handleClosed}>
            Cancel
          </button>
          <span>{form.title}</span>
          <span />
        </h4>
      </div>
      <ModalBody>
        {isCompleted ? (
          <h5>{form.confirmationMessage}</h5>
        ) : (
          <CoreForm
            kapp={form.kappSlug}
            form={form.formSlug}
            values={form.values}
            globals={globals}
            onCompleted={handleCompleted}
          />
        )}
      </ModalBody>
    </Modal>
  );
