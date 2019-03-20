import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import {
  KappLink as Link,
  KappNavLink as NavLink,
  Constants,
  Moment,
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  selectHasRoleSchedulerAgent,
  Utils,
} from 'common';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Nav,
  NavItem,
} from 'reactstrap';
import moment from 'moment';
import { DATE_FORMAT, TIME_FORMAT } from '../App';
import { I18n } from '../../../app/src/I18nProvider';

export const SidebarComponent = ({
  loadingUpcoming,
  upcomingErrors,
  upcomingAppointments,
  hasSettingsAccess,
  techBars,
  openDropdown,
  toggleDropdown,
  hasTechBarDisplayRole,
}) => (
  <div className="sidebar sidebar--tech-bar">
    <div className="sidebar-group--content-wrapper">
      <div className="sidebar-group">
        <h1>
          <I18n>Appointments</I18n>
        </h1>
        <Nav vertical>
          <NavItem>
            <NavLink
              to={`/`}
              activeClassName="active"
              className="nav-link"
              exact
            >
              <div>
                <div>
                  <I18n>Upcoming Appointments</I18n>
                </div>
              </div>
            </NavLink>
            <NavLink
              to={`/past`}
              activeClassName="active"
              className="nav-link"
              exact
            >
              <div>
                <div>
                  <I18n>Past Appointments</I18n>
                </div>
              </div>
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <div className="sidebar-group sidebar-group--tech-bars">
        <h1>
          <I18n>Tech Bars</I18n>
          <Link to="/tech-bars" className="view-all">
            <I18n>View All</I18n>
          </Link>
        </h1>
        <Nav vertical>
          {techBars.map(techBar => (
            <NavItem key={techBar.id}>
              <NavLink
                to={`/appointment/${techBar.values['Id']}`}
                activeClassName="active"
                className="nav-link"
                exact
              >
                <div>
                  <div>
                    <I18n>{techBar.values['Name']}</I18n>
                  </div>
                </div>
              </NavLink>
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
                      to={`/display/${techBar.values['Id']}/checkin`}
                      className="dropdown-item"
                      target="_blank"
                    >
                      <span className="fa fa-fw fa-external-link mr-2" />
                      <span>
                        <I18n>Check In</I18n>
                      </span>
                    </Link>
                    <Link
                      to={`/display/${techBar.values['Id']}/feedback`}
                      className="dropdown-item"
                      target="_blank"
                    >
                      <span className="fa fa-external-link fa-fw mr-2" />
                      <span>
                        <I18n>Feedback</I18n>
                      </span>
                    </Link>
                    <Link
                      to={`/display/${techBar.values['Id']}/checkin?crosslink`}
                      className="dropdown-item"
                      target="_blank"
                    >
                      <span className="fa fa-external-link fa-fw mr-2" />
                      <span>
                        <I18n>Check In</I18n> / <I18n>Feedback</I18n>
                      </span>
                    </Link>
                    <Link
                      to={`/display/${techBar.values['Id']}/overhead`}
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
          <Link to="/settings/general" className="nav-link">
            <I18n>Settings</I18n>
            <span className="fa fa-fw fa-angle-right" />
          </Link>
        </ul>
      </div>
    )}
  </div>
);

export const mapStateToProps = state => ({
  techBars: state.techBar.techBarApp.schedulers.filter(
    s => s.values['Status'] === 'Active',
  ),
  loadingUpcoming: state.techBar.appointments.upcoming.loading,
  upcomingErrors: state.techBar.appointments.upcoming.errors,
  upcomingAppointments: state.techBar.appointments.upcoming.data,
  hasSettingsAccess:
    selectHasRoleSchedulerManager(state) ||
    selectHasRoleSchedulerAdmin(state) ||
    selectHasRoleSchedulerAgent(state),
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
