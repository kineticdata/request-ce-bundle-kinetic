import React from 'react';
import { Router } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { connect } from './redux/store';
import { ErrorUnexpected, Loading } from 'common';
import { I18n } from '@kineticdata/react';

import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { Past } from './components/Past';
import { TechBars } from './components/TechBars';
import { Display } from './components/Display';
import { Form } from './components/Form';
import { AppointmentForm } from './components/AppointmentForm';
import { Settings } from './components/settings/Settings';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { actions } from './redux/modules/techBarApp';

const AppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
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
        </Router>
      ),
      main: (
        <I18n>
          <main className={`package-layout package-layout--tech-bar`}>
            <Router>
              <Settings path="settings/*" />
              <Home path="/" />
              <TechBars path="/tech-bars" />
              <AppointmentForm path="/past/appointment/:techBarId/:id" />
              <Past path="/past" />
              <AppointmentForm path="/appointment/:techBarId/:id" />
              <AppointmentForm path="/appointment/:techBarId" />
              <AppointmentForm path="/appointment/:id" />
              <AppointmentForm path="/appointment" />
              <Form path="/forms/:formSlug/submissions/:id" />
              <Form path="/forms/:formSlug" />
              <Display path="/display/:techBarId/:mode" />
              <Display path="/display/:techBarId" />
            </Router>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({
  loading: state.techBarApp.loading,
  error: state.techBarApp.error,
  settingsBackPath: `/kapps/${state.app.kappSlug}`,
});

const mapDispatchToProps = {
  fetchAppDataRequest: actions.fetchAppDataRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppDataRequest();
    },
  }),
);

export const App = enhance(AppComponent);
