import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';
import { CoreForm } from 'react-kinetic-core';

import { selectFormBySlug, actions } from '../../redux/modules/datastore';

const globals = import('../../globals');

const DatastoreSubmissionComponent = ({
  form,
  submissionId,
  submissionLabel,
  handleCreated,
  handleCompleted,
  values,
  submission,
}) => (
  <div className="datastore-container">
    <div className="datastore-content">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to={`/datastore/`}>datastore</Link> /{` `}
            <Link to={`/datastore/${form.slug}/`}>{form.name}</Link> /
          </h3>
          <h1>{submissionId ? submission ? submission.label: '' : ' New'}</h1>
        </div>
      </div>
      <div className="">
        {submissionId ? (
          <CoreForm
            datastore
            submission={submissionId}
            completed={handleCompleted}
            globals={globals}
          />
        ) : (
          <CoreForm
            form={form.slug}
            datastore
            onCreated={handleCreated}
            completed={handleCompleted}
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

export const getSubmissionId = props =>
  props.match.isExact
    ? props.match.params.id
    : props.location.pathname.replace(props.match.url, '').replace('/', '');

export const handleCompleted = ({ push, form }) => response => {
  console.log('here');
  if (response.submission.currentPage === null) {
    push(`/datastore/${form.slug}`);
  }
};

export const handleCreated = props => response => {
  props.push(props.match.url.replace('new', response.submission.id));
};

export const mapStateToProps = (state, { match: { params } }) => ({
  submissionId: params.id,
  submission: state.datastore.submission,
  form: selectFormBySlug(state, params.slug),
  values: valuesFromQueryParams(state.router.location.search),
});

export const mapDispatchToProps = {
  push,
  fetchSubmission: actions.fetchSubmission,
  resetSubmission: actions.resetSubmission,
};

export const DatastoreSubmission = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('submissionId', '_', getSubmissionId),
  withHandlers({ handleCompleted, handleCreated }),
  lifecycle({
    componentWillMount() {
      if (this.props.match.params.id) {
        this.props.fetchSubmission(this.props.match.params.id);
      }
    },
    componentWillUnmount() {
      this.props.resetSubmission();
    },
  }),
)(DatastoreSubmissionComponent);
