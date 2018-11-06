import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
  withProps,
} from 'recompose';
import { CoreForm } from 'react-kinetic-core';
import {
  KappLink as Link,
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  PageTitle,
} from 'common';
import { parse } from 'query-string';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const FormComponent = ({
  match: {
    params: { formSlug, id, mode },
  },
  form,
  match,
  handleCreated,
  handleCompleted,
  handleLoaded,
  handleDelete,
  values,
  kappSlug,
}) => (
  <Fragment>
    <PageTitle parts={[form ? form.name : '']} />
    <div className="page-container page-container--tech-bar-form">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">tech bar</Link> /{' '}
          </h3>
          {form && <h1>{form.name}</h1>}
        </div>
      </div>
      <div className="form-description">
        {form && <p>{form.description}</p>}
      </div>
      <div className="embedded-core-form--wrapper">
        {mode === 'confirmation' && <h3>Thank You</h3>}
        {id ? (
          <CoreForm
            submission={id}
            review={true}
            globals={globals}
            loaded={handleLoaded}
            completed={handleCompleted}
          />
        ) : (
          <CoreForm
            kapp={kappSlug}
            form={formSlug}
            globals={globals}
            loaded={handleLoaded}
            created={handleCreated}
            completed={handleCompleted}
            values={values}
            notFoundComponent={ErrorNotFound}
            unauthorizedComponent={ErrorUnauthorized}
            unexpectedErrorComponent={ErrorUnexpected}
          />
        )}
      </div>
    </div>
  </Fragment>
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

export const handleCompleted = props => response => {
  if (!response.submission.currentPage) {
    props.push(`/kapps/${props.kappSlug}`);
  }
};

export const handleCreated = props => response => {
  props.push(
    response.submission.coreState === 'Submitted'
      ? `/kapps/${props.kappSlug}`
      : `${props.match.url}/submissions/${response.submission.id}`,
  );
  // todo: verify these push routes
};

export const mapStateToProps = (state, { match: { params } }) => ({
  kappSlug: state.app.config.kappSlug,
  forms: state.techBar.techBarApp.forms,
  values: valuesFromQueryParams(state.router.location.search),
});

export const mapDispatchToProps = {
  push,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    form: props.forms.find(form => form.slug === props.match.params.formSlug),
  })),
  withHandlers({ handleCompleted, handleCreated }),
);

export const Form = enhance(FormComponent);
