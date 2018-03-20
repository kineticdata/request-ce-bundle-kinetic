import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Route, Switch } from 'react-router-dom';
import { Utils } from 'common';
import { actions } from './redux/modules/app';
import { SidebarContent } from './components/SidebarContent';
import { About } from './components/about/About';
import { AlertForm } from './components/alerts/AlertForm';
import { Alerts } from './components/alerts/Alerts';
import { Datastore } from './components/datastore/Datastore';
import { Discussion } from './components/discussion/Discussion';
import { EditProfile } from './components/profile/EditProfile';
import { Home } from './components/home/Home';
import { Notifications } from './components/notifications/Notifications';
import { ViewProfile } from './components/profile/ViewProfile';
import { TeamContainer } from './components/teams/TeamContainer';
import { TeamForm } from './components/teams/TeamForm';
import { TeamsContainer } from './components/teams/TeamsContainer';
import { IsolatedForm } from './components/shared/IsolatedForm';
import './styles/master.scss';

export const AppComponent = props => {
  if (props.loading) {
    return <div>App is loading...</div>;
  }
  return props.render({
    sidebar: (
      <SidebarContent
        kapps={props.kapps}
        teams={props.teams}
        isSpaceAdmin={props.isSpaceAdmin}
      />
    ),
    main: (
      <Fragment>
        <Notifications />
        <div className="space layout">
          <Route path="/" exact component={Home} />
          <Route path="/about" exact component={About} />
          <Route path="/alerts" exact component={Alerts} />
          <Route path="/alerts/:id" exact component={AlertForm} />
          <Route path="/discussions/:id" exact component={Discussion} />
          <Route path="/profile" exact component={EditProfile} />
          <Route path="/profile/:username" exact component={ViewProfile} />
          <Route path="/datastore" component={Datastore} />
          <Route path="/teams" exact component={TeamsContainer} />
          <Switch>
            <Route path="/teams/new" exact component={TeamForm} />
            <Route path="/teams/:slug" exact component={TeamContainer} />
          </Switch>
          <Route path="/teams/:slug/edit" exact component={TeamForm} />
          <Route path="/kapps/:kappSlug/forms/:formSlug" exact component={IsolatedForm} />
          <Route path="/kapps/:kappSlug/submissions/:id" exact component={IsolatedForm} />
        </div>
      </Fragment>
    ),
  });
};

export const mapStateToProps = state => ({
  loading: state.app.appLoading,
  kapps: state.kinops.kapps
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(kapp => kapp.slug !== 'admin'),
  teams: Utils.getTeams(state.kinops.profile).sort((a, b) =>
    a.name.localeCompare(b.name),
  ),
  isSpaceAdmin: state.kinops.profile.spaceAdmin,
});
const mapDispatchToProps = {
  fetchSettings: actions.fetchAppSettings,
};

export const App = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchSettings();
    },
  }),
)(AppComponent);
