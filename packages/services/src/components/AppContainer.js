import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import {
  KinopsModule,
  HeaderContainer,
  ToastsContainer,
  ModalFormContainer,
} from 'react-kinops-common';
import Sidebar from 'react-sidebar';
import { Helmet } from 'react-helmet';
import '../assets/styles';
import { actions as categoriesActions } from '../redux/modules/categories';
import { actions as formsActions } from '../redux/modules/forms';
import { actions as submissionsActions } from '../redux/modules/submissions';
import { actions as submissionCountActions } from '../redux/modules/submissionCounts';
import { actions as appActions } from '../redux/modules/app';
import { CatalogContainer } from './CatalogContainer';
import { CategoryListContainer } from './Services/CategoryListContainer';
import { CategoryContainer } from './Services/CategoryContainer';
import { CatalogSearchResultsContainer } from '../components/Services/CatalogSearchResultsContainer';
import { Loading } from './app/Loading';
import { Sidebar as SidebarContent } from './Sidebar';
import { FormContainer } from './Services/FormContainer';
import { FormListContainer } from './Services/FormListContainer';
import { RequestListContainer } from './Requests/RequestListContainer';
import { RequestShowContainer } from './Requests/RequestShowContainer';
import { displayableFormPredicate } from '../helpers';

const mapStateToProps = (state, props) => {
  const { kinops, categories, forms, systemError } = state;
  return {
    categories: categories.data,
    forms: forms.data,
    submissionCounts: state.submissionCounts.data,
    loading: kinops.loading || categories.loading || forms.loading,
    errors: [...categories.errors, ...forms.errors],
    systemError,
    layoutSize: state.app.layoutSize,
    sidebarOpen: state.app.sidebarOpen,
    homeSidebarOpen: state.app.homeSidebarOpen,
    isHome: props.location.pathname === '/',
  };
};

const mapDispatchToProps = {
  fetchCategories: categoriesActions.fetchCategories,
  fetchForms: formsActions.fetchForms,
  fetchSubmissions: submissionsActions.fetchSubmissions,
  fetchSubmissionCounts: submissionCountActions.fetchSubmissionCounts,
  loadApp: KinopsModule.actions.loadApp,
  setSidebarOpen: appActions.setSidebarOpen,
  setHomeSidebarOpen: appActions.setHomeSidebarOpen,
};

export const App = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
  return (
    <div>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Helmet>
      <ToastsContainer />
      <ModalFormContainer />
      <HeaderContainer hasSidebar toggleSidebarOpen={props.toggleSidebar} />
      <Sidebar
        sidebar={
          <SidebarContent
            counts={props.submissionCounts}
            homePageMode={props.homePageMode}
            homePageItems={props.homePageItems}
          />
        }
        shadow={false}
        open={props.sidebarOpen && props.layoutSize === 'small'}
        docked={props.sidebarOpen && props.layoutSize !== 'small'}
        onSetOpen={props.setSidebarOpen}
        sidebarClassName={`services-sidebar ${true ? 'drawer' : 'overlay'}`}
      >
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
          path="/categories/:categorySlug/:formSlug"
          component={FormContainer}
        />
        <Route exact path="/forms" component={FormListContainer} />
        <Route path="/forms/:formSlug" component={FormContainer} />
        <Route exact path="/search" component={CatalogSearchResultsContainer} />
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
      </Sidebar>
    </div>
  );
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(props => ({
    sidebarOpen: props.isHome ? props.homeSidebarOpen : props.sidebarOpen,
  })),
  withHandlers({
    toggleSidebar: props => () => {
      props.isHome
        ? props.setHomeSidebarOpen(!props.sidebarOpen)
        : props.setSidebarOpen(!props.sidebarOpen);
    },
  }),
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
      this.props.loadApp();
      this.props.fetchCategories();
      this.props.fetchForms();
      this.props.fetchSubmissions();
      this.props.fetchSubmissionCounts();
    },
  }),
);

export const AppContainer = enhance(App);
