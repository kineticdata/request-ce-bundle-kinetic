import React from 'react';
import { connect } from 'react-redux';
import { matchPath, Switch } from 'react-router-dom';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import {
  KappRoute as Route,
  KappRedirect as Redirect,
  Loading,
  ErrorNotFound,
  ErrorUnexpected,
  selectCurrentKappSlug,
} from 'common';
import { actions } from './redux/modules/techBarApp';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { Display } from './components/Display';
import { Form } from './components/Form';
import './assets/styles/master.scss';

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else if (props.errors.length > 0) {
    return <ErrorUnexpected />;
  } else {
    return props.render({
      sidebar: <Switch>{/* <Route render={() => <Sidebar />} /> */}</Switch>,
      main: (
        <main className="package-layout package-layout--tech-bar">
          <Route path="/" exact component={Home} />
          <Route path="/forms/:formSlug/submissions/:id" component={Form} />
          <Route path="/forms/:formSlug/:id?" component={Form} />
          <Route path="/display/:id/:mode?" exact component={Display} />
          <Route component={ErrorNotFound} />
        </main>
      ),
    });
  }
};

const mapStateToProps = (state, props) => {
  const currentKapp = selectCurrentKappSlug(state);
  return {
    pathname: state.router.location.pathname,
    kappSlug: currentKapp,
    settingsBackPath: `/kapps/${currentKapp}`,
    loading: state.techBar.techBarApp.appLoading,
    errors: state.techBar.techBarApp.appErrors,
  };
};

const mapDispatchToProps = {
  fetchAppSettings: actions.fetchAppSettings,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  // withProps(props => {
  //   return props;
  // }),
  // withHandlers({}),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppSettings();
    },
  }),
);

export const App = enhance(AppComponent);

App.shouldSuppressSidebar = (pathname, kappSlug) =>
  matchPath(pathname, { path: `/kapps/${kappSlug}` });
