import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';
import { ButtonGroup, Button } from 'reactstrap';
import { CoreForm } from 'react-kinetic-core';
import { LinkContainer } from 'react-router-bootstrap';

import { toastActions } from 'common';

import {
  selectPrevAndNext,
  selectFormBySlug,
  actions,
} from '../../../redux/modules/settingsDatastore';

const globals = import('common/globals');

const DatastoreSubmissionComponent = ({
  form,
  showPrevAndNext,
  prevAndNext,
  submissionId,
  submissionLabel,
  handleCreated,
  handleUpdated,
  handleError,
  values,
  submission,
  isEditing,
  formKey,
}) => (
  <div className="page-container page-container--datastore">
    <div className="page-panel page-panel--scrollable page-panel--space-datastore-submission">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
            <Link to={`/settings/datastore/`}>datastore</Link> /{` `}
            <Link to={`/settings/datastore/${form.slug}/`}>{form.name}</Link> /
          </h3>
          <h1>
            {submissionId ? (submission ? submission.label : '') : ' New'}
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
                Edit
              </Link>
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

export const mapStateToProps = (state, { match: { params } }) => ({
  submissionId: params.id,
  submission: state.space.settingsDatastore.submission,
  showPrevAndNext: shouldPrevNextShow(state),
  prevAndNext: selectPrevAndNext(state),
  form: selectFormBySlug(state, params.slug),
  values: valuesFromQueryParams(state.router.location.search),
  isEditing: params.mode && params.mode === 'edit' ? true : false,
});

export const mapDispatchToProps = {
  push,
  fetchSubmission: actions.fetchSubmission,
  resetSubmission: actions.resetSubmission,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const DatastoreSubmission = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('formKey', 'setFormKey', getRandomKey),
  withHandlers({
    handleUpdated,
    handleCreated,
    handleError,
  }),
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
