import React, { Fragment } from 'react';
import { compose, withHandlers } from 'recompose';
import { Modal, ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/settingsUsers';
import { connect } from '../../redux/store';
import { I18n } from '@kineticdata/react';
import downloadjs from 'downloadjs';
import papaparse from 'papaparse';

function createErrorCSV(users) {
  // Create csv string that will be used for download
  return papaparse.unparse(
    users.map(user => ({
      ...user,
      attributesMap: JSON.stringify(user.attributesMap),
      memberships: JSON.stringify(
        // Remove the slugs from the teams prior to export.
        user.memberships.reduce((acc, membership) => {
          const team = { team: { name: membership.team.name } };
          acc.push(team);
          return acc;
        }, []),
      ),
      profileAttributesMap: JSON.stringify(user.profileAttributesMap),
    })),
  );
}

const ImportModalComponent = ({
  importing,
  importCounts,
  failedImports,
  toggleModal,
  handleErrorDownload,
}) => (
  <Modal
    isOpen={!!importing}
    toggle={toggleModal}
    size="lg"
    keyboard={!importing}
  >
    <div className="modal-header">
      <h4 className="modal-title">
        {importing !== 'STARTED' && (
          <button onClick={toggleModal} type="button" className="btn btn-link">
            <I18n>Cancel</I18n>
          </button>
        )}
        <span>
          <I18n>Import Users</I18n>
        </span>
      </h4>
    </div>
    <ModalBody className="modal-body--import-export">
      <div style={{ padding: '1.5rem' }} className="text-center">
        <Fragment>
          <h2>
            <I18n>Importing Users</I18n>
          </h2>
          {importCounts.total && (
            <h4>
              {importCounts.total} <I18n>users being imported</I18n>
            </h4>
          )}
          {importing === 'COMPLETED' && (
            <Fragment>
              {failedImports.size > 0 && (
                <Fragment>
                  <I18n
                    render={translate => (
                      <h2 className="text-danger">
                        {`${failedImports.size} ${translate(
                          'users failed during the import process',
                        )} (${translate('%s creates and %s updates')
                          .replace(/%s/, importCounts.createFailure)
                          .replace(/%s/, importCounts.updateFailure)})`}
                      </h2>
                    )}
                  />
                  <h4>
                    <button
                      className="btn btn-text"
                      onClick={handleErrorDownload}
                    >
                      <I18n>Download Failed Users</I18n>
                    </button>
                  </h4>
                </Fragment>
              )}
              <I18n
                render={translate => (
                  <h2>
                    {`${importCounts.total - failedImports.size} ${translate(
                      'users imported successfully',
                    )} (${translate('%s creates and %s updates')
                      .replace(/%s/, importCounts.createSuccess)
                      .replace(/%s/, importCounts.updateSuccess)})`}
                  </h2>
                )}
              />
              <h4>
                <I18n>Click Cancel to close the modal</I18n>
              </h4>
            </Fragment>
          )}
        </Fragment>
      </div>
    </ModalBody>
  </Modal>
);

const mapStateToProps = state => ({
  importing: state.settingsUsers.importing,
  importCounts: state.settingsUsers.importCounts,
  failedImports: state.settingsUsers.importErrors,
});

const mapDispatchToProps = { importUsersReset: actions.importUsersReset };

export const ImportModal = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    toggleModal: props => () => {
      props.importUsersReset();
      if (typeof props.onClose === 'function') {
        props.onClose();
      }
    },
    handleErrorDownload: props => () => {
      downloadjs(
        createErrorCSV(props.failedImports.toJS()),
        'user_import_errors.csv',
        'text/csv',
      );
    },
  }),
)(ImportModalComponent);
