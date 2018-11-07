import React from 'react';
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Icon } from 'common';

import { QueueSettings } from './QueueSettings';
import { actions } from '../../redux/modules/settingsQueue';
import { FormList } from './forms/FormList';
import { FormSettings } from './forms/FormSettings';
import { FormActivity } from './forms/FormActivity';
import { CreateForm } from './forms/CreateForm';
import { FormSubmissions } from './forms/FormSubmissions';

export const SettingsComponent = () => (
  <Switch>
    <Route
      exact
      path="/kapps/queue/settings/general"
      component={QueueSettings}
    />
    <Route exact path="/kapps/queue/settings/forms" component={FormList} />
    <Route
      exact
      path="/kapps/queue/settings/forms/new"
      component={CreateForm}
    />
    <Route
      exact
      path="/kapps/queue/settings/forms/clone/:id"
      component={CreateForm}
    />
    <Route
      exact
      path="/kapps/queue/settings/forms/:id/settings"
      component={FormSettings}
    />
    <Route
      exact
      path="/kapps/queue/settings/forms/:id/"
      component={FormSubmissions}
    />
    <Route
      exact
      path="/kapps/queue/settings/forms/:id/activity"
      component={FormActivity}
    />
    <Route component={SettingsNavigation} />
  </Switch>
);

const mapDispatchToProps = {
  fetchQueueSettings: actions.fetchQueueSettings,
};

export const Settings = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount(prev, next) {
      this.props.fetchQueueSettings();
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
    <div className="page-panel page-panel--datastore-content">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">queue</Link> /{` `}
          </h3>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="cards__wrapper cards__wrapper--services">
        {isSpaceAdmin && (
          <SettingsCard
            name="General Settings"
            path={`/kapps/queue/settings/general`}
            icon="fa-gear"
            description="View and Modify all Queue Settings"
          />
        )}
        <SettingsCard
          name="Forms"
          path={`/kapps/queue/settings/forms`}
          icon="fa-gear"
          description="View Forms and their Submissions."
        />
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
