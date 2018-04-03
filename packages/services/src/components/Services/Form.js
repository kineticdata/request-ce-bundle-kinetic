import React from 'react';
import { CoreForm } from 'react-kinetic-core';
import {
  KappLink as Link,
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  PageTitle,
} from 'common';
import { SERVICES_KAPP as kappSlug } from '../../constants';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const Form = ({
  form,
  category,
  submissionId,
  match,
  handleCreated,
  handleCompleted,
  handleLoaded,
  values,
}) => (
  <div>
    <PageTitle parts={[form ? form.name : '']} />
    <div className="services-bar">
      <span className="bordercolor" />
    </div>
    <div className="services-form-container container">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">services</Link> /{' '}
            {match.url.startsWith('/request') && (
              <Link to="/requests">requests</Link>
            )}
            {match.url.startsWith('/request') && ' / '}
            {match.url.startsWith('/request') &&
              match.params.type && (
                <Link to={`/requests/${match.params.type || ''}`}>
                  {match.params.type}
                </Link>
              )}
            {match.url.startsWith('/request') && match.params.type && ' / '}
            {category && <Link to="/categories">categories</Link>}
            {category && ' / '}
            {category && (
              <Link to={`/categories/${category.slug}`}>{category.name}</Link>
            )}
            {category && ' / '}
          </h3>
          {form && <h1>{form.name}</h1>}
        </div>
        {/* TODO Show if in Draft mode
        <a href="/" className="btn btn-secondary">
          Cancel/Delete Request
        </a>
        */}
      </div>
      <div className="page-description-wrapper">
        {form && <p>{form.description}</p>}
      </div>
      <div className="form-wrapper">
        {submissionId ? (
          <CoreForm
            submission={submissionId}
            globals={globals}
            loaded={handleLoaded}
            completed={handleCompleted}
          />
        ) : (
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
        )}
      </div>
    </div>
  </div>
);
