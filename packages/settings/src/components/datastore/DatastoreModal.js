import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';

import { actions } from '../../redux/modules/settingsDatastore';
import { context } from '../../redux/store';

import { Export } from './Export';
import { Import } from './Import';
import { I18n } from '@kineticdata/react';

const DatastoreModalComponent = ({ modalIsOpen, closeModal, modalName }) => (
  <Modal isOpen={modalIsOpen} toggle={closeModal} size="lg">
    <div className="modal-header">
      <h4 className="modal-title">
        <button onClick={closeModal} type="button" className="btn btn-link">
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>{modalName === 'import' ? 'Import' : 'Export'} Records</I18n>
        </span>
      </h4>
    </div>
    <ModalBody className="modal-body--import-export">
      <div style={{ padding: '1.5rem' }}>
        {modalName === 'import' ? <Import /> : <Export />}
      </div>
    </ModalBody>
  </Modal>
);

const mapStateToProps = state => ({
  modalIsOpen: state.settingsDatastore.modalIsOpen,
  modalName: state.settingsDatastore.modalName,
});

const mapDispatchToProps = {
  closeModal: actions.closeModal,
};

export const DatastoreModal = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { context },
)(DatastoreModalComponent);
