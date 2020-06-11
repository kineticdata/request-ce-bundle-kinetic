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

const Layout = ({ authenticated, kapp, isPublic }) => ({ form, content }) => (
  <>
    {!isPublic && (
      <div className="page-title">
        <div
          role="navigation"
          aria-label="breadcrumbs"
          className="page-title__breadcrumbs"
        >
          {kapp && (
            <>
              <span className="breadcrumb-item">
                <Link to={`/kapps/${kapp.slug}`}>
                  <I18n>{kapp.name}</I18n>
                </Link>{' '}
              </span>
              <span aria-hidden="true">/ </span>
              {form && (
                <h1>
                  <I18n>{form.name}</I18n>
                </h1>
              )}
            </>
          )}
        </div>
      </div>
    )}
    {content}
  </>
);

export const FormComponent = ({
  authenticated,
  isPublic,
  match: {
    params: { formSlug, id },
  },
  handleCreated,
  handleCompleted,
  handleLoaded,
  handleDelete,
  values,
  kappSlug,
  Layout,
}) => (
  <Fragment>
    <PageTitle parts={['Form']} />
    <div className={!isPublic ? 'page-container container' : ''}>
      <div className={!isPublic ? 'page-panel' : ''}>
        <I18n
          context={`kapps.${kappSlug}.forms.${formSlug}`}
          public={!authenticated}
        >
          <div className="embedded-core-form--wrapper">
            {id ? (
              <CoreForm
                submission={id}
                globals={globals}
                loaded={handleLoaded}
                completed={handleCompleted}
                public={!authenticated}
                layoutComponent={Layout}
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
                public={!authenticated}
                layoutComponent={Layout}
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

export const handleCompleted = props => response => {
  if (props.authenticated) {
    if (!response.submission.currentPage) {
      props.push(`/kapps/${props.kappSlug}`);
      addToast('The form was submitted successfully');
    }
  }
};

export const handleCreated = ({ props }) => response => {
  if (
    response.submission.coreState !== 'Submitted' ||
    response.submission.currentPage
  ) {
    /*
     * Only modify the route if the router location does not
     * contain the embedded & cross_domain parameters. If these
     * headers are present it is an indication that the form
     * will implement it's own submitPage() callback function.
     * This was necessary to support unauthenticated forms inside
     * of iframes when using Safari. Safari will not send cookies
     * to a server if they cookie did not originate in a main parent
     * window request (third party cookies). This includes the
     * JSESSIONID cookie which is used to validate the submitter
     * access with an unauthenticated form.
     */
    if (props.authenticated || (!props.isEmbedded && !props.isCrossDomain)) {
      props.push(
        `/kapps/${props.kappSlug}/forms/${props.formSlug}/submissions/${
          response.submission.id
        }`,
      );
    }
  }
};

export const mapStateToProps = state => {
  const search = parse(state.router.location.search);
  return {
    kappSlug: state.app.kappSlug,
    kapp: state.app.kapp,
    authenticated: state.app.authenticated,
    values: valuesFromQueryParams(state.router.location.search),
    isPublic: search.public !== undefined,
    isEmbedded: search.embedded !== undefined,
    isCrossDomain: search.cross_domain !== undefined,
  };
};

export const mapDispatchToProps = { push };

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({ Layout, handleCompleted, handleCreated }),
);

export const Form = enhance(FormComponent);
