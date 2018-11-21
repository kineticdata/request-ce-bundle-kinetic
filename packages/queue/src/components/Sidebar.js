import React from 'react';
import { KappLink as Link, KappNavLink as NavLink } from 'common';
import { Nav, NavItem } from 'reactstrap';

const formatCount = count => (count >= 1000 ? '999+' : `${count}`);

export const Sidebar = ({
  counts,
  handleOpenNewItemMenu,
  handleNewPersonalFilter,
  myFilters,
  hasTeammates,
  hasTeams,
  hasForms,
}) => (
  <div className="sidebar sidebar-queue">
    <div className="sidebar-group--content-wrapper">
      {hasForms && (
        <div className="sidebar-group sidebar-new-task">
          <button
            type="button"
            className="btn btn-secondary btn-sidebar-action"
            onClick={handleOpenNewItemMenu}
          >
            New Task
          </button>
        </div>
      )}
      <div className="sidebar-group sidebar-default-filters">
        <h1>Default Filters</h1>
        <Nav vertical>
          <NavItem>
            <NavLink
              to="/list/Mine"
              className="nav-link"
              activeClassName="active"
            >
              <span className="fa fa-fw fa-user" />
              Mine ({formatCount(counts.get('Mine', 0))})
            </NavLink>
          </NavItem>
          {hasTeammates && (
            <NavItem>
              <NavLink
                to="/list/Teammates"
                className="nav-link"
                activeClassName="active"
              >
                <span className="fa fa-fw fa-users" />
                Teammates ({formatCount(counts.get('Teammates', 0))})
              </NavLink>
            </NavItem>
          )}
          {hasTeams && (
            <NavItem>
              <NavLink
                to="/list/Unassigned"
                className="nav-link"
                activeClassName="active"
              >
                <span className="fa fa-fw fa-inbox" />
                Unassigned ({formatCount(counts.get('Unassigned', 0))})
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            <NavLink
              to="/list/Created By Me"
              className="nav-link"
              activeClassName="active"
            >
              <span className="fa fa-fw fa-user-circle-o" />
              Created By Me ({formatCount(counts.get('Created By Me', 0))})
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <div className="sidebar-group sidebar-my-filters">
        <h1>
          My Filters
          <button className="btn btn-icon" onClick={handleNewPersonalFilter}>
            <span className="fa fa-plus" />
          </button>
        </h1>
        <Nav vertical>
          {myFilters.map(filter => (
            <NavItem key={filter.name}>
              <NavLink
                to={`/custom/${encodeURIComponent(filter.name)}`}
                className="nav-link"
                activeClassName="active"
              >
                <span className="fa fa-fw fa-star-o" />

                {`${filter.name}`}
              </NavLink>
            </NavItem>
          ))}
          {myFilters.size === 0 && (
            <NavItem>
              <i className="nav-link">
                <span className="fa fa-filled-star" />
                None Configured
              </i>
            </NavItem>
          )}
        </Nav>
      </div>
    </div>
    <div className="sidebar-group sidebar-group--settings">
      <ul className="nav flex-column settings-group">
        <Link to="/settings/" className="nav-link">
          Settings
          <span className="fa fa-fw fa-angle-right" />
        </Link>
      </ul>
    </div>
  </div>
);
