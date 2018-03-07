import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { CoreForm } from 'react-kinetic-core';
import { PageTitle } from './PageTitle';

const globals = import('../globals');

export const FormPreviewComponent = ({
  match,
  handleSave,
  onFormLoaded,
  toggleClosed,
  isOpen,
}) => (
  <Modal isOpen={isOpen} size="lg">
    <PageTitle
      parts={[`Preview: ${match.params.slug ? match.params.slug : ''}`]}
    />
    <div className="modal-header">
      <h4 className="modal-title">
        <button type="button" className="btn btn-link" onClick={toggleClosed()}>
          Cancel
        </button>
        <span>New {match.params.slug ? match.params.slug : 'Task'}</span>
        <span>&nbsp;</span>
      </h4>
    </div>
    <ModalBody>
      <div style={{ margin: '12px' }}>
        <CoreForm
          form={match.params.slug}
          globals={globals}
          onLoaded={onFormLoaded}
        />
      </div>
    </ModalBody>
    {match.params.slug !== null && (
      <ModalFooter>
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </ModalFooter>
    )}
  </Modal>
);

const onFormLoaded = ({ setKForm }) => form => setKForm(form);
const handleSave = ({ kForm }) => () => kForm.submitPage();

export const FormPreview = compose(
  withState('isOpen', 'setIsOpen', true),
  withState('kForm', 'setKForm', null),
  withHandlers({
    handleSave,
    onFormLoaded,
    toggleClosed: ({ isOpen, setIsOpen }) => () => () => {
      if (isOpen) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    },
  }),
)(FormPreviewComponent);
