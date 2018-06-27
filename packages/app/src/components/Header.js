import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Navbar,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { KappLink, Utils } from 'common';
import { AlertsContainer } from './AlertsContainer';
import { ProfileContainer } from './ProfileContainer';

export const dropdownTitleName = currentKapp =>
  currentKapp ? currentKapp.name : 'Home';

export const dropdownIcon = currentKapp =>
  currentKapp
    ? Utils.getAttributeValue(currentKapp, 'Icon') || 'fa-book'
    : 'fa-home';

const BuildKappLink = ({ kapp, onClick, nameOverride = kapp.name }) => (
  <Link className="dropdown-item" to={`/kapps/${kapp.slug}`} onClick={onClick}>
    <span
      className={`fa fa-fw' ${Utils.getAttributeValue(kapp, 'Icon') ||
        'fa-book'}`}
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
  kappDropdownOpen,
  kappDropdownToggle,
}) => (
  <Navbar color="faded" light fixed="top">
    <Nav className="nav-header">
      {hasSidebar &&
        !isGuest && (
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
      <NavItem>
        <KappLink className="nav-link" to="/">
          <span className={`fa fa-fw ${dropdownIcon(currentKapp)}`} />{' '}
          {dropdownTitleName(currentKapp)}
        </KappLink>
      </NavItem>
      <div className="nav-item-right">
        {!isGuest && (
          <Dropdown
            id="header-kapp-dropdown"
            isOpen={kappDropdownOpen}
            toggle={kappDropdownToggle}
          >
            <DropdownToggle nav role="button">
              <i className="fa fa-fw fa-th" />
            </DropdownToggle>
            <DropdownMenu>
              <Link
                className="dropdown-item"
                to="/"
                onClick={kappDropdownToggle}
              >
                <span className="fa fa-fw fa-home" />Home
              </Link>
              <DropdownItem divider />
              {predefinedKapps.map(thisKapp => (
                <BuildKappLink
                  kapp={thisKapp}
                  key={thisKapp.slug}
                  onClick={kappDropdownToggle}
                />
              ))}
              {additionalKapps.map(thisKapp => (
                <BuildKappLink
                  kapp={thisKapp}
                  key={thisKapp.slug}
                  onClick={kappDropdownToggle}
                />
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
        {!isGuest && <AlertsContainer />}
        <ProfileContainer />
      </div>
    </Nav>
  </Navbar>
);
