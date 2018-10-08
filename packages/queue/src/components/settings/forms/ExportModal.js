import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';

import { actions } from '../../../redux/modules/settingsForms';

import { Export } from './Export';

const ExportModalComponent = ({
  modalIsOpen,
  closeModal,
  modalName,
  filter,
  createSearchQuery,
}) => (
  <Modal isOpen={modalIsOpen} toggle={closeModal}>
    <div className="modal-header">
      <h4 className="modal-title">
        <button onClick={closeModal} type="button" className="btn btn-link">
          Cancel
        </button>
        <span>{modalName === 'import' ? 'Import' : 'Export'} Records</span>
        <span>&nbsp;</span>
      </h4>
    </div>
    <ModalBody>
      <div style={{ padding: '1rem' }}>
        <Export filter={filter} createSearchQuery={createSearchQuery} />
      </div>
    </ModalBody>
  </Modal>
);

const mapStateToProps = state => ({
  modalIsOpen: state.queue.settingsForms.modalIsOpen,
  modalName: state.queue.settingsForms.modalName,
});

const mapDispatchToProps = {
  closeModal: actions.closeModal,
};

export const ExportModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportModalComponent);
