import React from 'react';
import { connect } from '../redux/store';
import { compose, withHandlers, withState } from 'recompose';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  selectHasRoleSchedulerAgent,
  Utils,
} from 'common';
import { Link } from '@reach/router';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Nav,
  NavItem,
} from 'reactstrap';
import { I18n } from '@kineticdata/react';

import { isActiveClass } from '../utils';

export const SidebarComponent = ({
  hasSettingsAccess,
  techBars,
  openDropdown,
  toggleDropdown,
  hasTechBarDisplayRole,
}) => (
  <div className="sidebar sidebar--tech-bar">
    <div className="sidebar-group--content-wrapper">
      <div className="sidebar-group">
        <Nav vertical>
          <NavItem>
            <Link
              to={`past`}
              getProps={isActiveClass('nav-link')}
              className="nav-link"
            >
              <div>
                <div>
                  <I18n>Past Appointments</I18n>
                </div>
              </div>
            </Link>
          </NavItem>
        </Nav>
      </div>
      <div className="sidebar-group sidebar-group--tech-bars">
        <h1>
          <I18n>Tech Bars</I18n>
          <Link to="tech-bars" className="view-all">
            <I18n>View All</I18n>
          </Link>
        </h1>
        <Nav vertical>
          {techBars.map(techBar => (
            <NavItem key={techBar.id}>
              <Link
                to={`appointment/${techBar.values['Id']}`}
                className="nav-link"
              >
                <div>
                  <div>
                    <I18n>{techBar.values['Name']}</I18n>
                  </div>
                </div>
              </Link>
              {hasTechBarDisplayRole(techBar.values['Name']) && (
                <Dropdown
                  toggle={toggleDropdown(techBar.id)}
                  isOpen={openDropdown === techBar.id}
                >
                  <DropdownToggle color="link" className="btn-sm">
                    <span className="fa fa-ellipsis-v fa-lg" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <Link
                      to={`display/${techBar.values['Id']}/checkin`}
                      onClick={toggleDropdown(techBar.id)}
                      className="dropdown-item"
                      target="_blank"
                    >
                      <span className="fa fa-fw fa-external-link mr-2" />
                      <span>
                        <I18n>Check In</I18n>
                      </span>
                    </Link>
                    <Link
                      to={`display/${techBar.values['Id']}/feedback`}
                      onClick={toggleDropdown(techBar.id)}
                      className="dropdown-item"
                      target="_blank"
                    >
                      <span className="fa fa-external-link fa-fw mr-2" />
                      <span>
                        <I18n>Feedback</I18n>
                      </span>
                    </Link>
                    <Link
                      to={`display/${techBar.values['Id']}/checkin?crosslink`}
                      onClick={toggleDropdown(techBar.id)}
                      className="dropdown-item"
                      target="_blank"
                    >
                      <span className="fa fa-external-link fa-fw mr-2" />
                      <span>
                        <I18n>Check In</I18n> / <I18n>Feedback</I18n>
                      </span>
                    </Link>
                    <Link
                      to={`display/${techBar.values['Id']}/overhead`}
                      onClick={toggleDropdown(techBar.id)}
                      className="dropdown-item"
                      target="_blank"
                    >
                      <span className="fa fa-external-link fa-fw mr-2" />
                      <span>
                        <I18n>Overhead</I18n>
                      </span>
                    </Link>
                  </DropdownMenu>
                </Dropdown>
              )}
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
    {hasSettingsAccess && (
      <div className="sidebar-group sidebar-group--settings">
        <ul className="nav flex-column settings-group">
          <li>
            <Link to="settings/general" className="nav-link">
              <I18n>Settings</I18n>
              <span className="fa fa-fw fa-angle-right" />
            </Link>
          </li>
        </ul>
      </div>
    )}
  </div>
);

export const mapStateToProps = state => ({
  techBars: state.techBarApp.schedulers.filter(
    s => s.values['Status'] === 'Active',
  ),
  hasSettingsAccess:
    selectHasRoleSchedulerManager(state.app.profile) ||
    selectHasRoleSchedulerAdmin(state.app.profile) ||
    selectHasRoleSchedulerAgent(state.app.profile),
  profile: state.app.profile,
});

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? false : dropdownSlug);

const hasTechBarDisplayRole = ({ profile }) => techBarName =>
  Utils.isMemberOf(profile, `Role::Tech Bar Display::${techBarName}`);

export const Sidebar = compose(
  connect(mapStateToProps),
  withState('openDropdown', 'setOpenDropdown', false),
  withHandlers({ toggleDropdown, hasTechBarDisplayRole }),
)(SidebarComponent);
