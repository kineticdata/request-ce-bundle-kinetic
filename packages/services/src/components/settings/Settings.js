import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { KappLink as Link, Icon, selectCurrentKappSlug } from 'common';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { ServicesSettings } from './servicesSettings/ServicesSettings';
import { actions } from '../../redux/modules/settingsServices';
import { FormList } from './forms/FormList';
import { FormSettings } from './forms/FormSettings';
import { FormActivity } from './forms/FormActivity';
import { CreateForm } from './forms/CreateForm';
import { CategoriesSettings } from './categories/Categories';
import { FormSubmissions } from './forms/FormSubmissions';

export const SettingsComponent = ({ kappSlug }) => (
  <Switch>
    <Route
      exact
      path={`/kapps/${kappSlug}/settings/general`}
      component={ServicesSettings}
    />
    <Route
      exact
      path={`/kapps/${kappSlug}/settings/forms`}
      component={FormList}
    />
    <Route
      exact
      path={`/kapps/${kappSlug}/settings/forms/new`}
      component={CreateForm}
    />
    <Route
      exact
      path={`/kapps/${kappSlug}/settings/forms/clone/:id`}
      component={CreateForm}
    />
    <Route
      exact
      path={`/kapps/${kappSlug}/settings/forms/:id/settings`}
      component={FormSettings}
    />
    <Route
      exact
      path={`/kapps/${kappSlug}/settings/forms/:id/`}
      component={FormSubmissions}
    />
    <Route
      exact
      path={`/kapps/${kappSlug}/settings/forms/:id/activity`}
      component={FormActivity}
    />
    <Route
      exact
      path={`/kapps/${kappSlug}/settings/categories`}
      component={CategoriesSettings}
    />
    <Route component={SettingsNavigation} />
  </Switch>
);

const mapStateToProps = (state, props) => ({
  kappSlug: selectCurrentKappSlug(state),
});

const mapDispatchToProps = {
  fetchServicesSettings: actions.fetchServicesSettings,
};

export const Settings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount(prev, next) {
      this.props.fetchServicesSettings();
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
            <Link to="/">services</Link> /{` `}
          </h3>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="cards__wrapper cards__wrapper--services">
        {isSpaceAdmin && (
          <SettingsCard
            name="General Settings"
            path={`/settings/general`}
            icon="fa-gear"
            description="View and Modify all Services Settings"
          />
        )}
        <SettingsCard
          name="Forms"
          path={`/settings/forms`}
          icon="fa-gear"
          description="View Forms and their Submissions."
        />
        {isSpaceAdmin && (
          <SettingsCard
            name="Categories"
            path={`/settings/categories`}
            icon="fa-gear"
            description="View and Modify Categories"
          />
        )}
      </div>
    </div>
  </div>
);

const mapStateToPropsNav = state => ({
  isSpaceAdmin: state.app.profile.spaceAdmin,
});

export const SettingsNavigation = compose(
  connect(
    mapStateToPropsNav,
    {},
  ),
)(SettingsNavigationComponent);
