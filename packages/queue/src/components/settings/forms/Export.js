import React, { Fragment } from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';

import papaparse from 'papaparse';

import { actions } from '../../../redux/modules/settingsForms';
import { I18n } from '@kineticdata/react';
import { connect } from '../../../redux/store';

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
  form: state.settingsForms.currentForm,
  kappSlug: state.app.kappSlug,
  submissions: state.settingsForms.exportSubmissions,
  submissionsCount: state.settingsForms.exportCount,
  downloaded: state.settingsForms.downloaded,
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
    componentWillReceiveProps(nextProps) {
      if (nextProps.exportStatus === 'FETCHING_RECORDS') {
        nextProps.setExportStatus('CONVERT');
        const csv = createCSV(nextProps.submissions, nextProps.form);
        // TODO: If CSV fails setExportStatus to FAILED
        nextProps.setExportStatus('DOWNLOAD');
        download(nextProps.form.name, csv);
        nextProps.setExportStatus('COMPLETE');
        nextProps.setDownloaded(true);
      }
    },
  }),
)(ExportComponent);
