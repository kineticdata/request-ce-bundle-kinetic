import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  KappLink as Link,
  Icon,
  ErrorUnauthorized,
  selectCurrentKappSlug,
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  selectHasRoleSchedulerAgent,
} from 'common';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { SchedulerSettings } from './SchedulerSettings';
import { TechBarSettings } from './TechBarSettings';
import { TechBar } from './tech-bar/TechBar';
import { TechBarSettingsForm } from './tech-bar/TechBarSettingsForm';
import { AppointmentForm } from './tech-bar/AppointmentForm';
import { I18n } from '../../../../app/src/I18nProvider';

export const SettingsComponent = ({ kappSlug, hasSettingsAccess }) =>
  hasSettingsAccess ? (
    <Switch>
      <Route
        exact
        path={`/kapps/${kappSlug}/settings/general`}
        component={TechBarSettings}
      />
      <Route
        exact
        path={`/kapps/${kappSlug}/settings/general/:id`}
        component={TechBar}
      />
      <Route
        exact
        path={`/kapps/${kappSlug}/settings/general/:id/edit`}
        component={TechBarSettingsForm}
      />
      <Route
        exact
        path={`/kapps/${kappSlug}/settings/general/:id/appointment/:apptid`}
        component={AppointmentForm}
      />
      <Route
        path={`/kapps/${kappSlug}/settings/schedulers`}
        render={props => (
          <SchedulerSettings
            {...props}
            breadcrumbs={
              <Fragment>
                <Link to="/">
                  <I18n>tech bar</I18n>
                </Link>{' '}
                /{` `}
                <Link to="/settings">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{` `}
              </Fragment>
            }
          />
        )}
      />
      <Route component={SettingsNavigation} />
    </Switch>
  ) : (
    <ErrorUnauthorized />
  );

const mapStateToProps = (state, props) => {
  return {
    kappSlug: selectCurrentKappSlug(state),
    hasSettingsAccess:
      selectHasRoleSchedulerAgent(state) ||
      selectHasRoleSchedulerManager(state) ||
      selectHasRoleSchedulerAdmin(state),
  };
};

const mapDispatchToProps = {};

export const Settings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillUnmount() {
      // TODO when to reload tech bar data?
    },
  }),
)(SettingsComponent);

const SettingsCard = ({ path, icon, name, description }) => (
  <Link to={path} className="card card--service">
    <h1>
      <Icon image={icon || 'fa-sticky-note-o'} background="blueSlate" />
      <I18n>{name}</I18n>
    </h1>
    <p>
      <I18n>{description}</I18n>
    </p>
  </Link>
);

const SettingsNavigationComponent = ({ hasManagerAccess }) => (
  <div className="page-container page-container--no-padding page-container--tech-bar-settings">
    <div className="page-panel">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">
              <I18n>tech bar</I18n>
            </Link>{' '}
            /{` `}
          </h3>
          <h1>
            <I18n>Settings</I18n>
          </h1>
        </div>
      </div>

      <div className="cards__wrapper cards__wrapper--tech-bar">
        <SettingsCard
          name="Tech Bars"
          path={`/settings/general`}
          icon="fa-gear"
          description="View and modify Tech Bar settings."
        />
        {hasManagerAccess && (
          <SettingsCard
            name="Schedulers"
            path={`/settings/schedulers`}
            icon="fa-calendar"
            description="View and modify scheduler settings, including event types and availability."
          />
        )}
      </div>
    </div>
  </div>
);

const mapStateToPropsNav = state => {
  return {
    hasManagerAccess:
      selectHasRoleSchedulerManager(state) ||
      selectHasRoleSchedulerAdmin(state),
  };
};

export const SettingsNavigation = compose(
  connect(
    mapStateToPropsNav,
    {},
  ),
)(SettingsNavigationComponent);
