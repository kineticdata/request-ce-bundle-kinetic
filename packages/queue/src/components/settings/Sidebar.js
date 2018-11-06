import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

export const SidebarComponent = ({ loading, spaceAdmin }) => (
  <div className="sidebar space-sidebar">
    <Link to="/kapps/queue" className="nav-return">
      <span className="fa fa-fw fa-chevron-left" />
      Return to Queue
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
                General
                <span className="fa fa-fw fa-angle-right" />
              </NavLink>
            )}
            <NavLink
              to="/kapps/queue/settings/forms"
              className="nav-link"
              activeClassName="active"
            >
              Forms
              <span className="fa fa-fw fa-angle-right" />
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  </div>
);

export const mapStateToProps = state => ({
  loading: state.queue.queueSettings.loading,
  forms: state.queue.forms.data,
  spaceAdmin: state.app.profile.spaceAdmin,
  pathname: state.router.location.pathname,
});

export const Sidebar = compose(connect(mapStateToProps))(SidebarComponent);
