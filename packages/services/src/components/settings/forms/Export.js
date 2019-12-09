import React, { Fragment } from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import downloadjs from 'downloadjs';
import papaparse from 'papaparse';

import { actions } from '../../../redux/modules/settingsForms';
import { connect } from '../../../redux/store';
import { I18n } from '@kineticdata/react';

const ExportComponent = ({
  submissions,
  exportStatus,
  submissionsCount,
  handleDownload,
  form,
}) => (
  <Fragment>
    {exportStatus === 'NOT_STARTED' ? (
      <button className="btn btn-info" onClick={handleDownload}>
        <span>
          <I18n>Export Records</I18n>
        </span>
      </button>
    ) : (
      <Fragment>
        <p>
          {submissionsCount} <I18n>Records retrieved</I18n>
        </p>
        {/* TODO: Warp user feedback in a conditional if exportStatus === Failed */}
        {exportStatus === 'CONVERT' && (
          <p>
            <I18n>Converting Records to CSV format</I18n>
          </p>
        )}
        {exportStatus === 'DOWNLOAD' && (
          <p>
            <I18n
              render={translate =>
                `${translate('Downloading')} ${submissionsCount} ${translate(
                  'Records to',
                )} ${form.name}.csv`
              }
            />
          </p>
        )}
        {exportStatus === 'COMPLETE' && (
          <Fragment>
            <p>
              <I18n
                render={translate =>
                  `${submissionsCount} ${translate('Records exported to')} ${
                    form.name
                  }.csv`
                }
              />
            </p>
            <p>
              <I18n>Click Cancel to close the modal</I18n>
            </p>
          </Fragment>
        )}
      </Fragment>
    )}
  </Fragment>
);

function createCSV(submissions, form) {
  // Create csv string that will be used for download
  return papaparse.unparse(
    submissions.reduce((acc, submission) => {
      let submissionValues = submission.values;
      /** Because of the parser use the fields currently on the form to build the csv string.
       * This will exclude fields (from the csv) that existed on the form but have been removed.
       */
      form.fields.forEach(field => {
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
        'Submission Record ID': submission.id,
        ...submissionValues,
      });
      return acc;
    }, []),
  );
}

const handleDownload = props => () => {
  const q = props.createSearchQuery(props.filter);
  if (!props.downloaded) {
    props.fetchAllSubmissions({
      kappSlug: props.kappSlug,
      formSlug: props.form.slug,
      accumulator: [],
      q: q,
    });
  }
  props.setExportStatus('FETCHING_RECORDS');
};

const mapStateToProps = state => ({
  kappSlug: state.app.kappSlug,
  submissions: state.settingsForms.exportSubmissions,
  submissionsCount: state.settingsForms.exportCount,
  downloaded: state.settingsForms.downloaded,
  fetchingAll: state.settingsForms.fetchingAll,
});

const mapDispatchToProps = {
  fetchAllSubmissions: actions.fetchAllSubmissions,
  setDownloaded: actions.setDownloaded,
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
        this.props.exportStatus === 'FETCHING_RECORDS' &&
        this.props.submissions.length > 0 &&
        prevProps.submissions.length === 0
      ) {
        this.props.setExportStatus('CONVERT');
        const csv = createCSV(this.props.submissions, this.props.form);
        // TODO: If CSV fails setExportStatus to FAILED
        this.props.setExportStatus('DOWNLOAD');
        downloadjs(csv, this.props.form.name + '.csv', 'text/csv');
        this.props.setExportStatus('COMPLETE');
        // this.props.setDownloaded(true);
      }
    },
  }),
)(ExportComponent);
