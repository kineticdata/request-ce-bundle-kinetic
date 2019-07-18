import React from 'react';
import moment from 'moment';
import { Link } from '@reach/router';
import { compose, lifecycle } from 'recompose';

import { actions } from '../../../redux/modules/settingsForms';
import { connect } from '../../../redux/store';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../../shared/PageTitle';

export const FormActivityContainer = ({
  loading,
  submission,
  space,
  kappSlug,
  appLocation,
}) =>
  !loading && (
    <div>
      <PageTitle parts={['Services Settings']} />
      <div className="page-container  page-container--space-settings">
        <div className="page-panel">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to={appLocation}>
                  <I18n>services</I18n>
                </Link>{' '}
                /{` `}
                <Link to={`${appLocation}/settings`}>
                  <I18n>settings</I18n>
                </Link>{' '}
                /{` `}
                <Link to={`${appLocation}/settings/forms`}>
                  <I18n>forms</I18n>
                </Link>{' '}
                /{` `}
                <Link
                  to={`${appLocation}/settings/forms/${submission.form.slug}`}
                >
                  <I18n
                    context={`kapps.${kappSlug}.forms.${submission.form.slug}`}
                  >
                    {submission.form.name}
                  </I18n>
                </Link>{' '}
                /{` `}
              </h3>
              <h1>
                <I18n
                  context={`kapps.${kappSlug}.forms.${submission.form.slug}`}
                >
                  {submission.form.name}
                </I18n>{' '}
                ({submission.handle})
              </h1>
            </div>
            {space.attributes
              .filter(attribute => attribute.name === 'Task Server Url')
              .map(attribute => (
                <a
                  key={attribute.name}
                  href={`${attribute.values[0]}/app/runs?sourceId=${
                    submission.id
                  }`}
                  target="_blank"
                >
                  <button className="btn btn-primary pull-right">
                    <i className="fa fa-sitemap" /> <I18n>View Runs</I18n>
                  </button>
                </a>
              ))}
          </div>
          <section>
            <div className="settings-flex row">
              <div className="col-sm-6">
                <label>
                  <I18n>Submission Label</I18n>
                </label>
                <p>{submission.label}</p>
              </div>
              <div className="col-sm-6">
                <label>
                  <I18n>Submission Id</I18n>
                </label>
                <p>{submission.id}</p>
              </div>
              <div className="col-sm-6">
                <label>
                  <I18n>Status</I18n>
                </label>
                <p>{submission.coreState}</p>
              </div>
              <div className="col-sm-6">
                <label>
                  <I18n>Time to Close</I18n>
                </label>
                <p>
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
                </p>
              </div>
              <div className="col-sm-6">
                <label>
                  <I18n>Created</I18n>
                </label>
                <p>
                  {moment(submission.createdAt).fromNow()} <I18n>by</I18n>{' '}
                  {submission.createdBy}
                </p>
              </div>
              <div className="col-sm-6">
                <label>
                  <I18n>Submitted</I18n>
                </label>
                <p>
                  {moment(submission.submittedAt).fromNow()} <I18n>by</I18n>{' '}
                  {submission.submittedBy}
                </p>
              </div>
              <div className="col-sm-6">
                <label>
                  <I18n>Created</I18n>
                </label>
                <p>
                  {moment(submission.updatedAt).fromNow()} <I18n>by</I18n>{' '}
                  {submission.updatedBy}
                </p>
              </div>
              <div className="col-sm-6">
                <label>
                  <I18n>Closed</I18n>
                </label>
                <p>
                  {submission.closedAt ? (
                    moment(submission.closedAt).fromNow()
                  ) : (
                    <I18n>N/A</I18n>
                  )}
                </p>
              </div>
            </div>
            <br />
            <h3 className="section__title">
              <I18n>Fulfillment Process</I18n>
            </h3>
            {submission.activities.filter(activity => activity.type === 'Task')
              .length > 0 ? (
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
                    .filter(activity => activity.type === 'Task')
                    .map((activity, index) => {
                      const data = JSON.parse(activity.data);
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
            <br />
            <h3 className="section__title">
              <I18n>Submission Activity</I18n>
            </h3>
            {submission.activities.filter(activity => activity.type !== 'Task')
              .length > 0 ? (
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
                      const data = JSON.parse(activity.data);
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
            <br />
            <h3 className="section__title">
              <I18n>Values</I18n>
            </h3>
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
          </section>
        </div>
      </div>
    </div>
  );

const mapStateToProps = state => ({
  loading: state.settingsForms.submissionLoading,
  submission: state.settingsForms.formSubmission,
  space: state.app.space,
  activityLoading: state.settingsForms.submissionActivityLoading,
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
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
