import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { PageTitle } from 'common';
import { actions } from '../../../redux/modules/settingsForms';

export const FormActivityContainer = ({ loading, submission, space }) =>
  !loading && (
    <div>
      <PageTitle parts={['Queue Settings']} />
      <div className="page-container  page-container--space-settings">
        <div className="page-panel">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/kapps/queue">queue</Link> /{` `}
                <Link to="/kapps/queue/settings">settings</Link> /{` `}
                <Link to="/kapps/queue/settings/forms">forms</Link> /{` `}
                <Link
                  to={`/kapps/queue/settings/forms/${submission.form.slug}`}
                >
                  {submission.form.name}
                </Link>{' '}
                /{` `}
              </h3>
              <h1>
                {submission.form.name} ({submission.handle})
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
                    <i className="fa fa-sitemap" /> View Runs
                  </button>
                </a>
              ))}
          </div>
          <section>
            <div className="settings-flex row">
              <div className="col-sm-6">
                <label>Submission Label</label>
                <p>{submission.label}</p>
              </div>
              <div className="col-sm-6">
                <label>Submission Id</label>
                <p>{submission.id}</p>
              </div>
              <div className="col-sm-6">
                <label>Status</label>
                <p>{submission.coreState}</p>
              </div>
              <div className="col-sm-6">
                <label>Time to Close</label>
                <p>
                  {submission.closedAt
                    ? moment
                        .duration(
                          moment(submission.submittedAt).valueOf() -
                            moment(submission.closedAt).valueOf(),
                        )
                        .humanize()
                    : 'Not closed yet'}
                </p>
              </div>
              <div className="col-sm-6">
                <label>Created</label>
                <p>
                  {moment(submission.createdAt).fromNow()} by{' '}
                  {submission.createdBy}
                </p>
              </div>
              <div className="col-sm-6">
                <label>Submitted</label>
                <p>
                  {moment(submission.submittedAt).fromNow()} by{' '}
                  {submission.submittedBy}
                </p>
              </div>
              <div className="col-sm-6">
                <label>Created</label>
                <p>
                  {moment(submission.updatedAt).fromNow()} by{' '}
                  {submission.updatedBy}
                </p>
              </div>
              <div className="col-sm-6">
                <label>Closed</label>
                <p>
                  {submission.closedAt
                    ? moment(submission.closedAt).fromNow()
                    : 'N/A'}
                </p>
              </div>
            </div>
            <br />
            <h3 className="section__title">Fulfillment Process</h3>
            {submission.activities.filter(activity => activity.type === 'Task')
              .length > 0 ? (
              <table className="table table-sm table-striped settings-table">
                <thead className="header">
                  <tr>
                    <th>Type</th>
                    <th>Label</th>
                    <th>Description</th>
                    <th>Data</th>
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
              'There are no fulfillment steps'
            )}
            <br />
            <h3 className="section__title">Submission Activity</h3>
            {submission.activities.filter(activity => activity.type !== 'Task')
              .length > 0 ? (
              <table className="table table-sm table-striped settings-table">
                <thead className="header">
                  <tr>
                    <th>Type</th>
                    <th>Label</th>
                    <th>Description</th>
                    <th>Data</th>
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
              'There is no submission activity'
            )}
            <br />
            <h3 className="section__title">Values</h3>
            <table className="table table-sm table-striped settings-table">
              <thead className="header">
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {submission.form.fields.map(field => (
                  <tr key={field.name}>
                    <td>{field.name}</td>
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

const mapStateToProps = (state, { match: { params } }) => ({
  loading: state.queue.settingsForms.submissionLoading,
  submission: state.queue.settingsForms.formSubmission,
  space: state.app.space,
  activityLoading: state.queue.settingsForms.submissionActivityLoading,
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
        id: this.props.match.params.id,
      });
    },
  }),
)(FormActivityContainer);
