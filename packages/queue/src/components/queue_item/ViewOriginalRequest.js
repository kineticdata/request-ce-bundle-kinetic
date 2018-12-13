import React from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Modal, ModalBody } from 'reactstrap';
import { CoreForm } from 'react-kinetic-core';

const globals = import('common/globals');

export const ViewOriginalRequestComponent = ({
  originId,
  toggleOpen,
  isOpen,
}) =>
  originId && (
    <div>
      <button
        className="btn btn-primary btn-inverse request-button"
        type="button"
        onClick={toggleOpen}
      >
        View Original Request
      </button>
      <Modal isOpen={isOpen} toggle={toggleOpen} size="lg" backdrop="static">
        <div className="modal-header">
          <h4 className="modal-title">
            <button type="button" className="btn btn-link" onClick={toggleOpen}>
              Close
            </button>
            <span>Original Request</span>
            <span />
          </h4>
        </div>
        <ModalBody>
          <div style={{ margin: '1em' }}>
            <CoreForm globals={globals} submission={originId} review />
          </div>
        </ModalBody>
      </Modal>
    </div>
  );

export const ViewOriginalRequest = compose(
  withState('isOpen', 'setIsOpen', false),
  withProps(props => ({
    originId: props.queueItem.origin.id,
  })),
  withHandlers({
    toggleOpen: ({ setIsOpen, isOpen }) => () => setIsOpen(!isOpen),
  }),
)(ViewOriginalRequestComponent);
