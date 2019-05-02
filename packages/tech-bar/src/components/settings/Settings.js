import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { Router } from '../../TechBarApp';
import { connect } from '../../redux/store';
import { compose } from 'recompose';
import {
  Icon,
  ErrorUnauthorized,
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  selectHasRoleSchedulerAgent,
} from 'common';
import { SchedulerSettings } from './SchedulerSettings';
import { TechBarMetrics } from './TechBarMetrics';
import { TechBarSettings } from './TechBarSettings';
import { TechBar } from './tech-bar/TechBar';
import { TechBarSettingsForm } from './tech-bar/TechBarSettingsForm';
import { AppointmentForm } from './tech-bar/AppointmentForm';
import { I18n } from '@kineticdata/react';

export const SettingsComponent = ({ kappSlug, hasSettingsAccess }) =>
  hasSettingsAccess ? (
    <Router>
      <TechBarMetrics path="metrics/:mode" />
      <TechBarMetrics path="metrics" />
      <AppointmentForm path="general/:techBarId/appointment/:id" />
      <TechBarSettingsForm path="general/:techBarId/edit" />
      <TechBar path="general/:techBarId" />
      <TechBarSettings path="general" />
      <SchedulerSettings
        path="schedulers"
        breadcrumbs={
          <Fragment>
            <Link to="">
              <I18n>tech bar</I18n>
            </Link>{' '}
            /{` `}
            <Link to="settings">
              <I18n>settings</I18n>
            </Link>{' '}
            /{` `}
          </Fragment>
        }
      />
      <SettingsNavigation default />
    </Router>
  ) : (
    <ErrorUnauthorized />
  );

const mapStateToProps = (state, props) => {
  return {
    kappSlug: state.app.kappSlug,
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
            <Link to="../">
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
          name="Metrics"
          path={`metrics`}
          icon="fa-bar-chart"
          description="View metrics for the Tech Bars."
        />
        <SettingsCard
          name="Tech Bars"
          path={`general`}
          icon="fa-gear"
          description="View and modify Tech Bar settings."
        />
        {hasManagerAccess && (
          <SettingsCard
            name="Schedulers"
            path={`schedulers`}
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

export const SettingsNavigation = compose(connect(mapStateToPropsNav))(
  SettingsNavigationComponent,
);
