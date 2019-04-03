import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import { Router, Redirect } from '@reach/router';
import { Utils, Loading, ErrorNotFound } from 'common';
import { actions } from './redux/modules/spaceApp';
import * as selectors from 'app/src/redux/selectors';
import { Sidebar } from './components/Sidebar';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { About } from './components/about/About';
import { AlertForm } from './components/alerts/AlertForm';
import { Alerts } from './components/alerts/Alerts';
import { Settings } from './components/settings/Settings';
import { Discussion } from './components/discussion/Discussion';
import { Home } from './components/home/Home';
import { Notifications } from './components/notifications/Notifications';
import { ViewProfile } from './components/profile/ViewProfile';
import { TeamContainer } from './components/teams/TeamContainer';
import { TeamsContainer } from './components/teams/TeamsContainer';
import { IsolatedForm } from './components/shared/IsolatedForm';
import { FormList } from './components/default_kapp/FormList';
import { I18n } from '../../app/src/I18nProvider';
import './assets/styles/master.scss';
import { context } from './redux/store';

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
  return props.render({
    sidebar: !props.isGuest && (
      <Router>
        <SettingsSidebar
          settingsBackPath={props.settingsBackPath}
          path="settings/*"
        />
        <Sidebar
          teams={props.teams}
          isSpaceAdmin={props.isSpaceAdmin}
          openSettings={props.openSettings}
          path="*"
        />
      </Router>
    ),
    main: (
      <I18n>
        <Notifications />
        <main
          className={`package-layout package-layout--space ${
            props.isGuest ? 'package-layout--guest' : ''
          }`}
        >
          <Router>
            <Settings path="settings/*" />

            <Home path="/" />
            <About path="/about" />
            <Alerts path="/alerts" />
            <AlertForm path="/alerts/:id" />
            <Discussion path="/discussions/:id" />
            <ViewProfile path="/profile/:username" />

            <TeamsContainer path="/teams" />
            <TeamContainer path="/teams/:slug" />
            <FormList path="/kapps/:kappSlug" />
            <IsolatedForm path="/kapps/:kappSlug/forms/:formSlug" />
            <IsolatedForm path="/kapps/:kappSlug/submissions/:id" />
            <IsolatedForm path="/kapps/:kappSlug/forms/:formSlug/submissions/:id" />

            {/* <Route
              path=
              render={({ match }) => (
                <Redirect
                  to={`/settings/datastore/${match.params.slug}/${
                    match.params.id
                  }`}
                />
              )}
            />
            <Route
              path="/datastore/forms/:slug"
              render={({ match }) => (
                <Redirect to={`/settings/datastore/${match.params.slug}/new`} />
              )}
            />
            <Route path="/reset-password" render={() => <Redirect to="/" />} />
            <Route component={ErrorNotFound} /> */}
          </Router>
        </main>
      </I18n>
    ),
  });
};

export const mapStateToProps = state => ({
  loading: state.spaceApp.appLoading,
  teams: Utils.getTeams(state.app.profile).sort((a, b) =>
    a.name.localeCompare(b.name),
  ),
  isSpaceAdmin: state.app.profile.spaceAdmin,
  isGuest: selectors.selectIsGuest(state),
  pathname: state.router.location.pathname,
  settingsBackPath: state.spaceApp.settingsBackPath || '/',
});
const mapDispatchToProps = {
  fetchSettings: actions.fetchAppSettings,
  setSettingsBackPath: actions.setSettingsBackPath,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withHandlers({
    openSettings: props => () => props.setSettingsBackPath(props.pathname),
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchSettings();
    },
  }),
);

export const App = enhance(AppComponent);
