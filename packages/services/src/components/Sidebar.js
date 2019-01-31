import React from 'react';
import { KappLink as Link, KappNavLink as NavLink } from 'common';
import { Nav, NavItem } from 'reactstrap';
import { I18n } from '../../../app/src/I18nProvider';

const formatCount = count =>
  !count ? '' : count >= 1000 ? '(999+)' : `(${count})`;

const itemLink = (mode, slug) =>
  `${mode === 'Categories' ? '/categories' : '/forms'}/${slug}`;

export const Sidebar = props => (
  <div className="sidebar services-sidebar">
    <div className="sidebar-group--content-wrapper">
      <div className="sidebar-group sidebar-my-requests">
        <h1>
          <I18n>My Requests</I18n>
        </h1>
        <Nav vertical>
          <NavItem>
            <NavLink
              to="/requests"
              activeClassName="active"
              className="nav-link"
              exact
            >
              <span className="fa fa-fw fa-star" />
              <I18n>All</I18n>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/requests/Open"
              activeClassName="active"
              className="nav-link"
              exact
            >
              <span className="fa fa-fw fa-book" />
              <I18n>Open</I18n> {formatCount(props.counts.Submitted)}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/requests/Closed"
              activeClassName="active"
              className="nav-link"
              exact
            >
              <span className="fa fa-fw fa-times" />
              <I18n>Closed</I18n> {formatCount(props.counts.Closed)}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/requests/Draft"
              activeClassName="active"
              className="nav-link"
              exact
            >
              <span className="fa fa-fw fa-inbox" />
              <I18n>Draft</I18n> {formatCount(props.counts.Draft)}
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <div className="sidebar-group sidebar-home-page-item">
        <h1>
          <I18n>{props.homePageMode}</I18n>
          <Link
            to={props.homePageMode === 'Categories' ? '/categories' : '/forms'}
          >
            <I18n>View All</I18n>
          </Link>
        </h1>
        <Nav vertical>
          {props.homePageItems.map(item => (
            <NavItem key={item.slug}>
              <NavLink
                to={itemLink(props.homePageMode, item.slug)}
                className="nav-link"
                activeClassName="active"
                exact
              >
                <I18n>{item.name}</I18n>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
    <div className="sidebar-group sidebar-group--settings">
      <ul className="nav flex-column settings-group">
        <Link to="/settings/" onClick={props.openSettings} className="nav-link">
          <I18n>Settings</I18n>
          <span className="fa fa-fw fa-angle-right" />
        </Link>
      </ul>
    </div>
  </div>
);
