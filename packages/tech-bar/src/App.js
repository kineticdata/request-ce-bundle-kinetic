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

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_DISPLAY_FORMAT = 'dddd, LL';
export const TIME_FORMAT = 'HH:mm';
export const TIME_DISPLAY_FORMAT = 'LT';

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else if (props.errors.length > 0) {
    return <ErrorUnexpected />;
  } else {
    return props.render({
      main: (
        <main
          className={`package-layout package-layout--tech-bar ${
            props.fullScreen ? 'package-layout--tech-bar__full-screen' : ''
          }`}
        >
          <Route path="/" exact component={Home} />
          <Route
            path="/forms/:formSlug/submissions/:id"
            exact
            component={Form}
          />
          <Route path="/forms/:formSlug/:id?" exact component={Form} />
          <Route path="/display/:id/:mode?" exact component={Display} />
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
    fullScreen: matchPath(state.router.location.pathname, {
      path: `/kapps/${currentKapp}/display`,
    }),
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

App.shouldHideSidebar = (pathname, kappSlug) =>
  matchPath(pathname, { path: `/kapps/${kappSlug}` });
