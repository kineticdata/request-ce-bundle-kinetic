import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
import { CoreForm } from '@kineticdata/react';
import {
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  addToast,
} from 'common';
import { PageTitle } from './shared/PageTitle';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';

import { I18n } from '@kineticdata/react';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const FormComponent = ({
  kapp,
  match: {
    params: { formSlug, id },
  },
  handleCreated,
  handleCompleted,
  handleLoaded,
  handleDelete,
  values,
  kappSlug,
}) => (
  <Fragment>
    <PageTitle parts={['Form']} />
    <div className="page-container container">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to={`/kapps/${kappSlug}`}>
                <I18n>{kapp.name}</I18n>
              </Link>{' '}
              /{' '}
            </h3>
          </div>
        </div>
        <I18n context={`kapps.${kappSlug}.forms.${formSlug}`}>
          <div className="embedded-core-form--wrapper">
            {id ? (
              <CoreForm
                submission={id}
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
        </I18n>
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

export const handleCompleted = ({ kappSlug, push }) => response => {
  if (!response.submission.currentPage) {
    push(`/kapps/${kappSlug}`);
    addToast('The form was submitted successfully');
  }
};

export const handleCreated = ({
  match: {
    params: { formSlug, id },
  },
  kappSlug,
  push,
}) => response => {
  if (response.submission.coreState === 'Submitted') {
    push(`/kapps/${kappSlug}`);
    addToast('The form was submitted successfully');
  } else {
    push(
      `/kapps/${kappSlug}/forms/${formSlug}/submissions/${
        response.submission.id
      }`,
    );
  }
};

export const mapStateToProps = state => ({
  kappSlug: state.app.kappSlug,
  kapp: state.app.kapp,
  values: valuesFromQueryParams(state.router.location.search),
});

export const mapDispatchToProps = { push };

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({ handleCompleted, handleCreated }),
);

export const Form = enhance(FormComponent);
