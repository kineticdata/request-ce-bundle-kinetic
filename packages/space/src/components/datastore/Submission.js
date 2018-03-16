import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withState } from 'recompose';
import { Link } from 'react-router-dom';
import SVGInline from 'react-svg-inline';
import chevronLeftIcon from 'font-awesome-svg-png/black/svg/chevron-left.svg';
import { parse } from 'query-string';
import { CoreForm } from 'react-kinetic-core';

import { selectFormBySlug } from '../../redux/modules/datastore';

const globals = import('../../globals');

const DatastoreSubmissionComponent = ({
  form,
  submissionId,
  submissionLabel,
  handleCreated,
  handleCompleted,
  values,
}) => (
  <div className="submission-wrapper">
    <div className="subheader">
      <Link
        to={`/datastore${submissionId ? '/' + form.slug : ''}`}
        className="back-link"
      >
        <div className="icon-wrapper">
          <SVGInline svg={chevronLeftIcon} className="icon" />
          Forms / {form.name} / {submissionId || ' New'}
        </div>
      </Link>
    </div>

    <div className="datastore-container">
      <div className="form-wrapper">
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
            created={handleCreated}
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

export const mapStateToProps = (state, { match: { params } }) => ({
  submissionId: params.id,
  form: selectFormBySlug(state, params.slug),
  values: valuesFromQueryParams(state.router.location.search),
});

export const getSubmissionId = props =>
  props.match.isExact
    ? props.match.params.id
    : props.location.pathname.replace(props.match.url, '').replace('/', '');

export const handleCompleted = ({ push, form }) => response => {
  if (response.submission.currentPage === null) {
    push(`/datastore/${form.slug}`);
  }
};

export const handleCreated = props => response => {
  props.push(props.match.url.replace('new', response.submission.id));
};

export const mapDispatchToProps = { push };

export const DatastoreSubmission = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('submissionId', '_', getSubmissionId),
  withHandlers({ handleCompleted, handleCreated }),
)(DatastoreSubmissionComponent);
