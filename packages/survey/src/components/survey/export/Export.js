import React, { Fragment } from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import downloadjs from 'downloadjs';
import { connect } from 'react-redux';
import papaparse from 'papaparse';
import { actions } from '../../../redux/modules/surveys';
import { context } from '../../../redux/store';
import { I18n } from '@kineticdata/react';

const ExportComponent = ({
  submissions,
  exportStatus,
  submissionsCount,
  handleDownload,
  form,
}) =>
  submissions && (
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
                  <I18n>Export Records for Query</I18n>
                </span>
              ) : (
                <span>
                  <I18n>Export All Records</I18n>
                </span>
              )}
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <h2>
              <I18n>Retrieving Records</I18n>
            </h2>
            <h4>
              {submissionsCount} <I18n>records retrieved</I18n>
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
                  <h4>{`${translate(
                    'Downloading',
                  )} ${submissionsCount} ${translate('Records to')} ${
                    form.name
                  }.csv`}</h4>
                )}
              />
            )}
            {exportStatus === 'COMPLETE' && (
              <Fragment>
                <I18n
                  render={translate => (
                    <h2>
                      {`${submissionsCount} ${translate(
                        'Records exported to',
                      )} ${form.name}.csv`}
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
  props.fetchAllSubmissions({
    formSlug: props.form.slug,
    kappSlug: props.kappSlug,
    accumulator: [],
  });
  props.setExportStatus('FETCHING_RECORDS');
};

const mapStateToProps = state => ({
  kappSlug: state.app.kappSlug,
  form: state.surveys.form,
  submissions: state.surveys.exportSubmissions,
  submissionsCount: state.surveys.exportCount,
});

const mapDispatchToProps = {
  fetchAllSubmissions: actions.fetchAllSubmissions,
  setExportSubmissions: actions.setExportSubmissions,
};

export const Export = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('exportStatus', 'setExportStatus', 'NOT_STARTED'),
  withHandlers({
    handleDownload,
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.submissions.length !== nextProps.submissions.length) {
        nextProps.setExportStatus('CONVERT');
        const csv = createCSV(nextProps.submissions, nextProps.form);
        // TODO: If CSV fails setExportStatus to FAILD
        nextProps.setExportStatus('DOWNLOAD');
        downloadjs(csv, nextProps.form.name + '.csv', 'text/csv');
        nextProps.setExportStatus('COMPLETE');
      }
    },
    componentWillUnmount() {
      this.props.setExportSubmissions([]);
    },
  }),
)(ExportComponent);
