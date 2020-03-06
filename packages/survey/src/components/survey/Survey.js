import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { actions } from '../../redux/modules/surveys';
import { compose, lifecycle, withProps } from 'recompose';
import { I18n, CoreForm } from '@kineticdata/react';
import {
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  LoadingMessage,
} from 'common';
import { PageTitle } from '../shared/PageTitle';
import { parse } from 'query-string';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.

const globals = import('common/globals');

export const SurveyComponent = ({
  authenticated,
  loading,
  submission,
  slug,
  kappSlug,
  values,
}) => (
  <Fragment>
    <PageTitle parts={[submission ? submission.form.name : '']} />
    {!loading && submission ? (
      <div className="page-container page-container--color-bar">
        <div className="page-panel">
          <I18n
            context={`kapps.${kappSlug}.forms.${slug}`}
            public={!authenticated}
          >
            <div className="embedded-core-form--wrapper">
              <CoreForm
                submission={submission.id}
                public={!authenticated}
                review={submission.coreState !== 'Draft'}
                form={submission.form.slug}
                globals={globals}
                values={values}
                notFoundComponent={ErrorNotFound}
                unauthorizedComponent={ErrorUnauthorized}
                unexpectedErrorComponent={ErrorUnexpected}
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
    props.navigate(
      `${props.appLocation}/requests/request/${
        response.submission.id
      }/confirmation`,
    );
  }
};

export const mapStateToProps = state => ({
  authenticated: state.app.authenticated,
  kappSlug: state.app.kappSlug,
  loading: state.surveyApp.loading,
  submission: state.surveys.submission,
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
    slug: props.submission && props.submission.form.slug,
  })),
  lifecycle({
    componentWillMount() {
      this.props.submissionId &&
        this.props.fetchSubmission({
          id: this.props.submissionId,
        });
    },
  }),
);

export const Survey = enhance(SurveyComponent);
