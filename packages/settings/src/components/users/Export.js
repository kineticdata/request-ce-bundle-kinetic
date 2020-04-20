import React, { Fragment } from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import downloadjs from 'downloadjs';
import papaparse from 'papaparse';
import { actions } from '../../redux/modules/settingsUsers';
import { connect } from '../../redux/store';
import { I18n } from '@kineticdata/react';

const ExportComponent = ({ users, exportStatus, handleDownload }) =>
  users && (
    <Fragment>
      <div className="text-center">
        {exportStatus === 'NOT_STARTED' ? (
          <Fragment>
            <h2>
              <I18n>This process will export as a .csv file</I18n>
            </h2>
            <h4>
              <I18n>Please don't close modal until confirmation</I18n>
            </h4>
            <button className="btn btn-primary" onClick={handleDownload}>
              {1 === 2 ? (
                <span>
                  <I18n>Export Users for Query</I18n>
                </span>
              ) : (
                <span>
                  <I18n>Export All Users</I18n>
                </span>
              )}
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <h2>
              <I18n>Retrieving Users</I18n>
            </h2>
            <h4>
              {users.length} <I18n>users retrieved</I18n>
            </h4>
            {/* TODO: Warp user feedback in a conditional if exportStatus === Failed */}
            {exportStatus === 'CONVERT' && (
              <h4>
                <I18n>Converting Records to CSV format</I18n>
              </h4>
            )}
            {exportStatus === 'DOWNLOAD' && (
              <I18n
                render={translate => (
                  <h4>{`${translate('Downloading')} ${users.length} ${translate(
                    'Records to',
                  )} users.csv`}</h4>
                )}
              />
            )}
            {exportStatus === 'COMPLETE' && (
              <Fragment>
                <I18n
                  render={translate => (
                    <h2>
                      {`${users.length} ${translate(
                        'Users exported to',
                      )} users.csv`}
                    </h2>
                  )}
                />
                <h4>
                  <I18n>Click Cancel to close the modal</I18n>
                </h4>
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </Fragment>
  );

function createCSV(users) {
  // Create csv string that will be used for download
  return papaparse.unparse(users);
}

const handleDownload = props => () => {
  props.fetchAllUsers();
  props.setExportStatus('FETCHING_RECORDS');
};

const mapStateToProps = state => ({
  kappSlug: state.app.kappSlug,
  users: state.settingsUsers.exportUsers,
});

const mapDispatchToProps = {
  fetchAllUsers: actions.fetchAllUsers,
  setExportUsers: actions.setExportUsers,
};

export const Export = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('exportStatus', 'setExportStatus', 'NOT_STARTED'),
  withHandlers({
    handleDownload,
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.users.length !== nextProps.users.length) {
        nextProps.setExportStatus('CONVERT');
        const csv = createCSV(nextProps.users);
        // TODO: If CSV fails setExportStatus to FAILED
        nextProps.setExportStatus('DOWNLOAD');
        downloadjs(csv, 'users.csv', 'text/csv');
        nextProps.setExportStatus('COMPLETE');
      }
    },
    componentWillUnmount() {
      this.props.setExportUsers([]);
    },
  }),
)(ExportComponent);
