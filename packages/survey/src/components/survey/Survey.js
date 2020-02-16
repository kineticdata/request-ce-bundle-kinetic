import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { compose, withHandlers, withProps } from 'recompose';
import { CoreForm } from '@kineticdata/react';
import { ErrorNotFound, ErrorUnauthorized, ErrorUnexpected } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { Link } from '@reach/router';
import { parse } from 'query-string';

import { I18n } from '@kineticdata/react';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const SurveyComponent = ({
  slug,
  id,
  form,
  relativeHomePath,
  handleCreated,
  handleCompleted,
  handleLoaded,
  handleDelete,
  values,
  kappSlug,
}) => (
  <Fragment>
    <PageTitle parts={[form ? form.name : '']} />
    <div className="page-container container">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to={relativeHomePath}>
              <I18n>survey</I18n>
            </Link>{' '}
            /{' '}
          </h3>
          {form && (
            <h1>
              <I18n context={`kapps.${kappSlug}.forms.${slug}`}>
                {form.name}
              </I18n>
            </h1>
          )}
        </div>
      </div>
      <div className="form-description">
        {form &&
          form.description && (
            <p>
              <I18n context={`kapps.${kappSlug}.forms.${slug}`}>
                {form.description}
              </I18n>
            </p>
          )}
      </div>
      <I18n context={`kapps.${kappSlug}.forms.${slug}`}>
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
              form={slug}
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
    props.navigate(props.relativeHomePath);
  }
};

export const handleCreated = props => response => {
  props.navigate(
    response.submission.coreState === 'Submitted'
      ? props.relativeHomePath
      : `submissions/${response.submission.id}`,
  );
};

export const mapStateToProps = state => ({
  kappSlug: state.app.kappSlug,
  forms: state.surveyApp.forms,
  values: valuesFromQueryParams(state.router.location.search),
});

const enhance = compose(
  connect(mapStateToProps),
  withProps(props => ({
    form: props.forms.find(form => form.slug === props.slug),
    relativeHomePath: `../../${props.id ? '../../' : ''}`,
  })),
  withHandlers({ handleCompleted, handleCreated }),
);

export const Survey = enhance(SurveyComponent);
