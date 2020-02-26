import React, { Fragment } from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { parse } from 'query-string';
import { connect } from '../../redux/store';
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
  handleDelete,
  handleUnauthorized,
  values,
  kapp,
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
          {/* {authenticated &&
            submissionId &&
            form && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-outline-danger"
              >
                <I18n>Cancel Request</I18n>
              </button>
            )} */}
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
        `${props.appLocation}/requests/request/${
          response.submission.id
        }/confirmation`,
      );
    }
    props.fetchCurrentPage();
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

export const handleDelete = props => () => {
  const deleteCallback = () => {
    props.fetchCurrentPage();
    props.navigate(props.appLocation);
  };
  props.deleteSubmission({ id: props.submissionId, callback: deleteCallback });
};

export const mapStateToProps = state => ({
  forms: state.surveyApp.forms,
  values: valuesFromQueryParams(state.router.location.search),
  kapp: state.app.kapp,
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
});

const enhance = compose(
  connect(mapStateToProps),
  withProps(props => ({
    form:
      props.forms && props.forms.find(form => form.slug === 'survey-opt-out'),
  })),
  withHandlers({
    handleCompleted,
    handleCreated,
    handleLoaded,
    handleDelete,
    handleUnauthorized,
  }),
);

export const OptOut = enhance(OptOutComponent);
