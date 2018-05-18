import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { NOTIFICATIONS_FORM_SLUG } from '../../redux/modules/settingsNotifications';

export const SidebarComponent = ({
  settingsBackPath,
  loading,
  spaceAdmin,
  showDatastore,
  showNotifications,
}) => (
  <div className="sidebar space-sidebar">
    <Link to={settingsBackPath} className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      Return to Home
    </Link>
    {!loading && (
      <ul className="nav flex-column settings-group">
        <li className="nav-item">
          <NavLink
            to="/settings/profile"
            className="nav-link"
            activeClassName="active"
          >
            Profile
            <span className="fa fa-fw fa-angle-right" />
          </NavLink>
          {spaceAdmin && (
            <NavLink
              to="/settings/space"
              className="nav-link"
              activeClassName="active"
            >
              General
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
          )}
          {showDatastore && (
            <NavLink
              to="/settings/datastore"
              className="nav-link"
              activeClassName="active"
            >
              Datastore
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
          )}
          {showNotifications && (
            <NavLink
              to="/settings/notifications"
              className="nav-link"
              activeClassName="active"
            >
              Notifications
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
          )}
          {spaceAdmin && (
            <NavLink
              to="/settings/users"
              className="nav-link"
              activeClassName="active"
            >
              Users
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
          )}
        </li>
      </ul>
    )}
  </div>
);

export const mapStateToProps = state => ({
  loading: state.space.settingsDatastore.loading,
  forms: state.space.settingsDatastore.forms,
  spaceAdmin: state.app.profile.spaceAdmin,
  pathname: state.router.location.pathname,
});

export const Sidebar = compose(
  connect(mapStateToProps),
  withProps(props => ({
    showDatastore: props.spaceAdmin || !props.forms.isEmpty(),
    showNotifications: !!props.forms.find(
      form => form.slug === NOTIFICATIONS_FORM_SLUG,
    ),
  })),
)(SidebarComponent);
