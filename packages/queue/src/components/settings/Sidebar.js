import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { I18n } from '../../../../app/src/I18nProvider';
import { context } from '../../redux/store';

export const SidebarComponent = ({ loading, spaceAdmin }) => (
  <div className="sidebar space-sidebar">
    <Link to="/kapps/queue" className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      <I18n>Return to Queue</I18n>
    </Link>
    <div className="sidebar-group--content-wrapper">
      {!loading && (
        <ul className="nav flex-column sidebar-group">
          <li className="nav-item">
            {spaceAdmin && (
              <NavLink
                to="/kapps/queue/settings/general"
                className="nav-link"
                activeClassName="active"
              >
                <I18n>General</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            <NavLink
              to="/kapps/queue/settings/forms"
              className="nav-link"
              activeClassName="active"
            >
              <I18n>Forms</I18n>
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  </div>
);

export const mapStateToProps = state => ({
  loading: state.queueSettings.loading,
  forms: state.forms.data,
  spaceAdmin: state.app.profile.spaceAdmin,
  pathname: state.router.location.pathname,
});

export const Sidebar = compose(
  connect(
    mapStateToProps,
    null,
    null,
    { context },
  ),
)(SidebarComponent);
