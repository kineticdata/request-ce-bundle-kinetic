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
import { connect } from 'react-redux';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import { Utils, selectVisibleKapps } from 'common';
import { AlertsDropdown } from './AlertsDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { I18n } from '@kineticdata/react';
import * as selectors from '../../redux/selectors';

const BuildKappLink = ({ kapp, onClick, nameOverride = kapp.name }) => (
  <Link
    className="dropdown-item"
    to={`/kapps/${kapp.slug}`}
    onClick={onClick}
    role="menuitem"
  >
    <span
      className={`fa fa-fw' ${Utils.getAttributeValue(kapp, 'Icon') ||
        'fa-book'}`}
    />
    <I18n>{nameOverride}</I18n>
  </Link>
);

export const HeaderComponent = ({
  toggleSidebarOpen,
  authenticated,
  authRoute,
  isGuest,
  hasAccessToManagement,
  hasAccessToSupport,
  menuLabel,
  visibleKapps,
  kappDropdownOpen,
  kappDropdownToggle,
}) => (
  <Navbar color="faded" light>
    <div className="nav nav-header">
      <Nav>
        {typeof toggleSidebarOpen === 'function' &&
          !isGuest && (
            <NavItem id="header-sidebar-toggle">
              <NavLink
                className="drawer-button"
                role="button"
                tabIndex="0"
                onClick={toggleSidebarOpen}
                id="toggle-sidebar"
                aria-label="Toggle Sidebar"
              >
                {/* <span className="sr-only">Toggle Sidebar</span> */}
                <i className="fa fa-fw fa-bars" />
              </NavLink>
            </NavItem>
          )}
        <NavItem>
          {!isGuest ? (
            <Dropdown
              id="header-kapp-dropdown"
              isOpen={kappDropdownOpen}
              toggle={kappDropdownToggle}
            >
              <DropdownToggle nav role="button">
                <span>{menuLabel}</span> <i className="fa fa-caret-down" />
              </DropdownToggle>
              <DropdownMenu>
                {visibleKapps.map(thisKapp => (
                  <BuildKappLink
                    kapp={thisKapp}
                    key={thisKapp.slug}
                    onClick={kappDropdownToggle}
                  />
                ))}
                <DropdownItem divider />
                <Link
                  className="dropdown-item"
                  to="/discussions"
                  onClick={kappDropdownToggle}
                  role="menuitem"
                >
                  <span className="fa fa-fw fa-comments" />
                  <I18n>Discussions</I18n>
                </Link>
                <Link
                  className="dropdown-item"
                  to="/teams"
                  onClick={kappDropdownToggle}
                  role="menuitem"
                >
                  <span className="fa fa-fw fa-users" />
                  <I18n>Teams</I18n>
                </Link>
                <Link
                  className="dropdown-item"
                  to="/settings"
                  onClick={kappDropdownToggle}
                  role="menuitem"
                >
                  <span className="fa fa-fw fa-cog" />
                  <I18n>Settings</I18n>
                </Link>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div id="header-kapp-dropdown">
              <span className="nav-link nav-link--static">{menuLabel}</span>
            </div>
          )}
        </NavItem>
      </Nav>
      <div className="nav-item-right">
        {!isGuest && <AlertsDropdown />}
        {authenticated ? (
          <ProfileDropdown />
        ) : (
          <NavItem>
            <Link className="nav-link" to={authRoute} title="Sign In">
              <i className="fa fa-fw fa-sign-in" />
            </Link>
          </NavItem>
        )}
      </div>
    </div>
  </Navbar>
);

export const mapStateToProps = state => ({
  loading: state.app.loading,
  kapp: state.app.kapp,
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
  pathname: state.router.location.pathname,
  // Selectors
  visibleKapps: selectVisibleKapps(state),
  hasAccessToManagement: selectors.selectHasAccessToManagement(state),
  hasAccessToSupport: selectors.selectHasAccessToSupport(state),
  isGuest: selectors.selectIsGuest(state),
});

export const Header = compose(
  connect(mapStateToProps),
  withState('kappDropdownOpen', 'setKappDropdownOpen', false),
  withProps(({ kapp, pathname, label }) => ({
    menuLabel:
      label ||
      (kapp
        ? kapp.name || kapp.slug
        : pathname.replace(/^\/([^/]*).*/, '$1').replace('-', ' ') || 'Home'),
  })),
  withHandlers({
    kappDropdownToggle: props => () => props.setKappDropdownOpen(open => !open),
  }),
)(HeaderComponent);
