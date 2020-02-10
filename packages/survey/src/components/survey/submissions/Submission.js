import React from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from 'recompose';
import { Link } from '@reach/router';
import { parse } from 'query-string';
import { ButtonGroup } from 'reactstrap';
import { CoreForm } from '@kineticdata/react';
import {
  DiscussionsPanel,
  addSuccess,
  addError,
  ViewDiscussionsModal,
} from 'common';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import { PageTitle } from '../../shared/PageTitle';
import {
  selectPrevAndNext,
  selectFormBySlug,
  actions,
} from '../../../redux/modules/surveys';
import { context } from '../../../redux/store';

import { I18n } from '@kineticdata/react';

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

const SurveySubmissionComponent = ({
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
  <I18n context={`datastore.forms.${form.slug}`}>
    <div className="page-container page-container--panels">
      <PageTitle
        parts={[
          submissionId ? (submission ? submission.label : '') : ' New Record',
          'Datastore',
        ]}
      />
      <div className="page-panel page-panel--three-fifths page-panel--white">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="../../../">
                <I18n>survey</I18n>
              </Link>{' '}
              /{` `}
              <I18n>{form.name}</I18n>
              /{` `}
              <Link to="../">
                <I18n>submissions</I18n>
              </Link>{' '}
              /
            </h3>
            <h1>
              {submissionId ? (
                submission ? (
                  submission.label
                ) : (
                  ''
                )
              ) : (
                <I18n>New Record</I18n>
              )}
            </h1>
          </div>
          <div className="page-title__actions">
            {showPrevAndNext &&
              !isEditing && (
                <ButtonGroup className="datastore-prev-next">
                  <Link
                    to={prevAndNext.prev || ''}
                    className="btn btn-inverse"
                    disabled={!prevAndNext.prev}
                  >
                    <span className="icon">
                      <span className="fa fa-fw fa-caret-left" />
                    </span>
                  </Link>
                  <Link
                    to={prevAndNext.next || ''}
                    className="btn btn-inverse"
                    disabled={!prevAndNext.next}
                  >
                    <span className="icon">
                      <span className="fa fa-fw fa-caret-right" />
                    </span>
                  </Link>
                </ButtonGroup>
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
                <I18n>View Discussions</I18n>
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
  </I18n>
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
  state.surveys.submission !== null && state.surveys.submissions.size > 0;

export const handleUpdated = props => response => {
  if (props.submissionId) {
    addSuccess(
      `Successfully updated submission (${response.submission.handle})`,
      'Submission Updated!',
    );
    props.push(props.match.url.replace('/edit', ''));
  }
};

export const handleError = props => response => {
  addError(response.error, 'Error');
};

export const handleCreated = props => (response, actions) => {
  addSuccess(
    `Successfully created submission (${response.submission.handle})`,
    'Submission Created!',
  );
  props.setFormKey(getRandomKey());
};

export const openDiscussions = props => () =>
  props.setViewDiscussionsModal(true);
export const closeDiscussions = props => () =>
  props.setViewDiscussionsModal(false);

export const mapStateToProps = (state, { id, mode, slug }) => ({
  submissionId: id,
  submission: state.surveys.submission,
  showPrevAndNext: shouldPrevNextShow(state),
  prevAndNext: selectPrevAndNext(state),
  form: selectFormBySlug(state, slug),
  values: valuesFromQueryParams(state.router.location.search),
  isEditing: mode && mode === 'edit' ? true : false,
  discussionsEnabled: selectDiscussionsEnabled(state),
  isSmallLayout: state.app.layoutSize === 'small',
  profile: state.app.profile,
});

export const mapDispatchToProps = {
  push,
  fetchSubmission: actions.fetchSubmission,
  resetSubmission: actions.resetSubmission,
};

export const SurveySubmission = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
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
      if (this.props.id) {
        this.props.fetchSubmission(this.props.id);
      }
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.id && this.props.id !== nextProps.id) {
        this.props.fetchSubmission(nextProps.id);
      }
    },
    componentWillUnmount() {
      this.props.resetSubmission();
    },
  }),
)(SurveySubmissionComponent);
