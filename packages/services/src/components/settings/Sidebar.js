import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { KappNavLink as NavLink, selectCurrentKapp } from 'common';

export const SidebarComponent = ({
  settingsBackPath,
  loading,
  spaceAdmin,
  kapp,
}) => (
  <div className="sidebar space-sidebar">
    <Link to={settingsBackPath} className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      {`Return to ${kapp.name}`}
    </Link>
    <div className="sidebar-group--content-wrapper">
      {!loading && (
        <ul className="nav flex-column sidebar-group">
          <li className="nav-item">
            {spaceAdmin && (
              <NavLink
                to="/settings/general"
                className="nav-link"
                activeClassName="active"
              >
                General
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            <NavLink
              to="/settings/forms"
              className="nav-link"
              activeClassName="active"
            >
              Forms
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
            {spaceAdmin && (
              <NavLink
                to="/settings/categories"
                className="nav-link"
                activeClassName="active"
              >
                Categories
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
          </li>
        </ul>
      )}
    </div>
  </div>
);

export const mapStateToProps = state => ({
  loading: state.services.servicesSettings.loading,
  forms: state.services.forms.data,
  spaceAdmin: state.app.profile.spaceAdmin,
  pathname: state.router.location.pathname,
  kapp: selectCurrentKapp(state),
});

export const Sidebar = compose(connect(mapStateToProps))(SidebarComponent);
