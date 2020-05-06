import React, { Fragment } from 'react';
import moment from 'moment';
import { Link } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { TimeAgo } from 'common';
import { actions } from '../../../redux/modules/settingsForms';
import { I18n } from '@kineticdata/react';
import { connect } from '../../../redux/store';
import { PageTitle } from '../../shared/PageTitle';

export const FormActivityContainer = ({ loading, submission, space }) =>
  !loading && (
    <div className="page-container">
      <PageTitle parts={['Queue Settings']} />
      <div className="page-panel page-panel--white">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="../../../../..">
                <I18n>queue</I18n>
              </Link>{' '}
              /{` `}
              <Link to="../../../..">
                <I18n>settings</I18n>
              </Link>{' '}
              /{` `}
              <Link to="../../..">
                <I18n>forms</I18n>
              </Link>{' '}
              /{` `}
              <Link to={`../..`}>
                <I18n
                  context={`kapps.${submission.form.kapp.slug}.forms.${
                    submission.form.slug
                  }`}
                >
                  {submission.form.name}
                </I18n>
              </Link>{' '}
              /{` `}
            </h3>
            <h1>{submission.handle}</h1>
          </div>
        </div>
        <section>
          <div className="data-list data-list--fourths">
            <dl>
              <dt>Submission Label</dt>
              <dd>{submission.label}</dd>
            </dl>
            <dl>
              <dt>Submission Id</dt>
              <dd>{submission.id}</dd>
            </dl>
            <dl>
              <dt>Core State</dt>
              <dd>{submission.coreState}</dd>
            </dl>
            <dl>
              <dt>Time to Close</dt>
              <dd>
                {submission.closedAt ? (
                  moment
                    .duration(
                      moment(submission.submittedAt).valueOf() -
                        moment(submission.closedAt).valueOf(),
                    )
                    .humanize()
                ) : (
                  <I18n>Not closed yet</I18n>
                )}
              </dd>
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
            <dl>
              <dt>Updated</dt>
              <dd>
                <TimeAgo timestamp={submission.updatedAt} />
                <br />
                <small>
                  <I18n>by</I18n> {submission.updatedBy}
                </small>
              </dd>
            </dl>
            <dl>
              <dt>Closed</dt>
              <dd>
                {submission.closedAt ? (
                  <Fragment>
                    <TimeAgo timestamp={submission.closedAt} />
                    <br />
                    <small>
                      <I18n>by</I18n> {submission.closedBy}
                    </small>
                  </Fragment>
                ) : (
                  <I18n>N/A</I18n>
                )}
              </dd>
            </dl>
          </div>

          <h3 className="section__title">
            <I18n>Fulfillment Process</I18n>
          </h3>
          <div className="section__content scroll-wrapper-h">
            {submission.activities.filter(activity => activity.type === 'Task')
              .length > 0 ? (
              <table className="table table-sm table-striped settings-table">
                <thead className="header">
                  <tr>
                    <th>
                      <I18n>Type</I18n>
                    </th>
                    <th>
                      <I18n>Label</I18n>
                    </th>
                    <th>
                      <I18n>Description</I18n>
                    </th>
                    <th>
                      <I18n>Data</I18n>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submission.activities
                    .filter(activity => activity.type === 'Task')
                    .map((activity, index) => {
                      const data = activity.data
                        ? JSON.parse(activity.data)
                        : {};
                      return (
                        <tr key={`task-activity-${index}`}>
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
              <I18n>There are no fulfillment steps</I18n>
            )}
          </div>

          <h3 className="section__title">
            <I18n>Submission Activity</I18n>
          </h3>
          <div className="section__content scroll-wrapper-h">
            {submission.activities.filter(activity => activity.type !== 'Task')
              .length > 0 ? (
              <table className="table table-sm table-striped settings-table">
                <thead className="header">
                  <tr>
                    <th>
                      <I18n>Type</I18n>
                    </th>
                    <th>
                      <I18n>Label</I18n>
                    </th>
                    <th>
                      <I18n>Description</I18n>
                    </th>
                    <th>
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
            <table className="table table-sm table-striped settings-table">
              <thead className="header">
                <tr>
                  <th>
                    <I18n>Field</I18n>
                  </th>
                  <th>
                    <I18n>Value</I18n>
                  </th>
                </tr>
              </thead>
              <tbody>
                {submission.form.fields.map(field => (
                  <tr key={field.name}>
                    <td>
                      <I18n
                        context={`kapps.${submission.form.kapp.slug}.forms.${
                          submission.form.slug
                        }`}
                      >
                        {field.name}
                      </I18n>
                    </td>
                    <td>{submission.values[field.name]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );

const mapStateToProps = state => ({
  loading: state.settingsForms.submissionLoading,
  submission: state.settingsForms.formSubmission,
  space: state.app.space,
  activityLoading: state.settingsForms.submissionActivityLoading,
});

const mapDispatchToProps = {
  fetchFormSubmission: actions.fetchFormSubmission,
};

export const FormActivity = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchFormSubmission({
        id: this.props.id,
      });
    },
  }),
)(FormActivityContainer);
