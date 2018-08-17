import React from 'react';
import { connect } from 'react-redux';
import { matchPath, Switch } from 'react-router-dom';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { KappRoute as Route, KappRedirect as Redirect, Loading } from 'common';
import { Sidebar } from './components/Sidebar';
import './assets/styles/master.scss';

const mapStateToProps = (state, props) => {
  return {
    pathname: state.router.location.pathname,
    settingsBackPath: state.space.spaceApp.settingsBackPath || '/',
  };
};

const mapDispatchToProps = {};

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
  return props.render({
    sidebar: (
      <Switch>
        <Route render={() => <Sidebar />} />
      </Switch>
    ),
    main: (
      <main className="package-layout package-layout--tech-bar">
        <Route exact path="/" render={() => <div>Home</div>} />
      </main>
    ),
  });
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => {
    return props;
  }),
  withHandlers({}),
  lifecycle({
    componentWillMount() {},
  }),
);

export const App = enhance(AppComponent);

App.shouldSuppressSidebar = (pathname, kappSlug) =>
  matchPath(pathname, { path: `/kapps/${kappSlug}`, exact: true });
