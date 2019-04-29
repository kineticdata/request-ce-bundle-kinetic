import React from 'react';
import { connect } from 'react-redux';
import matchPath from 'rudy-match-path';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { Redirect } from '@reach/router';
import { Loading, ModalFormContainer } from 'common';
import { context } from './redux/store';

import { Router } from './ServicesApp';
import { actions as categoriesActions } from './redux/modules/categories';
import { actions as formsActions } from './redux/modules/forms';
import { actions as submissionsActions } from './redux/modules/submissions';
import { actions as submissionCountActions } from './redux/modules/submissionCounts';
import { CatalogContainer } from './components/home/CatalogContainer';
import { CategoryListContainer } from './components/category_list/CategoryListContainer';
import { CategoryContainer } from './components/category/CategoryContainer';
import { CatalogSearchResultsContainer } from './components/search_results/CatalogSearchResultsContainer';
import { Sidebar } from './components/Sidebar';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { FormContainer } from './components/form/FormContainer';
import { FormListContainer } from './components/form_list/FormListContainer';
import { RequestListContainer } from './components/request_list/RequestListContainer';
import { RequestShowContainer } from './components/request/RequestShowContainer';
import { Settings } from './components/settings/Settings';
import { displayableFormPredicate } from './utils';
import { I18n } from '@kineticdata/react';

import './assets/styles/master.scss';

const CustomRedirect = props => (
  <Redirect
    to={`${props.appLocation}/request/:id/${
      props.location.search.includes('review') ? 'review' : 'activity'
    }`}
    noThrow
  />
);

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
  return props.render({
    sidebar: (
      <Router>
        <SettingsSidebar
          path="settings/*"
          settingsBackPath={props.settingsBackPath}
        />

        <Sidebar
          path="*"
          counts={props.submissionCounts}
          homePageMode={props.homePageMode}
          homePageItems={props.homePageItems}
          openSettings={props.openSettings}
        />
      </Router>
    ),
    main: (
      <I18n>
        <main className="package-layout package-layout--services">
          <ModalFormContainer />
          <Router>
            <Settings path="settings/*" />
            <Redirect
              from="submissions/:id"
              to={`requests/request/:id/${
                props.location.search.includes('review') ? 'review' : 'activity'
              }`}
            />
            <CustomRedirect
              path="forms/:formSlug/submissions/:id"
              appLocation={props.appLocation}
            />

            <CatalogContainer
              path="/"
              homePageMode={props.homePageMode}
              homePageItems={props.homePageItems}
            />
            <CategoryListContainer path="categories" />
            <CategoryContainer path="categories/:categorySlug" />
            <FormContainer path="categories/:categorySlug/:formSlug" />
            <FormContainer path="categories/:categorySlug/:formSlug/:submissionId" />
            <FormListContainer path="forms" />
            <FormContainer path="forms/:formSlug" />
            <CatalogSearchResultsContainer path="search" />
            <CatalogSearchResultsContainer path="search/:query" />
            <RequestListContainer path="requests" />
            <RequestListContainer path="requests/:type" />
            <FormContainer path="requests/request/:submissionId" />
            <FormContainer path="requests/:type/request/:submissionId" />
            <RequestShowContainer path="/requests/request/:submissionId/:mode" />
            <RequestShowContainer path="/requests/:type/request/:submissionId/:mode" />
          </Router>
        </main>
      </I18n>
    ),
  });
};

const mapStateToProps = state => {
  return {
    categories: state.categories.data,
    forms: state.forms.data,
    submissionCounts: state.submissionCounts.data,
    loading: state.categories.loading || state.forms.loading,
    errors: [...state.categories.errors, ...state.forms.errors],
    systemError: state.systemError,
    pathname: state.router.location.pathname,
    kappSlug: state.app.kappSlug,
    appLocation: state.app.location,
  };
};

const mapDispatchToProps = {
  fetchCategories: categoriesActions.fetchCategories,
  fetchForms: formsActions.fetchForms,
  fetchSubmissionCounts: submissionCountActions.fetchSubmissionCounts,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withProps(props => {
    return props.categories.isEmpty()
      ? {
          homePageMode: 'Forms',
          homePageItems: props.forms
            .filter(displayableFormPredicate)
            .filter(form => form.categories.indexOf('home-page-services') > -1),
        }
      : {
          homePageMode: 'Categories',
          homePageItems: props.categories,
        };
  }),
  withState(
    'settingsBackPath',
    'setSettingsBackPath',
    props => `/kapps/${props.kappSlug}`,
  ),
  withHandlers({
    openSettings: props => () => props.setSettingsBackPath(props.pathname),
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchCategories();
      this.props.fetchForms();
      this.props.fetchSubmissionCounts();
    },
  }),
);

export const App = enhance(AppComponent);

App.shouldSuppressSidebar = (pathname, kappSlug) =>
  matchPath(pathname, { path: `/kapps/${kappSlug}`, exact: true });
