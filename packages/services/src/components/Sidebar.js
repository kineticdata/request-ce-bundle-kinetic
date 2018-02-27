import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';

const formatCount = count =>
  !count ? '' : count >= 1000 ? '(999+)' : `(${count})`;

const itemLink = (mode, slug) =>
  `${mode === 'Categories' ? '/categories' : '/forms'}/${slug}`;

export const Sidebar = props => (
  <div>
    <h6>My Requests</h6>
    <Nav vertical>
      <NavItem>
        <NavLink
          to="/requests"
          activeClassName="active"
          className="nav-link"
          exact
        >
          <i className="fa fa-fw fa-star" /> All
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          to="/requests/Open"
          activeClassName="active"
          className="nav-link"
          exact
        >
          <i className="fa fa-fw fa-book" />
          Open {formatCount(props.counts.Submitted)}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          to="/requests/Closed"
          activeClassName="active"
          className="nav-link"
          exact
        >
          <i className="fa fa-fw fa-times" />
          Closed {formatCount(props.counts.Closed)}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          to="/requests/Draft"
          activeClassName="active"
          className="nav-link"
          exact
        >
          <i className="fa fa-fw fa-inbox" />
          Draft {formatCount(props.counts.Draft)}
        </NavLink>
      </NavItem>
    </Nav>
    <h6>
      {props.homePageMode}
      <Link to={props.homePageMode === 'Categories' ? '/categories' : '/forms'}>
        View All
      </Link>
    </h6>
    <Nav vertical>
      {props.homePageItems.map(item => (
        <NavItem key={item.slug}>
          <NavLink
            to={itemLink(props.homePageMode, item.slug)}
            className="nav-link"
            activeClassName="active"
            exact
          >
            {item.name}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  </div>
);
