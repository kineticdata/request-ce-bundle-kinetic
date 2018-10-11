import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Icon, PageTitle } from 'common';

import { SpaceSettings } from './space_settings/SpaceSettings';
import { Notifications } from './notifications/Notifications';
import { Datastore } from './datastore/Datastore';
import { Robots } from './robots/Robots';
import { Users } from './users/Users';
import { Profile } from './profile/Profile';
import { Teams } from './teams/Teams';
import { actions as datastoreActions } from '../../redux/modules/settingsDatastore';
import { actions as teamActions } from '../../redux/modules/teamList';

export const SettingsComponent = () => (
  <Switch>
    <Route path="/settings/profile" component={Profile} />
    <Route path="/settings/system" component={SpaceSettings} />
    <Route path="/settings/datastore" component={Datastore} />
    <Route path="/settings/robots" component={Robots} />
    <Route path="/settings/users" component={Users} />
    <Route path="/settings/notifications" component={Notifications} />
    <Route path="/settings/teams" component={Teams} />
    <Route component={SettingsNavigation} />
  </Switch>
);

const mapDispatchToProps = {
  fetchForms: datastoreActions.fetchForms,
  fetchTeams: teamActions.fetchTeams,
};

export const Settings = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount(prev, next) {
      this.props.fetchForms();
      this.props.fetchTeams();
    },
  }),
)(SettingsComponent);

const SettingsCard = ({ path, icon, name, description }) => (
  <Link to={path} className="card card--service">
    <h1>
      <Icon image={icon || 'fa-sticky-note-o'} background="blueSlate" />
      {name}
    </h1>
    <p>{description}</p>
  </Link>
);

const SettingsNavigationComponent = ({ isSpaceAdmin }) => (
  <div className="page-container page-container--space-settings">
    <PageTitle parts={['Settings']} />
    <div className="page-panel page-panel--datastore-content">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
          </h3>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="cards__wrapper cards__wrapper--services">
        <SettingsCard
          name="Edit Profile"
          path={`/settings/profile`}
          icon="fa-user"
          description="Edit your profile"
        />
        {isSpaceAdmin && (
          <Fragment>
            <SettingsCard
              name="User Management"
              path={`/settings/users`}
              icon="fa-users"
              description="Create, Edit and Import Users"
            />

            <SettingsCard
              name="Team Management"
              path={`/settings/teams`}
              icon="fa-users"
              description="Create and Edit Teams"
            />

            <SettingsCard
              name="System Settings"
              path={`/settings/system`}
              icon="fa-gear"
              description="View and Modify all System Settings"
            />

            <SettingsCard
              name="Datastore Forms"
              path={`/settings/datastore`}
              icon="fa-hdd-o"
              description="View, Create and Edit Reference Data"
            />
            <SettingsCard
              name="Notifications"
              path={`/settings/notifications`}
              icon="fa-envelope-o"
              description="View, Create and Edit Email Notifications"
            />
            <SettingsCard
              name="Robots"
              path={`/settings/robots`}
              icon="fa-tasks"
              description="View, Create and Edit Robots"
            />
          </Fragment>
        )}
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  isSpaceAdmin: state.app.profile.spaceAdmin,
});

export const SettingsNavigation = compose(
  connect(
    mapStateToProps,
    {},
  ),
)(SettingsNavigationComponent);
