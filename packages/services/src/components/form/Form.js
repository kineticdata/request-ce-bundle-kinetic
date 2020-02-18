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
  handleUnauthorized,
  values,
  kappSlug,
  formSlug,
  path,
  appLocation,
  authenticated,
}) => (
  <Fragment>
    <PageTitle parts={[form ? form.name : '']} />
    <div className="page-container page-container--color-bar">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to={appLocation}>
                <I18n>services</I18n>
              </Link>{' '}
              /{' '}
              {path.startsWith('request') && (
                <Fragment>
                  <Link to={`${appLocation}/requests`}>
                    <I18n>requests</I18n>
                  </Link>{' '}
                  /{' '}
                  {type && (
                    <Fragment>
                      <Link to={`${appLocation}/requests/${type || ''}`}>
                        <I18n>{type}</I18n>
                      </Link>{' '}
                      /{' '}
                    </Fragment>
                  )}
                </Fragment>
              )}
              {category && (
                <Fragment>
                  <Link to={`${appLocation}/categories`}>
                    <I18n>categories</I18n>
                  </Link>{' '}
                  /{' '}
                  {category.getTrail().map(ancestorCategory => (
                    <Fragment key={ancestorCategory.slug}>
                      <Link
                        to={`${appLocation}/categories/${
                          ancestorCategory.slug
                        }`}
                      >
                        <I18n>{ancestorCategory.name}</I18n>
                      </Link>{' '}
                      /{' '}
                    </Fragment>
                  ))}
                </Fragment>
              )}
            </h3>
            {form && (
              <h1>
                <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
                  {form.name}
                </I18n>
              </h1>
            )}
          </div>
          {authenticated &&
            submissionId &&
            form && (
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
            <I18n submissionId={submissionId} public={!authenticated}>
              <CoreForm
                submission={submissionId}
                globals={globals}
                loaded={handleLoaded}
                completed={handleCompleted}
                unauthorized={handleUnauthorized}
                public={!authenticated}
              />
            </I18n>
          ) : (
            <I18n
              context={`kapps.${kappSlug}.forms.${formSlug}`}
              public={!authenticated}
            >
              <CoreForm
                kapp={kappSlug}
                form={formSlug}
                globals={globals}
                loaded={handleLoaded}
                created={handleCreated}
                completed={handleCompleted}
                unauthorized={handleUnauthorized}
                values={values}
                notFoundComponent={ErrorNotFound}
                unauthorizedComponent={ErrorUnauthorized}
                unexpectedErrorComponent={ErrorUnexpected}
                public={!authenticated}
              />
            </I18n>
          )}
        </div>
      </div>
    </div>
  </Fragment>
);
