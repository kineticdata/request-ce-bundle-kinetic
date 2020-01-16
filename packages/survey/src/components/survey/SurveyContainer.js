import React from 'react';
import { Link, Router } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { ErrorMessage, LoadingMessage } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { actions as formActions } from '../../redux/modules/settingsForms';
import { SurveySettings } from './SurveySettings';
import { SurveyResults } from './SurveyResults';
import { SurveyTest } from './SurveyTest';
import { I18n } from '@kineticdata/react';
import { connect } from '../../redux/store';

// Wrapper for components that require the form object
export const SurveyContainer = compose(
  connect(
    state => ({
      kapp: state.app.kapp,
      form: state.settingsForms.form,
      error: state.settingsForms.error,
    }),
    { fetchFormRequest: formActions.fetchFormRequest },
  ),
  lifecycle({
    componentWillMount(prev, next) {
      this.props.fetchFormRequest({
        kappSlug: this.props.kapp.slug,
        formSlug: this.props.formSlug,
      });
    },
  }),
)(
  ({ form, error }) =>
    error || !form ? (
      <div className="page-container">
        <PageTitle parts={[form && form.name, `Forms`]} />
        <div className="page-panel page-panel--white">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="../">
                  <I18n>survey</I18n>
                </Link>{' '}
                /{` `}
                <Link to="">
                  <I18n>{form ? form.name : 'survey settings'}</I18n>
                </Link>{' '}
                /{` `}
              </h3>
            </div>
          </div>
          {error ? (
            <ErrorMessage message={error.message} />
          ) : (
            <LoadingMessage />
          )}
        </div>
      </div>
    ) : (
      <Router>
        <SurveyTest form={form} path="/test" />
        <SurveySettings form={form} path="/settings" />
        <SurveyResults form={form} path="/results" />
      </Router>
    ),
);
