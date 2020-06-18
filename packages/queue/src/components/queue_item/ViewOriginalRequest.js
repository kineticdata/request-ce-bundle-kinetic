import React from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Modal, ModalBody } from 'reactstrap';
import { CoreForm } from '@kineticdata/react';
import { I18n } from '@kineticdata/react';

const globals = import('common/globals');

export const ViewOriginalRequestComponent = ({
  originId,
  toggleOpen,
  isOpen,
}) =>
  originId && (
    <div>
      <button
        className="btn btn-inverse request-button"
        type="button"
        onClick={toggleOpen}
      >
        <I18n>View Original Request</I18n>
      </button>
      <Modal isOpen={isOpen} toggle={toggleOpen} size="lg" backdrop="static">
        <div className="modal-header">
          <div className="modal-title">
            <button type="button" className="btn btn-link" onClick={toggleOpen}>
              <I18n>Close</I18n>
            </button>
            <span>
              <I18n>Original Request</I18n>
            </span>
          </div>
        </div>
        <ModalBody>
          <div style={{ margin: '1em' }}>
            <I18n submissionId={originId}>
              <CoreForm globals={globals} submission={originId} review />
            </I18n>
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
