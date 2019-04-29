import React from 'react';
import { connect } from 'react-redux';
import { matchPath, Switch } from 'react-router-dom';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { Redirect } from '@reach/router';
import { Router } from './TechbarApp';
import { Loading, ErrorUnexpected, selectCurrentKappSlug } from 'common';

import { context } from './redux/store';
import { actions } from './redux/modules/techBarApp';
import { actions as appointmentActions } from './redux/modules/appointments';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { Past } from './components/Past';
import { TechBars } from './components/TechBars';
import { Display } from './components/Display';
import { Form } from './components/Form';
import { AppointmentForm } from './components/AppointmentForm';
import { Settings } from './components/settings/Settings';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { I18n } from '@kineticdata/react';
import './assets/styles/master.scss';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else if (props.errors.length > 0) {
    return <ErrorUnexpected />;
  } else {
    return props.render({
      sidebar: (
        <Router>
          <SettingsSidebar
            settingsBackPath={props.settingsBackPath}
            path="settings/*"
          />
          <Sidebar
            counts={props.submissionCounts}
            homePageMode={props.homePageMode}
            homePageItems={props.homePageItems}
            openSettings={props.openSettings}
            path="*"
          />
          />
        </Router>
      ),
      main: (
        <I18n>
          <main className={`package-layout package-layout--tech-bar`}>
            <Router>
              <Settings path="settings/*" />
              <Home path="/" />
              <Past path="/past" />
              <TechBars path="/tech-bars" />
              <Form path="/forms/:formSlug/submissions/:id" />
              <AppointmentForm path="/appointment/:techBarId/:id?" />
              <AppointmentForm path="/appointment/:id?" />

              <AppointmentForm
                {...props}
                isPast={true}
                path="/past/appointment/:techBarId/:id?"
              />
              <AppointmentForm
                {...props}
                isPast={true}
                path="/past/appointment/:techBarId"
              />
              <Form path="/forms/:formSlug/:id" />
              <Form path="/forms/:formSlug" />
              <Display path="/display/:id" />
              <Display path="/display/:id/:mode" />
            </Router>
          </main>
        </I18n>
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
    loading: state.techBarApp.appLoading,
    errors: state.techBarApp.appErrors,
    fullScreen: matchPath(state.router.location.pathname, {
      path: `/kapps/${currentKapp}/display`,
    }),
  };
};

const mapDispatchToProps = {
  fetchAppSettings: actions.fetchAppSettings,
  fetchUpcomingAppointments: appointmentActions.fetchUpcomingAppointments,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppSettings();
      this.props.fetchUpcomingAppointments();
    },
  }),
);

export const App = enhance(AppComponent);

App.shouldSuppressSidebar = (pathname, kappSlug) =>
  matchPath(pathname, { path: `/kapps/${kappSlug}` });
App.shouldHideHeader = (pathname, kappSlug) =>
  matchPath(pathname, { path: `/kapps/${kappSlug}/display` });
