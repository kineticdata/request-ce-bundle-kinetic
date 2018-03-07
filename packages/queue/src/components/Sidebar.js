import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
//import chevronRightIcon from 'font-awesome-svg-png/black/svg/angle-right.svg';

const formatCount = count => (count >= 1000 ? '999+' : `${count}`);

export const Sidebar = ({
  documentationUrl,
  supportUrl,
  counts,
  handleOpenNewItemMenu,
  handleNewPersonalFilter,
  myFilters,
  hasTeammates,
  hasTeams,
  hasForms,
}) => (
  <div className="sidebar">
    {hasForms && (
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleOpenNewItemMenu}
      >
        Create New Task
      </button>
    )}
    <h6>Default Filters</h6>
    <Nav vertical className="filter-nav">
      <NavItem>
        <NavLink
          to="/list/Mine"
          className="nav-link icon-wrapper"
          activeClassName="active"
        >
          <span className="icon">
            <span className="fa fa-fw fa-user" style={{ fontSize: '16px' }} />
          </span>
          Mine ({formatCount(counts.get('Mine', 0))})
        </NavLink>
      </NavItem>
      {hasTeammates && (
        <NavItem>
          <NavLink
            to="/list/Teammates"
            className="nav-link icon-wrapper"
            activeClassName="active"
          >
            <span className="icon">
              <span
                className="fa fa-fw fa-users"
                style={{ fontSize: '16px' }}
              />
            </span>
            Teammates ({formatCount(counts.get('Teammates', 0))})
          </NavLink>
        </NavItem>
      )}
      {hasTeams && (
        <NavItem>
          <NavLink
            to="/list/Unassigned"
            className="nav-link icon-wrapper"
            activeClassName="active"
          >
            <span className="icon">
              <span
                className="fa fa-fw fa-inbox"
                style={{ fontSize: '16px' }}
              />
            </span>
            Unassigned ({formatCount(counts.get('Unassigned', 0))})
          </NavLink>
        </NavItem>
      )}
    </Nav>
    <h6 className="d-flex justify-content-between icon-wrapper">
      My Filters
      <button className="btn btn-sidebar" onClick={handleNewPersonalFilter}>
        <span className="icon">
          <span className="fa fa-plus" style={{ color: '#7e8083' }} />
        </span>
      </button>
    </h6>
    <Nav vertical className="filter-nav">
      {myFilters.map(filter => (
        <NavItem key={filter.name}>
          <NavLink
            to={`/custom/${filter.name}`}
            className="nav-link icon-wrapper"
            activeClassName="active"
          >
            <span className="icon">
              <span
                className="fa fa-fw fa-star-o"
                style={{ fontSize: '16px' }}
              />
            </span>
            {`${filter.name}`}
          </NavLink>
        </NavItem>
      ))}
      {myFilters.size === 0 && (
        <NavItem>
          <i className="nav-link icon-wrapper">
            <span className="icon">
              <span
                className="fa fa-filled-star"
                style={{ fontSize: '16px' }}
              />
            </span>
            None Configured
          </i>
        </NavItem>
      )}
    </Nav>
    {/*
      ** TODO REMOVING UNTIL FURTHER DEFINED **
      <Nav vertical className="bottom-nav">
        <NavItem>
          <a
            href={documentationUrl}
            className="nav-link icon-wrapper d-flex justify-content-between"
            target="_blank"
          >
            <span>Documentation</span>
            <SVGInline svg={chevronRightIcon} className="icon" />
          </a>
        </NavItem>
        <NavItem>
          <a
            href={supportUrl}
            className="nav-link icon-wrapper d-flex justify-content-between"
            target="_blank"
          >
            <span>Need Help?</span>
            <SVGInline svg={chevronRightIcon} className="icon" />
          </a>
        </NavItem>
        <NavItem>
          <NavLink
            to="/settings"
            className="nav-link icon-wrapper d-flex justify-content-between"
            activeClassName="active"
          >
            <span>Settings</span>
            <SVGInline svg={chevronRightIcon} className="icon" />
          </NavLink>
        </NavItem>
      </Nav>
    */}
  </div>
);
