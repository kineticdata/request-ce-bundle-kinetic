import React, { Fragment } from 'react';
import { connect } from '../../../redux/store';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { Alert } from 'reactstrap';
import { I18n, Moment } from '@kineticdata/react';
import { actions } from '../../../redux/modules/export';
import {
  APPOINTMENT_FORM_SLUG,
  DATE_FORMAT,
  FEEDBACK_FORM_SLUG,
  GENERAL_FEEDBACK_FORM_SLUG,
  WALK_IN_FORM_SLUG,
} from '../../../constants';
import moment from 'moment';
import downloadjs from 'downloadjs';
import papaparse from 'papaparse';

export const MetricsExportComponent = ({
  selectedDate,
  scheduler,
  eventType,
  exporting,
  data,
  error,
  exportStatus,
  setExportStatus,
  exportMessage,
  setExportMessage,
  filename,
  setFilename,
  processExport,
}) => {
  const date = moment(selectedDate);
  return date.isValid() ? (
    <div className="row">
      <div className="col-12">
        <Alert
          color="info"
          isOpen={!!exportStatus}
          toggle={!exporting ? () => setExportStatus(null) : undefined}
        >
          {!error ? (
            <Fragment>
              {exportStatus === 'Exporting' && (
                <Fragment>
                  <span className="fa fa-spinner fa-spin fa-fw" />
                  <I18n>{exportMessage}</I18n>
                </Fragment>
              )}
              {exportStatus === 'Empty' && (
                <Fragment>
                  <I18n>No records found for the selected date range.</I18n>
                </Fragment>
              )}
              {exportStatus === 'Completed' && (
                <Fragment>
                  <I18n
                    render={translate =>
                      translate('Exported # record(s) to').replace(
                        '#',
                        data.size,
                      )
                    }
                  />{' '}
                  <strong>{filename}</strong>
                </Fragment>
              )}
            </Fragment>
          ) : (
            <Fragment>
              <span className="fa fa-exclamation-triangle fa-fw" />
              <I18n
                render={translate => `${translate('Export failed:')} ${error}`}
              />
            </Fragment>
          )}
        </Alert>
      </div>

      <div className="col-lg-6 mb-5">
        <div className="section__title export-title">
          <I18n>Appointments</I18n>
          <I18n
            render={translate => (
              <small>
                {`${translate('for')} ${translate(
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                )}${scheduler && eventType ? `: ${translate(eventType)}` : ''}`}
              </small>
            )}
          />
        </div>
        <div className="export-buttons">
          <button
            className="btn btn-primary"
            disabled={exporting}
            onClick={() => {
              setExportMessage('Exporting Appointment Records');
              setFilename(
                `${[
                  date.format('YYYY-MM-DD'),
                  'Appointments',
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                  scheduler && eventType ? eventType : undefined,
                ]
                  .filter(a => a)
                  .join(' - ')}.csv`,
              );
              processExport(APPOINTMENT_FORM_SLUG, false);
            }}
          >
            <I18n>Export for</I18n>{' '}
            <Moment timestamp={date} format="dddd, LL" />
          </button>
          <button
            className="btn btn-primary"
            disabled={exporting}
            onClick={() => {
              setExportMessage('Exporting Appointment Records');
              setFilename(
                `${[
                  date.format('YYYY-MM'),
                  'Appointments',
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                  scheduler && eventType ? eventType : undefined,
                ]
                  .filter(a => a)
                  .join(' - ')}.csv`,
              );
              processExport(APPOINTMENT_FORM_SLUG, true);
            }}
          >
            <I18n>Export for</I18n>{' '}
            <Moment timestamp={date} format="MMMM YYYY" />
          </button>
        </div>
      </div>

      <div className="col-lg-6 mb-5">
        <div className="section__title export-title">
          <I18n>Walk-Ins</I18n>
          <I18n
            render={translate => (
              <small>
                {`${translate('for')} ${translate(
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                )}${scheduler && eventType ? `: ${translate(eventType)}` : ''}`}
              </small>
            )}
          />
        </div>
        <div className="export-buttons">
          <button
            className="btn btn-primary"
            disabled={exporting}
            onClick={() => {
              setExportMessage('Exporting Walk-In Records');
              setFilename(
                `${[
                  date.format('YYYY-MM-DD'),
                  'Walk-Ins',
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                  scheduler && eventType ? eventType : undefined,
                ]
                  .filter(a => a)
                  .join(' - ')}.csv`,
              );
              processExport(WALK_IN_FORM_SLUG, false);
            }}
          >
            <I18n>Export for</I18n>{' '}
            <Moment timestamp={date} format="dddd, LL" />
          </button>
          <button
            className="btn btn-primary"
            disabled={exporting}
            onClick={() => {
              setExportMessage('Exporting Walk-In Records');
              setFilename(
                `${[
                  date.format('YYYY-MM'),
                  'Walk-Ins',
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                  scheduler && eventType ? eventType : undefined,
                ]
                  .filter(a => a)
                  .join(' - ')}.csv`,
              );
              processExport(WALK_IN_FORM_SLUG, true);
            }}
          >
            <I18n>Export for</I18n>{' '}
            <Moment timestamp={date} format="MMMM YYYY" />
          </button>
        </div>
      </div>

      <div className="col-lg-6 mb-5">
        <div className="section__title export-title">
          <I18n>Appointment Feedback</I18n>
          <I18n
            render={translate => (
              <small>
                {`${translate('for')} ${translate(
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                )}`}
              </small>
            )}
          />
        </div>
        <div className="export-buttons">
          <button
            className="btn btn-primary"
            disabled={exporting}
            onClick={() => {
              setExportMessage('Exporting Appointment Feedback Records');
              setFilename(
                `${[
                  date.format('YYYY-MM-DD'),
                  'Appointment Feedback',
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                ].join(' - ')}.csv`,
              );
              processExport(FEEDBACK_FORM_SLUG, false);
            }}
          >
            <I18n>Export for</I18n>{' '}
            <Moment timestamp={date} format="dddd, LL" />
          </button>
          <button
            className="btn btn-primary"
            disabled={exporting}
            onClick={() => {
              setExportMessage('Exporting Appointment Feedback Records');
              setFilename(
                `${[
                  date.format('YYYY-MM'),
                  'Appointment Feedback',
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                ].join(' - ')}.csv`,
              );
              processExport(FEEDBACK_FORM_SLUG, true);
            }}
          >
            <I18n>Export for</I18n>{' '}
            <Moment timestamp={date} format="MMMM YYYY" />
          </button>
        </div>
      </div>

      <div className="col-lg-6 mb-5">
        <div className="section__title export-title">
          <I18n>General Feedback</I18n>
          <I18n
            render={translate => (
              <small>
                {`${translate('for')} ${translate(
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                )}`}
              </small>
            )}
          />
        </div>
        <div className="export-buttons">
          <button
            className="btn btn-primary"
            disabled={exporting}
            onClick={() => {
              setExportMessage('Exporting General Feedback Records');
              setFilename(
                `${[
                  date.format('YYYY-MM-DD'),
                  'General Feedback',
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                ].join(' - ')}.csv`,
              );
              processExport(GENERAL_FEEDBACK_FORM_SLUG, false);
            }}
          >
            <I18n>Export for</I18n>{' '}
            <Moment timestamp={date} format="dddd, LL" />
          </button>
          <button
            className="btn btn-primary"
            disabled={exporting}
            onClick={() => {
              setExportMessage('Exporting General Feedback Records');
              setFilename(
                `${[
                  date.format('YYYY-MM'),
                  'General Feedback',
                  scheduler ? scheduler.values['Name'] : 'All Tech Bars',
                ].join(' - ')}.csv`,
              );
              processExport(GENERAL_FEEDBACK_FORM_SLUG, true);
            }}
          >
            <I18n>Export for</I18n>{' '}
            <Moment timestamp={date} format="MMMM YYYY" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="alert alert-danger">
      <I18n>Please select a valid date to see export options.</I18n>
    </div>
  );
};

export const processExport = ({
  fetchExportSubmissionsRequest,
  schedulerId,
  eventType,
  selectedDate,
  techBars,
}) => (formSlug, month) => {
  const date = moment(selectedDate);
  const schedulerIds = schedulerId
    ? [schedulerId]
    : techBars.toJS().map(techBar => techBar.values['Id']);
  switch (formSlug) {
    case APPOINTMENT_FORM_SLUG:
    case WALK_IN_FORM_SLUG:
      const isAppointment = formSlug === APPOINTMENT_FORM_SLUG;
      const dates = month
        ? Array(date.daysInMonth())
            .fill()
            .map((v, i) =>
              date
                .clone()
                .startOf('month')
                .add(i, 'day')
                .format(DATE_FORMAT),
            )
        : [selectedDate];
      fetchExportSubmissionsRequest({
        formSlug,
        schedulerIds,
        eventType,
        dates,
        dateFieldName: isAppointment ? 'Event Date' : 'Date',
        queryBuilder: searcher => {
          searcher.coreState('Closed');
        },
      });
      break;
    case FEEDBACK_FORM_SLUG:
    case GENERAL_FEEDBACK_FORM_SLUG:
      fetchExportSubmissionsRequest({
        formSlug,
        schedulerIds,
        queryBuilder: searcher => {
          if (month) {
            searcher.startDate(date.startOf('month').toDate());
            searcher.endDate(
              date
                .add(1, 'month')
                .startOf('month')
                .toDate(),
            );
          } else {
            searcher.startDate(date.startOf('day').toDate());
            searcher.endDate(
              date
                .add(1, 'day')
                .startOf('day')
                .toDate(),
            );
          }
        },
      });
      break;
    default:
  }
};

export const downloadFile = ({ data, filename, setExportStatus }) => () => {
  const csv = papaparse.unparse(
    data.reduce((csv, submission) => {
      let submissionValues = submission.values;
      submission.form.fields.forEach(field => {
        // If older submissions don't have a new field then add it with a value of null.
        if (!submissionValues.hasOwnProperty(field.name)) {
          submissionValues[field.name] = null;
        }
        // Checkbox Array values must be stringifyed to retain their array brackets.
        else if (Array.isArray(submissionValues[field.name])) {
          submissionValues[field.name] = JSON.stringify(
            submissionValues[field.name],
          );
        }
      });
      csv.push({
        'Property: id': submission.id,
        'Property: createdAt': submission.createdAt,
        'Property: createdBy': submission.createdBy,
        'Property: closedAt': submission.closedAt,
        'Property: closedBy': submission.closedBy,
        ...submissionValues,
      });
      return csv;
    }, []),
  );
  downloadjs(csv, filename, 'text/csv');
  setExportStatus('Completed');
};

export const mapStateToProps = (state, props) => ({
  scheduler: state.techBarApp.schedulers.find(
    scheduler => scheduler.values['Id'] === props.schedulerId,
  ),
  exporting: state.export.exporting,
  data: state.export.data,
  error: state.export.error,
});

export const mapDispatchToProps = {
  fetchExportSubmissionsRequest: actions.fetchExportSubmissionsRequest,
};

export const MetricsExport = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('exportStatus', 'setExportStatus', null), // Exporting, Empty, Completed
  withState('exportMessage', 'setExportMessage', null),
  withState('filename', 'setFilename', ''),
  withHandlers({
    processExport,
    downloadFile,
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (!this.props.exporting && prevProps.exporting && !this.props.error) {
        if (this.props.data.size > 0) {
          this.props.downloadFile();
        } else {
          this.props.setExportStatus('Empty');
        }
      } else if (this.props.exporting && !prevProps.exporting) {
        this.props.setExportStatus('Exporting');
      }
    },
  }),
)(MetricsExportComponent);
