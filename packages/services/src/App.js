import React from 'react';
import { connect } from 'react-redux';
import { matchPath, Switch, Route } from 'react-router-dom';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import {
  KappRoute,
  KappRedirect as Redirect,
  Loading,
  selectCurrentKappSlug,
} from 'common';
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

import './assets/styles/master.scss';

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
  return props.render({
    sidebar: (
      <Switch>
        <Route
          path={`/kapps/${props.kappSlug}/settings`}
          render={() => (
            <SettingsSidebar settingsBackPath={props.settingsBackPath} />
          )}
        />
        <Route
          render={() => (
            <Sidebar
              counts={props.submissionCounts}
              homePageMode={props.homePageMode}
              homePageItems={props.homePageItems}
              openSettings={props.openSettings}
            />
          )}
        />
      </Switch>
    ),
    main: (
      <main className="package-layout package-layout--services">
        <KappRoute path="/settings" component={Settings} />
        <KappRoute
          path="/submissions/:id"
          exact
          render={({ match, location }) => (
            <Redirect
              to={`/requests/request/${match.params.id}/${
                location.search.includes('review') ? 'review' : 'activity'
              }`}
            />
          )}
        />
        <KappRoute
          path="/forms/:formSlug/submissions/:id"
          exact
          render={({ match, location }) => (
            <Redirect
              to={`/requests/request/${match.params.id}/${
                location.search.includes('review') ? 'review' : 'activity'
              }`}
            />
          )}
        />
        <KappRoute
          exact
          path="/"
          render={() => (
            <CatalogContainer
              homePageMode={props.homePageMode}
              homePageItems={props.homePageItems}
            />
          )}
        />
        <KappRoute exact path="/categories" component={CategoryListContainer} />
        <KappRoute
          exact
          path="/categories/:categorySlug"
          component={CategoryContainer}
        />
        <KappRoute
          exact
          path="/categories/:categorySlug/:formSlug"
          component={FormContainer}
        />
        <KappRoute
          exact
          path="/categories/:categorySlug/:formSlug/:submissionId"
          component={FormContainer}
        />
        <KappRoute exact path="/forms" component={FormListContainer} />
        <KappRoute path="/forms/:formSlug" component={FormContainer} />
        <KappRoute
          exact
          path="/search"
          component={CatalogSearchResultsContainer}
        />
        <KappRoute
          exact
          path="/search/:query"
          component={CatalogSearchResultsContainer}
        />
        <KappRoute
          exact
          path="/requests/:type?"
          component={RequestListContainer}
        />
        <KappRoute
          exact
          path="/requests/:type?/request/:submissionId"
          component={FormContainer}
        />
        <KappRoute
          exact
          path="/requests/:type?/request/:submissionId/:mode"
          component={RequestShowContainer}
        />
      </main>
    ),
  });
};

const mapStateToProps = state => {
  return {
    categories: state.services.categories.data,
    forms: state.services.forms.data,
    submissionCounts: state.services.submissionCounts.data,
    loading: state.services.categories.loading || state.services.forms.loading,
    errors: [
      ...state.services.categories.errors,
      ...state.services.forms.errors,
    ],
    systemError: state.services.systemError,
    pathname: state.router.location.pathname,
    kappSlug: selectCurrentKappSlug(state),
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
