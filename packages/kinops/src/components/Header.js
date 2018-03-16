import React, { Fragment } from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Navbar,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { KappLink } from 'common';
import { bundle } from 'react-kinetic-core';
import { getAttributeValue } from 'common/utils';
import { AlertsContainer } from './AlertsContainer';
import { ProfileContainer } from './ProfileContainer';

export const dropdownTitleName = currentKapp =>
  currentKapp ? currentKapp.name : 'Home';

const BuildKappLink = ({ kapp, nameOverride = kapp.name }) => (
  <Link className="dropdown-item" to={`/kapps/${kapp.slug}`}>
    <span
      className={`fa fa-fw' ${getAttributeValue(kapp, 'Icon') || 'fa-book'}`}
    />
    {nameOverride}
  </Link>
);

export const Header = ({
  hasSidebar,
  toggleSidebarOpen,
  isGuest,
  hasAccessToManagement,
  hasAccessToSupport,
  currentKapp,
  adminKapp,
  predefinedKapps,
  additionalKapps,
}) => (
  <Navbar color="faded" light fixed="top">
    <Nav className="nav-header">
      {hasSidebar && (
        <NavItem id="header-sidebar-toggle">
          <NavLink
            className="drawer-button"
            role="button"
            tabIndex="0"
            onClick={toggleSidebarOpen}
          >
            <i className="fa fa-fw fa-bars" />
          </NavLink>
        </NavItem>
      )}
      {!isGuest && (
        <Fragment>
          <NavItem>
            <KappLink className="nav-link" to="/">
              {dropdownTitleName(currentKapp)}
            </KappLink>
          </NavItem>
          <UncontrolledDropdown id="header-kapp-dropdown">
            <DropdownToggle nav role="button">
              <i className="fa fa-fw fa-caret-down" />
            </DropdownToggle>
            <DropdownMenu>
              {currentKapp && (
                <Link className="dropdown-item" to="/">
                  <span className="fa fa-fw fa-home" />Home
                </Link>
              )}
              {currentKapp && <DropdownItem divider />}
              {predefinedKapps.map(thisKapp => (
                <BuildKappLink kapp={thisKapp} key={thisKapp.slug} />
              ))}
              {additionalKapps.map(thisKapp => (
                <BuildKappLink kapp={thisKapp} key={thisKapp.slug} />
              ))}
              {(hasAccessToManagement || hasAccessToSupport) && (
                <DropdownItem divider />
              )}
              {hasAccessToManagement && (
                <BuildKappLink kapp={adminKapp} nameOverride="Admin Console" />
              )}
              {hasAccessToSupport && (
                <DropdownItem
                  tag="a"
                  href={`${bundle.kappLocation(
                    adminKapp.slug,
                  )}/submission-support`}
                >
                  <span className="fa fa-fw fa-clipboard" />Submission Support
                </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
          <AlertsContainer />
          <ProfileContainer />
        </Fragment>
      )}
    </Nav>
  </Navbar>
);
