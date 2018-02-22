import React from 'react';
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
import classNames from 'classnames';
import { bundle } from 'react-kinetic-core';
import SVGInline from 'react-svg-inline';

import { getAttributeValue } from '../utils';
import { AlertsContainer } from './AlertsContainer';
import { ProfileContainer } from './ProfileContainer';
import hamburgerIcon from '../images/hamburger.svg';

export const dropdownTitleName = currentKapp =>
  currentKapp ? currentKapp.name : 'Home';

const BuildKappLink = ({ kapp, nameOverride = kapp.name }) => (
  <DropdownItem tag="a" href={bundle.kappLocation(kapp.slug)}>
    <span
      className={classNames(
        'fa fa-fw',
        getAttributeValue(kapp, 'Icon') || 'fa-book',
      )}
    />
    {nameOverride}
  </DropdownItem>
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
            className="drawer-button icon-wrapper"
            role="button"
            tabIndex="0"
            onClick={toggleSidebarOpen}
          >
            <SVGInline svg={hamburgerIcon} className="icon" />
          </NavLink>
        </NavItem>
      )}
      {!isGuest && (
        <UncontrolledDropdown id="header-kapp-dropdown">
          <DropdownToggle caret nav role="button">
            {dropdownTitleName(currentKapp)}
          </DropdownToggle>
          <DropdownMenu>
            {currentKapp && (
              <DropdownItem tag="a" href={bundle.spaceLocation()}>
                <span className="fa fa-fw fa-home" />Home
              </DropdownItem>
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
      )}
      {!isGuest && <AlertsContainer />}
      {!isGuest && <ProfileContainer />}
    </Nav>
  </Navbar>
);
