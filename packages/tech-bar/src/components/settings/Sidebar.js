import React from 'react';
import { connect } from '../../redux/store';
import { compose } from 'recompose';
import { Link } from '@reach/router';
import {
  selectCurrentKapp,
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from 'common';
import { isActiveClass } from '../../utils';
import { I18n } from '@kineticdata/react';

export const SidebarComponent = ({
  settingsBackPath,
  loading,
  spaceAdmin,
  kapp,
  hasManagerAccess,
}) => (
  <div className="sidebar space-sidebar">
    <Link to={settingsBackPath} className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      <I18n>{`Return to ${kapp.name}`}</I18n>
    </Link>
    <div className="sidebar-group--content-wrapper">
      {!loading && (
        <ul className="nav flex-column sidebar-group">
          <li className="nav-item">
            <Link
              to="metrics"
              className="nav-link"
              getProps={isActiveClass('nav-link')}
            >
              <I18n>Metrics</I18n>
              <span className="fa fa-fw fa-angle-right" />
            </Link>
            <Link
              to="general"
              className="nav-link"
              getProps={isActiveClass('nav-link')}
            >
              <I18n>Tech Bars</I18n>
              <span className="fa fa-fw fa-angle-right" />
            </Link>
            {hasManagerAccess && (
              <Link
                to="schedulers"
                className="nav-link"
                getProps={isActiveClass('nav-link')}
              >
                <I18n>Schedulers</I18n>
                <span className="fa fa-fw fa-angle-right" />
              </Link>
            )}
          </li>
        </ul>
      )}
    </div>
  </div>
);

export const mapStateToProps = state => ({
  loading: false,
  pathname: state.router.location.pathname,
  kapp: selectCurrentKapp(state),
  hasManagerAccess:
    selectHasRoleSchedulerManager(state) || selectHasRoleSchedulerAdmin(state),
});

export const Sidebar = compose(connect(mapStateToProps))(SidebarComponent);
