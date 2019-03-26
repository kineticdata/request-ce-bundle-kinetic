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
import { I18n } from '../I18nProvider';

export const dropdownTitleName = currentKapp => (
  <I18n>{currentKapp ? currentKapp.name : 'Home'}</I18n>
);

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
    <I18n>{nameOverride}</I18n>
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
  <Navbar color="faded" light>
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
        {!isGuest && (
          <Dropdown
            id="header-kapp-dropdown"
            isOpen={kappDropdownOpen}
            toggle={kappDropdownToggle}
          >
            <DropdownToggle nav role="button">
              <span>{dropdownTitleName(currentKapp)}</span>{' '}
              <i className="fa fa-caret-down" />
            </DropdownToggle>
            <DropdownMenu>
              <Link
                className="dropdown-item"
                to="/"
                onClick={kappDropdownToggle}
              >
                <span className="fa fa-fw fa-home" />
                <I18n>Home</I18n>
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
      </NavItem>
      <div className="nav-item-right">
        {!isGuest && <AlertsContainer />}
        <ProfileContainer />
      </div>
    </Nav>
  </Navbar>
);
