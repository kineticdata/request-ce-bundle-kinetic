import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { KappRoute as Route, KappRedirect as Redirect, Loading } from 'common';
import { actions as categoriesActions } from './redux/modules/categories';
import { actions as formsActions } from './redux/modules/forms';
import { actions as submissionsActions } from './redux/modules/submissions';
import { actions as submissionCountActions } from './redux/modules/submissionCounts';
import { CatalogContainer } from './components/home/CatalogContainer';
import { CategoryListContainer } from './components/category_list/CategoryListContainer';
import { CategoryContainer } from './components/category/CategoryContainer';
import { CatalogSearchResultsContainer } from './components/search_results/CatalogSearchResultsContainer';
import { Sidebar } from './components/Sidebar';
import { FormContainer } from './components/form/FormContainer';
import { FormListContainer } from './components/form_list/FormListContainer';
import { RequestListContainer } from './components/request_list/RequestListContainer';
import { RequestShowContainer } from './components/request/RequestShowContainer';
import { displayableFormPredicate } from './utils';
import './assets/styles/master.scss';

const mapStateToProps = (state, props) => {
  return {
    categories: state.categories.data,
    forms: state.forms.data,
    submissionCounts: state.submissionCounts.data,
    loading: state.categories.loading || state.forms.loading,
    errors: [...state.categories.errors, ...state.forms.errors],
    systemError: state.systemError,
  };
};

const mapDispatchToProps = {
  fetchCategories: categoriesActions.fetchCategories,
  fetchForms: formsActions.fetchForms,
  fetchSubmissionCounts: submissionCountActions.fetchSubmissionCounts,
};

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
  return props.render({
    sidebar: (
      <Sidebar
        counts={props.submissionCounts}
        homePageMode={props.homePageMode}
        homePageItems={props.homePageItems}
      />
    ),
    main: (
      <main className="package-layout package-layout--services">
        <Route
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
        <Route
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
        <Route
          exact
          path="/"
          render={() => (
            <CatalogContainer
              homePageMode={props.homePageMode}
              homePageItems={props.homePageItems}
            />
          )}
        />
        <Route exact path="/categories" component={CategoryListContainer} />
        <Route
          exact
          path="/categories/:categorySlug"
          component={CategoryContainer}
        />
        <Route
          exact
          path="/categories/:categorySlug/:formSlug"
          component={FormContainer}
        />
        <Route
          exact
          path="/categories/:categorySlug/:formSlug/:submissionId"
          component={FormContainer}
        />
        <Route exact path="/forms" component={FormListContainer} />
        <Route path="/forms/:formSlug" component={FormContainer} />
        <Route exact path="/search" component={CatalogSearchResultsContainer} />
        <Route exact path="/search/:query" component={CatalogSearchResultsContainer} />
        <Route exact path="/requests/:type?" component={RequestListContainer} />
        <Route
          exact
          path="/requests/:type?/request/:submissionId"
          component={FormContainer}
        />
        <Route
          exact
          path="/requests/:type?/request/:submissionId/:mode"
          component={RequestShowContainer}
        />
      </main>
    ),
  });
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
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
