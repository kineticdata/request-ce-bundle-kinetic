import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from 'recompose';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';
import { ButtonGroup, Button } from 'reactstrap';
import { CoreForm } from 'react-kinetic-core';
import { LinkContainer } from 'react-router-bootstrap';

import { PageTitle, toastActions } from 'common';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';

import {
  selectPrevAndNext,
  selectFormBySlug,
  actions,
} from '../../../redux/modules/settingsDatastore';

import { DiscussionsPanel, ViewDiscussionsModal } from 'discussions';

const globals = import('common/globals');

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

const DatastoreSubmissionComponent = ({
  form,
  showPrevAndNext,
  prevAndNext,
  submissionId,
  handleCreated,
  handleUpdated,
  handleError,
  values,
  submission,
  isEditing,
  formKey,
  discussionsEnabled,
  viewDiscussionsModal,
  isSmallLayout,
  openDiscussions,
  closeDiscussions,
  profile,
  creationFields,
}) => (
  <div className="page-container page-container--panels page-container--datastore">
    <PageTitle
      parts={[
        submissionId ? (submission ? submission.label : '') : ' New Record',
        'Datastore',
      ]}
    />
    <div className="page-panel page-panel--three-fifths page-panel--space-datastore-submission page-panel--scrollable">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
            <Link to={`/settings/datastore/`}>datastore</Link> /{` `}
            <Link to={`/settings/datastore/${form.slug}/`}>{form.name}</Link> /
          </h3>
          <h1>
            {submissionId
              ? submission
                ? submission.label
                : ''
              : ' New Record'}
          </h1>
        </div>
        <div className="page-title__actions">
          {showPrevAndNext &&
            !isEditing && (
              <ButtonGroup className="datastore-prev-next">
                <LinkContainer to={prevAndNext.prev || ''}>
                  <Button color="inverse" disabled={!prevAndNext.prev}>
                    <span className="icon">
                      <span className="fa fa-fw fa-caret-left" />
                    </span>
                  </Button>
                </LinkContainer>
                <LinkContainer to={prevAndNext.next || ''}>
                  <Button color="inverse" disabled={!prevAndNext.next}>
                    <span className="icon">
                      <span className="fa fa-fw fa-caret-right" />
                    </span>
                  </Button>
                </LinkContainer>
              </ButtonGroup>
            )}
          {submissionId &&
            !isEditing && (
              <Link
                to={`/settings/datastore/${form.slug}/${submissionId}/edit`}
                className="btn btn-primary ml-3 datastore-edit"
              >
                Edit Record
              </Link>
            )}
          {discussionsEnabled && (
            <button
              onClick={openDiscussions}
              className="btn btn-inverse d-md-none d-lg-none d-xl-none"
            >
              <span
                className="fa fa-fw fa-comments"
                style={{ fontSize: '16px' }}
              />
              View Discussions
            </button>
          )}
        </div>
      </div>
      <div>
        {submissionId ? (
          <CoreForm
            datastore
            review={!isEditing}
            submission={submissionId}
            updated={handleUpdated}
            error={handleError}
            globals={globals}
          />
        ) : (
          <CoreForm
            key={formKey}
            form={form.slug}
            datastore
            onCreated={handleCreated}
            error={handleError}
            values={values}
            globals={globals}
          />
        )}
      </div>
    </div>
    {discussionsEnabled &&
      submission && (
        <DiscussionsPanel
          creationFields={creationFields}
          CreationForm={CreationForm}
          itemType="Datastore Submission"
          itemKey={submissionId}
          me={profile}
        />
      )}
    {viewDiscussionsModal &&
      isSmallLayout && (
        <ViewDiscussionsModal
          creationFields={creationFields}
          CreationForm={CreationForm}
          close={closeDiscussions}
          itemType="Datastore Submission"
          itemKey={submissionId}
          me={profile}
        />
      )}
  </div>
);

const valuesFromQueryParams = queryParams => {
  const params = parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};

export const getRandomKey = () =>
  Math.floor(Math.random() * (100000 - 100 + 1)) + 100;

export const shouldPrevNextShow = state =>
  state.space.settingsDatastore.submission !== null &&
  state.space.settingsDatastore.submissions.size > 0;

export const handleUpdated = props => response => {
  if (props.submissionId) {
    props.addSuccess(
      `Successfully updated submission (${response.submission.handle})`,
      'Submission Updated!',
    );
    props.push(props.match.url.replace('/edit', ''));
  }
};

export const handleError = props => response => {
  props.addError(response.error, 'Error');
};

export const handleCreated = props => (response, actions) => {
  props.addSuccess(
    `Successfully created submission (${response.submission.handle})`,
    'Submission Created!',
  );
  props.setFormKey(getRandomKey());
};

export const openDiscussions = props => () =>
  props.setViewDiscussionsModal(true);
export const closeDiscussions = props => () =>
  props.setViewDiscussionsModal(false);

export const mapStateToProps = (state, { match: { params } }) => ({
  submissionId: params.id,
  submission: state.space.settingsDatastore.submission,
  showPrevAndNext: shouldPrevNextShow(state),
  prevAndNext: selectPrevAndNext(state),
  form: selectFormBySlug(state, params.slug),
  values: valuesFromQueryParams(state.router.location.search),
  isEditing: params.mode && params.mode === 'edit' ? true : false,
  discussionsEnabled: selectDiscussionsEnabled(state),
  isSmallLayout: state.app.layout.get('size') === 'small',
  profile: state.app.profile,
});

export const mapDispatchToProps = {
  push,
  fetchSubmission: actions.fetchSubmission,
  resetSubmission: actions.resetSubmission,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const DatastoreSubmission = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('formKey', 'setFormKey', getRandomKey),
  withState('viewDiscussionsModal', 'setViewDiscussionsModal', false),
  withHandlers({
    handleUpdated,
    handleCreated,
    handleError,
    openDiscussions,
    closeDiscussions,
  }),
  withProps(
    props =>
      props.submission && {
        creationFields: {
          title: props.submission.label || 'Datastore Discussion',
          description: props.submission.form.name || '',
        },
      },
  ),
  lifecycle({
    componentWillMount() {
      if (this.props.match.params.id) {
        this.props.fetchSubmission(this.props.match.params.id);
      }
    },
    componentWillReceiveProps(nextProps) {
      if (
        nextProps.match.params.id &&
        this.props.match.params.id !== nextProps.match.params.id
      ) {
        this.props.fetchSubmission(nextProps.match.params.id);
      }
    },
    componentWillUnmount() {
      this.props.resetSubmission();
    },
  }),
)(DatastoreSubmissionComponent);
