import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { bundle } from '@kineticdata/react';
import { selectHasSharedTaskEngine } from '../redux/modules/spaceApp';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from 'common';
import { NOTIFICATIONS_FORM_SLUG } from '../redux/modules/settingsNotifications';
import { ROBOT_DEFINITIONS_FORM_SLUG } from '../redux/modules/settingsRobots';
import { I18n } from '@kineticdata/react';
import { context } from '../redux/store';

import { isActiveClass } from '../utils';

export const SidebarComponent = ({
  hasSharedTaskEngine,
  loading,
  spaceAdmin,
  showDatastore,
  showNotifications,
  showRobots,
  showSchedulers,
}) => (
  <div className="sidebar">
    <div className="sidebar-group--content-wrapper">
      {!loading && (
        <ul className="nav flex-column sidebar-group">
          <li className="nav-item">
            {spaceAdmin && (
              <Link to="system" getProps={isActiveClass('nav-link')}>
                <I18n>System</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
            {showDatastore && (
              <Link to="datastore" getProps={isActiveClass('nav-link')}>
                <I18n>Datastore</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
            {showNotifications && (
              <Link to="notifications" getProps={isActiveClass('nav-link')}>
                <I18n>Notifications</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
            {showRobots && (
              <Link to="robots" getProps={isActiveClass('nav-link')}>
                <I18n>Robots</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
            {spaceAdmin && (
              <Link to="users" getProps={isActiveClass('nav-link')}>
                <I18n>Users</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
            {spaceAdmin && (
              <Link to="teams" getProps={isActiveClass('nav-link')}>
                <I18n>Teams</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
            {showSchedulers && (
              <Link to="schedulers" getProps={isActiveClass('nav-link')}>
                <I18n>Schedulers</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
            {spaceAdmin && (
              <Link to="translations" getProps={isActiveClass('nav-link')}>
                <I18n>Translations</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
          </li>
        </ul>
      )}
    </div>
    {spaceAdmin && (
      <div className="sidebar-group sidebar-group--settings">
        <ul className="nav flex-column settings-group">
          <li>
            <a
              href={`${bundle.spaceLocation()}/app`}
              target="_blank"
              className="nav-link nav-link--admin"
            >
              <I18n>Kinetic Request Admin</I18n>
              <span className="fa fa-fw fa-external-link" />
            </a>
          </li>
          {!hasSharedTaskEngine && (
            <li>
              <a
                href={`${bundle.spaceLocation()}/kinetic-task`}
                target="_blank"
                className="nav-link nav-link--admin"
              >
                <I18n>Kinetic Task Admin</I18n>
                <span className="fa fa-fw fa-external-link" />
              </a>
            </li>
          )}
        </ul>
      </div>
    )}
  </div>
);

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.loading,
  forms: state.settingsDatastore.forms,
  spaceAdmin: state.app.profile.spaceAdmin,
  pathname: state.router.location.pathname,
  hasSharedTaskEngine: selectHasSharedTaskEngine(state),
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(state.app.profile),
  isSchedulerManager: selectHasRoleSchedulerManager(state.app.profile),
});

export const Sidebar = compose(
  connect(
    mapStateToProps,
    null,
    null,
    { context },
  ),
  withProps(props => ({
    showDatastore: props.spaceAdmin || !props.forms.isEmpty(),
    showNotifications: !!props.forms.find(
      form => form.slug === NOTIFICATIONS_FORM_SLUG,
    ),
    showRobots: !!props.forms.find(
      form => form.slug === ROBOT_DEFINITIONS_FORM_SLUG,
    ),
    showSchedulers: props.isSchedulerAdmin || props.isSchedulerManager,
  })),
)(SidebarComponent);
