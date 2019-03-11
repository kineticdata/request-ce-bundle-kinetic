import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { bundle } from 'react-kinetic-lib';
import { selectHasSharedTaskEngine } from '../../redux/modules/spaceApp';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from 'common';
import { NOTIFICATIONS_FORM_SLUG } from '../../redux/modules/settingsNotifications';
import { ROBOT_DEFINITIONS_FORM_SLUG } from '../../redux/modules/settingsRobots';
import { I18n } from '../../../../app/src/I18nProvider';

export const SidebarComponent = ({
  settingsBackPath,
  hasSharedTaskEngine,
  loading,
  spaceAdmin,
  showDatastore,
  showNotifications,
  showRobots,
  showSchedulers,
}) => (
  <div className="sidebar space-sidebar">
    <Link to={settingsBackPath} className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      <I18n>Return to Home</I18n>
    </Link>
    <div className="sidebar-group--content-wrapper">
      {!loading && (
        <ul className="nav flex-column sidebar-group">
          <li className="nav-item">
            <NavLink
              to="/settings/profile"
              className="nav-link"
              activeClassName="active"
            >
              <I18n>Profile</I18n>
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
            {spaceAdmin && (
              <NavLink
                to="/settings/system"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>System</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {showDatastore && (
              <NavLink
                to="/settings/datastore"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>Datastore</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {showNotifications && (
              <NavLink
                to="/settings/notifications"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>Notifications</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {showRobots && (
              <NavLink
                to="/settings/robots"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>Robots</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {spaceAdmin && (
              <NavLink
                to="/settings/users"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>Users</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {spaceAdmin && (
              <NavLink
                to="/settings/teams"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>Teams</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {showSchedulers && (
              <NavLink
                to="/settings/schedulers"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>Schedulers</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            {spaceAdmin && (
              <NavLink
                to="/settings/translations"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>Translations</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
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
  loading: state.space.settingsDatastore.loading,
  forms: state.space.settingsDatastore.forms,
  spaceAdmin: state.app.profile.spaceAdmin,
  pathname: state.router.location.pathname,
  hasSharedTaskEngine: selectHasSharedTaskEngine(state),
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(state),
  isSchedulerManager: selectHasRoleSchedulerManager(state),
});

export const Sidebar = compose(
  connect(mapStateToProps),
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
