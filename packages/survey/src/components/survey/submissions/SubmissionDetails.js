import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import {
  compose,
  lifecycle,
  withProps,
  withState,
  withHandlers,
} from 'recompose';
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  ErrorMessage,
  LoadingMessage,
  TimeAgo,
  DiscussionsPanel,
  ViewDiscussionsModal,
} from 'common';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import { actions } from '../../../redux/modules/surveys';
import { connect } from '../../../redux/store';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../../shared/PageTitle';
import { CoreStateBadge } from 'common/src/components/tables/CoreStateBadgeCell';

const CreationForm = ({ onChange, values, errors }) => (
  <div className="form-group">
    <label htmlFor="title">Title</label>
    <input
      id="title"
      name="title"
      type="text"
      value={values.title}
      onChange={onChange}
    />
    {errors.title && (
      <small className="form-text text-danger">{errors.title}</small>
    )}
  </div>
);

export const SubmissionDetailsContainer = ({
  kapp,
  form,
  formActions,
  callFormAction,
  submission,
  submissionError,
  discussionsEnabled,
  viewDiscussionsModal,
  isSmallLayout,
  openDiscussions,
  closeDiscussions,
  profile,
  creationFields,
}) =>
  form && (
    <div className="page-container page-container--panels">
      <PageTitle parts={['Survey Submission']} />
      <div className="page-panel page-panel--three-fifths page-panel--white">
        <div className="page-title">
          <div
            role="navigation"
            aria-label="breadcrumbs"
            className="page-title__breadcrumbs"
          >
            <span className="breadcrumb-item">
              <Link to="../../../../">
                <I18n>{kapp.name}</I18n>
              </Link>
            </span>{' '}
            <span aria-hidden="true">/ </span>
            <span className="breadcrumb-item">
              <Link to="../../">
                <I18n>{form.name}</I18n>
              </Link>
            </span>{' '}
            <span aria-hidden="true">/ </span>
            <h1>{submission ? submission.label : 'New Submission'}</h1>
          </div>
          <div className="page-title__actions">
            {form.status === 'Active' && (
              <UncontrolledButtonDropdown>
                <DropdownToggle caret className="btn btn-primary">
                  Actions
                </DropdownToggle>
                <DropdownMenu>
                  {formActions.map(el => (
                    <DropdownItem
                      key={el.slug}
                      onClick={() =>
                        callFormAction({
                          formSlug: el.slug,
                          surveySubmissionId: submission.id,
                        })
                      }
                    >
                      <I18n>{el.name}</I18n>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            )}
            {/* {discussionsEnabled && (
              <button
                onClick={openDiscussions}
                className="btn btn-primary "
              >
                <span
                  className="fa fa-fw fa-comments"
                  style={{ fontSize: '16px' }}
                />
                <I18n>View Discussions</I18n>
              </button>
            )} */}
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
                <dd>
                  <CoreStateBadge coreState={submission.coreState} />
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
                        <I18n>Timestamp</I18n>
                      </th>
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
                            <td>
                              <TimeAgo timestamp={activity.createdAt} />
                            </td>
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
      {discussionsEnabled &&
        submission && (
          <DiscussionsPanel
            creationFields={creationFields}
            CreationForm={CreationForm}
            itemType="Submission"
            itemKey={submission.id}
            me={profile}
          />
        )}
      {viewDiscussionsModal &&
        isSmallLayout && (
          <ViewDiscussionsModal
            creationFields={creationFields}
            CreationForm={CreationForm}
            close={closeDiscussions}
            itemType="Submission"
            itemKey={submission.id}
            me={profile}
          />
        )}
    </div>
  );

export const openDiscussions = props => () =>
  props.setViewDiscussionsModal(true);
export const closeDiscussions = props => () =>
  props.setViewDiscussionsModal(false);

const mapStateToProps = state => ({
  kapp: state.app.kapp,
  forms: state.surveyApp.forms,
  formActions: state.surveyApp.formActions,
  submission: state.surveys.submission,
  submissionError: state.surveys.submissionError,
  discussionsEnabled: selectDiscussionsEnabled(state),
  isSmallLayout: state.app.layoutSize === 'small',
  profile: state.app.profile,
});

const mapDispatchToProps = {
  fetchSubmissionRequest: actions.fetchSubmissionRequest,
  callFormAction: actions.callFormAction,
};

export const SubmissionDetails = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    form: props.forms && props.forms.find(form => form.slug === props.slug),
    creationFields: props.submission && {
      title: props.submission.label || 'Survey Submission Discussion',
      description: props.submission.form.name || '',
    },
  })),
  withState('viewDiscussionsModal', 'setViewDiscussionsModal', false),
  withHandlers({
    openDiscussions,
    closeDiscussions,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmissionRequest({
        id: this.props.submissionId,
      });
    },
  }),
)(SubmissionDetailsContainer);