import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Icon } from 'common';

import { ServicesSettings } from './servicesSettings/ServicesSettings';
import { actions } from '../../redux/modules/settingsServices';
import { FormList } from './forms/FormList';
import { FormSettings } from './forms/FormSettings';
import { CreateForm } from './forms/CreateForm';
import { CategoriesSettings } from './categories/Categories';
import { FormSubmissions } from './forms/FormSubmissions';

export const SettingsComponent = () => (
  <Switch>
    <Route exact path="/kapps/services/settings" component={ServicesSettings} />
    <Route exact path="/kapps/services/settings/forms" component={FormList} />
    <Route
      exact
      path="/kapps/services/settings/forms/new"
      component={CreateForm}
    />
    <Route
      exact
      path="/kapps/services/settings/forms/:id/settings"
      component={FormSettings}
    />
    <Route
      exact
      path="/kapps/services/settings/forms/:id/"
      component={FormSubmissions}
    />
    <Route
      exact
      path="/kapps/services/settings/categories"
      component={CategoriesSettings}
    />
    <Route component={SettingsNavigation} />
  </Switch>
);

const mapDispatchToProps = {
  updateServicesSettings: actions.updateServicesSettings,
  fetchServicesSettings: actions.fetchServicesSettings,
};

export const Settings = compose(
  connect(
    null,
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
            <Link to="/">home</Link> /{` `}
          </h3>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="cards__wrapper cards__wrapper--services">
        {isSpaceAdmin && (
          <Fragment>
            <SettingsCard
              name="Services Settings"
              path={`/settings/services`}
              icon="fa-gear"
              description="View and Modify all Services Settings"
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
