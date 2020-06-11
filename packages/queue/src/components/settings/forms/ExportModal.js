import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { actions } from '../../../redux/modules/settingsForms';
import { connect } from '../../../redux/store';
import { Export } from './Export';
import { I18n } from '@kineticdata/react';

const ExportModalComponent = ({ modalIsOpen, closeModal, form, filter }) => (
  <Modal isOpen={modalIsOpen} toggle={closeModal} size="lg">
    <div className="modal-header">
      <h4 className="modal-title">
        <button onClick={closeModal} type="button" className="btn btn-link">
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>Export Records</I18n>
        </span>
      </h4>
    </div>
    <ModalBody className="modal-body--import-export">
      <div style={{ padding: '1.5rem' }}>
        <Export filter={filter} form={form} />
      </div>
    </ModalBody>
  </Modal>
);

const mapStateToProps = state => ({
  modalIsOpen: state.settingsForms.modalIsOpen,
  modalName: state.settingsForms.modalName,
});

const mapDispatchToProps = {
  closeModal: actions.closeModal,
};

export const ExportModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportModalComponent);
