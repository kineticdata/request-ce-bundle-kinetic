import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { actions } from '../../redux/modules/surveys';
import { compose, withHandlers, withProps } from 'recompose';
import { I18n, CoreForm } from '@kineticdata/react';
import {
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  LoadingMessage,
} from 'common';
import { Link } from '@reach/router';
import { PageTitle } from '../shared/PageTitle';
import { parse } from 'query-string';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.

const globals = import('common/globals');

export const SurveyPreviewComponent = ({
  authenticated,
  loading,
  slug,
  form,
  kapp,
  kappSlug,
  values,
}) => (
  <Fragment>
    <PageTitle parts={[form ? form.name : '', 'Preview']} />
    {!loading && form ? (
      <div className="page-container page-container--color-bar">
        <div className="page-panel">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="../../">
                  <I18n>{kapp.name}</I18n> /{' '}
                </Link>
                <I18n>Preview</I18n> /{' '}
              </h3>
              <h1>
                <I18n
                  context={`kapps.${kappSlug}.forms.${slug}`}
                  public={!authenticated}
                >
                  {form.name}
                </I18n>
              </h1>
            </div>
          </div>
          <div className="form-description">
            <p>
              <I18n
                context={`kapps.${kappSlug}.forms.${slug}`}
                public={!authenticated}
              >
                {form.description}
              </I18n>
            </p>
          </div>
          <I18n
            context={`kapps.${kappSlug}.forms.${slug}`}
            public={!authenticated}
          >
            <div className="embedded-core-form--wrapper">
              <CoreForm
                kapp={kappSlug}
                form={slug}
                globals={globals}
                values={values}
                completed={handleCompleted}
                notFoundComponent={ErrorNotFound}
                unauthorizedComponent={ErrorUnauthorized}
                unexpectedErrorComponent={ErrorUnexpected}
                public={!authenticated}
              />
            </div>
          </I18n>
        </div>
      </div>
    ) : (
      <LoadingMessage />
    )}
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

export const mapStateToProps = state => ({
  authenticated: state.app.authenticated,
  kapp: state.app.kapp,
  kappSlug: state.app.kappSlug,
  loading: state.surveyApp.loading,
  submission: state.surveys.submission,
  forms: state.surveyApp.forms,
  templates: state.surveyApp.templates,
  utilities: state.surveyApp.utilities,
  values: valuesFromQueryParams(state.router.location.search),
});

export const mapDispatchToProps = {
  fetchSubmission: actions.fetchSubmissionRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    form:
      props.forms && props.forms.find(form => form.slug === props.slug)
        ? props.forms.find(form => form.slug === props.slug)
        : props.templates &&
          props.templates.find(template => template.slug === props.slug)
          ? props.templates.find(template => template.slug === props.slug)
          : props.utilities &&
            props.utilities.find(utility => utility.slug === props.slug),
    relativeHomePath: `../../${props.submissionId ? '../../' : ''}`,
  })),
  withHandlers({ handleCompleted }),
);

export const SurveyPreview = enhance(SurveyPreviewComponent);
