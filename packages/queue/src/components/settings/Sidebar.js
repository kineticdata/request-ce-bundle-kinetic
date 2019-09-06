import React from 'react';
import { Link } from '@reach/router';
import { compose } from 'recompose';
import { I18n } from '@kineticdata/react';
import { connect } from '../../redux/store';
import { isActiveClass } from '../../utils';

export const SidebarComponent = ({ loading, spaceAdmin }) => (
  <div className="sidebar">
    <Link to="/kapps/queue" className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      <I18n>Return to Queue</I18n>
    </Link>
    <div className="sidebar-group--content-wrapper">
      {!loading && (
        <ul className="nav flex-column sidebar-group">
          <li className="nav-item">
            {spaceAdmin && (
              <Link to="general" className="nav-link" getProps={isActiveClass}>
                <I18n>General</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
            <Link to="forms" className="nav-link" getProps={isActiveClass}>
              <I18n>Forms</I18n>
              <span className="fa fa-fw fa-angle-right" />
            </Link>
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

export const Sidebar = compose(connect(mapStateToProps))(SidebarComponent);
