import React, { Fragment } from 'react';
import { CoreForm } from '@kineticdata/react';
import { Link } from '@reach/router';
import { ErrorNotFound, ErrorUnauthorized, ErrorUnexpected } from 'common';
import { PageTitle } from '../shared/PageTitle';

import { I18n } from '@kineticdata/react';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const Form = ({
  form,
  type,
  category,
  submissionId,
  handleCreated,
  handleCompleted,
  handleLoaded,
  handleDelete,
  values,
  kappSlug,
  path,
  appLocation,
}) => (
  <Fragment>
    <PageTitle parts={[form ? form.name : '']} />
    <span className="services-color-bar services-color-bar__blue-slate" />
    <div className="page-container page-container--services-form">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to={appLocation}>
              <I18n>services</I18n>
            </Link>{' '}
            /{' '}
            {path.startsWith('request') && (
              <Link to={`${appLocation}/requests`}>
                <I18n>requests</I18n>
              </Link>
            )}
            {path.startsWith('/request') && ' / '}
            {path.startsWith('/request') &&
              type && (
                <Link to={`${appLocation}/requests/${type || ''}`}>
                  <I18n>{type}</I18n>
                </Link>
              )}
            {path.startsWith('/request') && type && ' / '}
            {category && (
              <Link to={`${appLocation}/categories`}>
                <I18n>categories</I18n>
              </Link>
            )}
            {category && ' / '}
            {category && (
              <Link to={`${appLocation}/categories/${category.slug}`}>
                <I18n>{category.name}</I18n>
              </Link>
            )}
            {category && ' / '}
          </h3>
          {form && (
            <h1>
              <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
                {form.name}
              </I18n>
            </h1>
          )}
        </div>
        {submissionId && (
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-outline-danger"
          >
            <I18n>Cancel Request</I18n>
          </button>
        )}
      </div>
      <div className="form-description">
        {form && (
          <p>
            <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
              {form.description}
            </I18n>
          </p>
        )}
      </div>
      <div className="embedded-core-form--wrapper">
        {submissionId ? (
          <I18n submissionId={submissionId}>
            <CoreForm
              submission={submissionId}
              globals={globals}
              loaded={handleLoaded}
              completed={handleCompleted}
            />
          </I18n>
        ) : (
          <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
            <CoreForm
              kapp={kappSlug}
              form={form.slug}
              globals={globals}
              loaded={handleLoaded}
              created={handleCreated}
              completed={handleCompleted}
              values={values}
              notFoundComponent={ErrorNotFound}
              unauthorizedComponent={ErrorUnauthorized}
              unexpectedErrorComponent={ErrorUnexpected}
            />
          </I18n>
        )}
      </div>
    </div>
  </Fragment>
);
