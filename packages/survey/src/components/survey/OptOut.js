import React, { Fragment } from 'react';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { parse } from 'query-string';
import { connect } from '../../redux/store';
import { actions } from '../../redux/modules/surveys';
import { CoreForm, I18n } from '@kineticdata/react';
import { Link } from '@reach/router';
import { ErrorNotFound, ErrorUnauthorized, ErrorUnexpected } from 'common';
import { PageTitle } from '../shared/PageTitle';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const OptOutComponent = ({
  form,
  type,
  submissionId,
  handleCreated,
  handleCompleted,
  handleLoaded,
  handleUnauthorized,
  values,
  kapp,
  kappSlug,
  formSlug,
  path,
  appLocation,
  authenticated,
}) =>
  form && (
    <Fragment>
      <PageTitle parts={[form ? form.name : '']} />
      <div className="page-container page-container--color-bar">
        <div className="page-panel">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to={appLocation}>
                  <I18n>{kapp.name}</I18n>
                </Link>{' '}
                /{' '}
              </h3>
              {form && (
                <h1>
                  <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
                    {form.name}
                  </I18n>
                </h1>
              )}
            </div>
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
                context={`kapps.${kappSlug}.forms.${form.slug}`}
                public={!authenticated}
              >
                <CoreForm
                  kapp={kappSlug}
                  form={form.slug}
                  globals={globals}
                  // loaded={handleLoaded}
                  // created={handleCreated}
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
      props.navigate(
        `${props.appLocation}/survey-opt-out/confirmation?id=${
          response.submission.id
        }`,
      );
    }
    // props.fetchCurrentPage();
  }
};

export const handleCreated = props => response => {
  if (
    response.submission.coreState !== 'Submitted' ||
    response.submission.currentPage
  ) {
    props.navigate(response.submission.id);
  }
};

export const handleUnauthorized = props => response => {
  if (!props.authenticated) {
    props.navigate(props.authRoute);
  }
};

export const handleLoaded = props => form => {
  props.setForm({
    slug: form.slug(),
    name: form.name(),
    description: form.description(),
  });
};

const mapStateToProps = state => ({
  form: state.surveys.form,
  forms: state.surveyApp.forms,
  values: valuesFromQueryParams(state.router.location.search),
  kapp: state.app.kapp,
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
});

export const mapDispatchToProps = {
  fetchFormRequest: actions.fetchFormRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  // withProps(props => ({
  //   form:
  //     props.forms && props.forms.find(form => form.slug === 'survey-opt-out'),
  // })),
  withHandlers({
    handleCompleted,
    handleCreated,
    handleLoaded,
    handleUnauthorized,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchFormRequest({
        kappSlug: this.props.kappSlug,
        formSlug: 'survey-opt-out',
      });
    },
  }),
);

export const OptOut = enhance(OptOutComponent);
