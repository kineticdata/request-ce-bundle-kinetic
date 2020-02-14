import React from 'react';
import { Router } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { ErrorUnexpected, Loading } from 'common';
import { I18n } from '@kineticdata/react';
import { connect } from './redux/store';

import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { Form } from './components/Form';
import { Settings } from './components/settings/Settings';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { actions } from './redux/modules/scaffoldApp';

const AppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      sidebar: (
        <Router>
          <SettingsSidebar path="settings/*" />
          <Sidebar path="*" />
        </Router>
      ),
      main: (
        <I18n>
          <main className={`package-layout package-layout--scaffold`}>
            <Router>
              <Settings path="/settings/*" homePath="../" />
              <Home path="/" />
              <Form
                path="/forms/:formSlug/submissions/:id"
                homePath="../../../../"
              />
              <Form path="/forms/:formSlug" homePath="../../../../" />
            </Router>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({
  loading: state.scaffoldApp.loading,
  error: state.scaffoldApp.error,
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
