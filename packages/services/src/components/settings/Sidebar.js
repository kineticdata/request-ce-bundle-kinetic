import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { KappNavLink as NavLink, selectCurrentKapp } from 'common';
import { I18n } from '../../../../app/src/I18nProvider';

export const SidebarComponent = ({
  settingsBackPath,
  loading,
  spaceAdmin,
  kapp,
}) => (
  <div className="sidebar space-sidebar">
    <Link to={settingsBackPath} className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      <I18n>Return to</I18n> <I18n>{kapp.name}</I18n>
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
                <I18n>General</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            <NavLink
              to="/settings/forms"
              className="nav-link"
              activeClassName="active"
            >
              <I18n>Forms</I18n>
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
            {spaceAdmin && (
              <NavLink
                to="/settings/categories"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>Categories</I18n>
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
