import React from 'react';
import { Link } from '@reach/router';
import { Nav, NavItem } from 'reactstrap';
import { I18n } from '@kineticdata/react';
import { isActiveClass } from '../utils';

const formatCount = count =>
  count || count === 0 ? (count >= 1000 ? '(999+)' : `(${count})`) : '';

export const Sidebar = ({
  counts,
  handleOpenNewItemMenu,
  myFilters,
  teamFilters,
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
            <I18n>New Task</I18n>
          </button>
        </div>
      )}
      <div className="sidebar-group sidebar-default-filters">
        <h1>Default Filters</h1>
        <Nav vertical>
          <NavItem>
            <Link to="list/Mine" getProps={isActiveClass('nav-link')}>
              <span className="fa fa-fw fa-user" role="presentation" />
              <I18n>Mine</I18n> {formatCount(counts.get('Mine', 0))}
            </Link>
          </NavItem>
          {hasTeams && (
            <NavItem>
              <Link to="list/Unassigned" getProps={isActiveClass('nav-link')}>
                <span className="fa fa-fw fa-inbox" role="presentation" />
                <I18n>Unassigned</I18n>{' '}
                {formatCount(counts.get('Unassigned', 0))}
              </Link>
            </NavItem>
          )}
          <NavItem>
            <Link to="list/Created By Me" getProps={isActiveClass('nav-link')}>
              <span className="fa fa-fw fa-user-circle-o" role="presentation" />
              <I18n>Created By Me</I18n>{' '}
              {formatCount(counts.get('Created By Me', 0))}
            </Link>
          </NavItem>
        </Nav>
      </div>
      {hasTeams && (
        <div className="sidebar-group sidebar-team-filters">
          <h1>
            <I18n>Team Filters</I18n>
          </h1>
          <Nav vertical>
            {teamFilters.map(filter => (
              <NavItem key={filter.name}>
                <Link
                  to={`team/${encodeURIComponent(filter.name)}`}
                  getProps={isActiveClass('nav-link')}
                >
                  <span
                    className={`fa fa-fw fa-${filter.icon}`}
                    role="presentation"
                  />
                  <I18n>{`${filter.name}`}</I18n>
                </Link>
              </NavItem>
            ))}
          </Nav>
        </div>
      )}
      <div className="sidebar-group sidebar-my-filters">
        <h1>
          <I18n>My Filters</I18n>
        </h1>
        <Nav vertical>
          {myFilters.map(filter => (
            <NavItem key={filter.name}>
              <Link
                to={`custom/${encodeURIComponent(filter.name)}`}
                getProps={isActiveClass('nav-link')}
              >
                <span className="fa fa-fw fa-star-o" role="presentation" />

                {`${filter.name}`}
              </Link>
            </NavItem>
          ))}
          {myFilters.size === 0 && (
            <NavItem>
              <i className="nav-link">
                <span className="fa fa-filled-star" role="presentation" />
                <I18n>None Configured</I18n>
              </i>
            </NavItem>
          )}
        </Nav>
      </div>
    </div>
    <div className="sidebar-group sidebar-group--settings">
      <ul className="nav flex-column settings-group">
        <li>
          <Link to="settings" className="nav-link">
            <I18n>Settings</I18n>
            <span className="fa fa-fw fa-angle-right" role="presentation" />
          </Link>
        </li>
      </ul>
    </div>
  </div>
);
