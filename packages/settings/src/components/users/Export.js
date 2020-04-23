import React, { Fragment } from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import downloadjs from 'downloadjs';
import papaparse from 'papaparse';
import { actions } from '../../redux/modules/settingsUsers';
import { connect } from '../../redux/store';
import { I18n } from '@kineticdata/react';
import { List } from 'immutable';

const ExportComponent = ({
  exporting,
  users,
  exportStatus,
  handleDownload,
}) => (
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
            {users.size} <I18n>users retrieved</I18n>
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
                <h4>{`${translate('Downloading')} ${users.size} ${translate(
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
                    {`${users.size} ${translate(
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

const handleDownload = props => () => {
  props.fetchAllUsers();
  props.setExportStatus('FETCHING_RECORDS');
};

const mapStateToProps = state => ({
  kappSlug: state.app.kappSlug,
  exporting: state.settingsUsers.fetchingAll,
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
    componentDidUpdate(prevProps) {
      if (
        !this.props.exporting &&
        prevProps.exporting &&
        this.props.users.size > 0
      ) {
        this.props.setExportStatus('CONVERT');
        const csv = createCSV(this.props.users.toJS());
        // TODO: If CSV fails setExportStatus to FAILED
        this.props.setExportStatus('DOWNLOAD');
        downloadjs(csv, 'users.csv', 'text/csv');
        this.props.setExportStatus('COMPLETE');
      }
    },
    componentWillUnmount() {
      this.props.setExportUsers({ data: List() });
    },
  }),
)(ExportComponent);
