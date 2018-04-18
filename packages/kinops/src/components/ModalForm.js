import React from 'react';
import { CoreForm } from 'react-kinetic-core';
import { Modal, ModalBody } from 'reactstrap';
import { ErrorNotFound, ErrorUnauthorized, ErrorUnexpected } from 'common';

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
          <div className="modal-confirmation">
            <h5>{form.confirmationMessage}</h5>
          </div>
        ) : (
          <CoreForm
            kapp={form.kappSlug}
            form={form.formSlug}
            values={form.values}
            globals={globals}
            onCompleted={handleCompleted}
            notFoundComponent={ErrorNotFound}
            unauthorizedComponent={ErrorUnauthorized}
            unexpectedErrorComponent={ErrorUnexpected}
          />
        )}
      </ModalBody>
    </Modal>
  );
