import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { ErrorMessage, LoadingMessage, TimeAgo, addToastAlert } from 'common';
import { actions } from '../../../redux/modules/surveys';
import { connect } from '../../../redux/store';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../../shared/PageTitle';

export const SubmissionContainer = ({
  kapp,
  form,
  submission,
  submissionError,
}) =>
  form && (
    <div className="page-container">
      <PageTitle parts={['Survey Submission']} />
      <div className="page-panel page-panel--white">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="../../../">
                <I18n>{kapp.name}</I18n>
              </Link>{' '}
              /{` `}
              <Link to="../">
                <I18n>{form.name}</I18n>
              </Link>{' '}
              /{` `}
            </h3>
            <h1>{submission ? submission.label : 'New Submission'}</h1>
          </div>
          <div className="page-title__actions">
            <button
              onClick={() =>
                addToastAlert({
                  title: 'Failed to resend invitation.',
                  message: `Not implemented for ${submission.id}`,
                })
              }
              value="export"
              className="btn btn-primary pull-right"
            >
              <span className="fa fa-fw fa-envelope" />
              <I18n> Resend Invitation</I18n>
            </button>
          </div>
        </div>
        {submissionError ? (
          <ErrorMessage message={submissionError.message} />
        ) : !submission ? (
          <LoadingMessage />
        ) : (
          <div>
            <div className="data-list data-list--fourths">
              <dl>
                <dt>Submission Id</dt>
                <dd>{submission.id}</dd>
              </dl>
              <dl>
                <dt>Status</dt>
                <dd>{submission.coreState}</dd>
              </dl>
              <dl>
                <dt>Created</dt>
                <dd>
                  <TimeAgo timestamp={submission.createdAt} />
                  <br />
                  <small>
                    <I18n>by</I18n> {submission.createdBy}
                  </small>
                </dd>
              </dl>
              <dl>
                <dt>Submitted</dt>
                <dd>
                  {submission.submittedAt ? (
                    <Fragment>
                      <TimeAgo timestamp={submission.submittedAt} />
                      <br />
                      <small>
                        <I18n>by</I18n> {submission.submittedBy}
                      </small>
                    </Fragment>
                  ) : (
                    <I18n>N/A</I18n>
                  )}
                </dd>
              </dl>
            </div>

            <h3 className="section__title">
              <I18n>Submission Activity</I18n>
            </h3>
            <div className="section__content scroll-wrapper-h">
              {submission.activities.filter(
                activity => activity.type !== 'Task',
              ).length > 0 ? (
                <table className="table table-sm table-striped table--settings">
                  <thead className="header">
                    <tr>
                      <th scope="col">
                        <I18n>Type</I18n>
                      </th>
                      <th scope="col">
                        <I18n>Label</I18n>
                      </th>
                      <th scope="col">
                        <I18n>Description</I18n>
                      </th>
                      <th scope="col">
                        <I18n>Data</I18n>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submission.activities
                      .filter(activity => activity.type !== 'Task')
                      .map((activity, index) => {
                        const data = activity.data
                          ? JSON.parse(activity.data)
                          : {};
                        return (
                          <tr key={`activity-${index}`}>
                            <td>{activity.type}</td>
                            <td>{activity.label}</td>
                            <td>{activity.description}</td>
                            <td>
                              {Object.keys(data).map(key => (
                                <div key={key}>
                                  {key}: {data[key]}
                                </div>
                              ))}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              ) : (
                <I18n>There is no submission activity</I18n>
              )}
            </div>
            <h3 className="section__title">
              <I18n>Values</I18n>
            </h3>
            <div className="section__content scroll-wrapper-h">
              <table className="table table-sm table-striped table--settings">
                <thead className="header">
                  <tr>
                    <th scope="col">
                      <I18n>Field</I18n>
                    </th>
                    <th scope="col">
                      <I18n>Value</I18n>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submission.form.fields.map(field => (
                    <tr key={field.name}>
                      <td>
                        <I18n>{field.name}</I18n>
                      </td>
                      <td>{submission.values[field.name]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

const mapStateToProps = state => ({
  kapp: state.app.kapp,
  form: state.surveys.form,
  submission: state.surveys.submission,
  submissionError: state.surveys.submissionError,
});

const mapDispatchToProps = {
  fetchSubmissionRequest: actions.fetchSubmissionRequest,
};

export const Submission = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmissionRequest({
        id: this.props.id,
      });
    },
  }),
)(SubmissionContainer);
