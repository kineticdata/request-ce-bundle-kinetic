import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Icon } from 'common';

import { SpaceSettings } from './spaceSettings/SpaceSettings';
import { Notifications } from './notifications/Notifications';
import { Datastore } from './datastore/Datastore';
import { Users } from './users/Users';
import { Profile } from './profile/Profile';

export const Settings = () => (
  <Switch>
    <Route path="/settings/profile" component={Profile} />
    <Route path="/settings/space" component={SpaceSettings} />
    <Route path="/settings/datastore" component={Datastore} />
    <Route path="/settings/users" component={Users} />
    <Route path="/settings/notifications" component={Notifications} />
    <Route component={SettingsNavigation} />
  </Switch>
);

const SettingsCard = ({ path, icon, name, description }) => (
  <Link to={path} className="s-card">
    <h1>
      <Icon image={icon || 'fa-sticky-note-o'} background="blueSlate" />
      {name}
    </h1>
    <p>{description}</p>
  </Link>
);

const SettingsNavigationComponent = ({ isSpaceAdmin }) => (
  <div className="datastore-container">
    <div className="datastore-content panel">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
          </h3>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="services s-cards-wrapper">
        <SettingsCard
          name="Edit My Profile"
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
              name="System Settings"
              path={`/settings/space`}
              icon="fa-gear"
              description="View and Modify all System Settings"
            />

            <SettingsCard
              name="Datastore"
              path={`/settings/datastore`}
              icon="fa-drive"
              description="View, Create and Edit Reference Data"
            />
            <SettingsCard
              name="Notifications"
              path={`/settings/notifications`}
              icon="fa-drive"
              description="View, Create and Edit Email Notifications"
            />
          </Fragment>
        )}
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  isSpaceAdmin: state.kinops.profile.spaceAdmin,
});

export const SettingsNavigation = compose(connect(mapStateToProps, {}))(
  SettingsNavigationComponent,
);
