import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { compose, withHandlers, withState } from 'recompose';

import { connect } from 'react-redux';
import papaparse from 'papaparse';

import { actions } from '../../../redux/modules/settingsDatastore';

const ImportExportModalComponent = ({
  modalIsOpen,
  submissions,
  closeModal,
  handleDownload,
}) => (
  <Modal isOpen={modalIsOpen} toggle={closeModal}>
    <div className="modal-header">
      <h4 className="modal-title">
        <button onClick={closeModal} type="button" className="btn btn-link">
          Cancel
        </button>
        <span>Export Records</span>
        <span>&nbsp;</span>
      </h4>
    </div>
    <ModalBody>
      {submissions.size > 0 && (
        <div style={{ padding: '1rem' }}>
          <p>There are {submissions.size} records in memory</p>
          <button className="btn btn-info" onClick={handleDownload}>
            Export {submissions.size} Records
          </button>
        </div>
      )}
    </ModalBody>
  </Modal>
);

function download(filename, data) {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/csv;charset=utf-8,' + encodeURIComponent(data),
  );
  element.setAttribute('download', filename + '.csv');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function createCSV(submissions, form) {
  // Create csv string that will be used for download
  return papaparse.unparse(
    submissions.reduce((acc, submission) => {
      let submissionValues = submission.values;
      /** Because of the parser use the fields currently on the form to build the csv string.
       * This will exclude fields (from the csv) that existed on the form but have been removed.
       */
      form.get('fields').forEach(field => {
        // If older submissions don't have a new field then add it with a value of null.
        if (submissionValues.hasOwnProperty(field.name)) {
          // Checkbox Array values must be stringifyed to retain their array brackets.
          if (Array.isArray(submissionValues[field.name])) {
            submissionValues[field.name] = JSON.stringify(
              submissionValues[field.name],
            );
          }
        } else {
          submissionValues[field.name] = null;
        }
        return null;
      });
      acc.push({
        'DataStore Record ID': submission.id,
        ...submissionValues,
      });
      return acc;
    }, []),
  );
}

const handleDownload = props => () => {
  const data = createCSV(props.submissions, props.form);
  download(props.form.name, data);
};

const mapStateToProps = state => ({
  modalIsOpen: state.space.settingsDatastore.modalIsOpen,
  submissions: state.space.settingsDatastore.submissions,
  form: state.space.settingsDatastore.currentForm,
});

const mapDispatchToProps = {
  closeModal: actions.closeModal,
};

export const ImportExportModal = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('data', 'setData', null),
  withHandlers({
    handleDownload,
  }),
)(ImportExportModalComponent);
