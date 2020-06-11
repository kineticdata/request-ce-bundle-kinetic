import React from 'react';
import { Link } from '@reach/router';

import { Nav, NavItem } from 'reactstrap';
import { I18n } from '@kineticdata/react';
import { isActiveClass } from '../utils';

const formatCount = count =>
  !count ? '' : count >= 1000 ? '(999+)' : `(${count})`;

const itemLink = (mode, slug) =>
  `${mode === 'Categories' ? 'categories' : 'forms'}/${slug}`;

export const Sidebar = props => (
  <div className="sidebar services-sidebar">
    <div className="sidebar-group--content-wrapper">
      <div className="sidebar-group sidebar-my-requests">
        <h1>
          <I18n>My Requests</I18n>
        </h1>
        <Nav vertical>
          <NavItem>
            <Link to="requests" getProps={isActiveClass('nav-link')}>
              <span className="fa fa-fw fa-star" />
              <I18n>All</I18n>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="requests/Open" getProps={isActiveClass('nav-link')}>
              <span className="fa fa-fw fa-book" />
              <I18n>Open</I18n> {formatCount(props.counts.Submitted)}
            </Link>
          </NavItem>
          <NavItem>
            <Link to="requests/Closed" getProps={isActiveClass('nav-link')}>
              <span className="fa fa-fw fa-times" />
              <I18n>Closed</I18n> {formatCount(props.counts.Closed)}
            </Link>
          </NavItem>
          <NavItem>
            <Link to="requests/Draft" getProps={isActiveClass('nav-link')}>
              <span className="fa fa-fw fa-inbox" />
              <I18n>Draft</I18n> {formatCount(props.counts.Draft)}
            </Link>
          </NavItem>
        </Nav>
      </div>
      <div className="sidebar-group sidebar-home-page-item">
        <h1>
          <I18n>{props.homePageMode}</I18n>
          <Link
            to={props.homePageMode === 'Categories' ? 'categories' : 'forms'}
          >
            <I18n>View All</I18n>
          </Link>
        </h1>
        <Nav vertical>
          {props.homePageItems.map(item => (
            <NavItem key={item.slug}>
              <Link
                to={itemLink(props.homePageMode, item.slug)}
                getProps={isActiveClass('nav-link')}
              >
                <I18n>{item.name}</I18n>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
    <div className="sidebar-group sidebar-group--settings">
      <div className="nav flex-column settings-group">
        <Link to="settings/" onClick={props.openSettings} className="nav-link">
          <I18n>Settings</I18n>
          <span className="fa fa-fw fa-angle-right" />
        </Link>
      </div>
    </div>
  </div>
);
