import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';

import { actions } from '../../../redux/modules/settingsDatastore';

import { Export } from './Export';
import { Import } from './Import';

const DatastoreModalComponent = ({ modalIsOpen, closeModal, modalName }) => (
  <Modal isOpen={modalIsOpen} toggle={closeModal} size="lg">
    <div className="modal-header">
      <h4 className="modal-title">
        <button onClick={closeModal} type="button" className="btn btn-link">
          Cancel
        </button>
        <span>{modalName === 'import' ? 'Import' : 'Export'} Records</span>
        <span>&nbsp;</span>
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
  modalIsOpen: state.space.settingsDatastore.modalIsOpen,
  modalName: state.space.settingsDatastore.modalName,
});

const mapDispatchToProps = {
  closeModal: actions.closeModal,
};

export const DatastoreModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DatastoreModalComponent);
