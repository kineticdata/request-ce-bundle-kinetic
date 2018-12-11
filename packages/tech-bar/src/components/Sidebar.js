import React from 'react';
import { connect } from 'react-redux';
import {
  KappLink as Link,
  KappNavLink as NavLink,
  Constants,
  Moment,
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  selectHasRoleSchedulerAgent,
} from 'common';
import { Nav, NavItem } from 'reactstrap';
import moment from 'moment';
import { DATE_FORMAT, TIME_FORMAT } from '../App';
import { I18n } from '../../../app/src/I18nProvider';

export const SidebarComponent = ({
  loadingUpcoming,
  upcomingErrors,
  upcomingAppointments,
  hasSettingsAccess,
}) => (
  <div className="sidebar sidebar--tech-bar">
    <div className="sidebar-group--content-wrapper">
      <div className="sidebar-group">
        <h1>
          <I18n>Upcoming Appointments</I18n>
        </h1>
        <Nav vertical>
          {upcomingAppointments.map(appt => {
            const date = moment.utc(appt.values['Event Date'], DATE_FORMAT);
            const start = moment.utc(appt.values['Event Time'], TIME_FORMAT);
            const end = start.clone().add(appt.values['Duration'], 'minute');
            return (
              <NavItem key={appt.id}>
                <NavLink
                  to={`/forms/appointment/${appt.id}`}
                  activeClassName="active"
                  className="nav-link"
                  exact
                >
                  <div>
                    <div>
                      <strong>{appt.values['Summary']}</strong>
                    </div>
                    <div>
                      <Moment
                        timestamp={date}
                        format={Constants.MOMENT_FORMATS.date}
                      />
                    </div>
                    <div>
                      <Moment
                        timestamp={start}
                        format={Constants.MOMENT_FORMATS.time}
                      />
                      {` - `}
                      <Moment
                        timestamp={end}
                        format={Constants.MOMENT_FORMATS.time}
                      />
                    </div>
                  </div>
                </NavLink>
              </NavItem>
            );
          })}
        </Nav>
        {upcomingAppointments.size === 0 &&
          !loadingUpcoming &&
          upcomingErrors.length === 0 && (
            <em className="text-muted">
              <I18n>You do not have any upcoming appointments.</I18n>
            </em>
          )}
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
  loadingUpcoming: state.techBar.appointments.upcoming.loading,
  upcomingErrors: state.techBar.appointments.upcoming.errors,
  upcomingAppointments: state.techBar.appointments.upcoming.data,
  hasSettingsAccess:
    selectHasRoleSchedulerManager(state) ||
    selectHasRoleSchedulerAdmin(state) ||
    selectHasRoleSchedulerAgent(state),
});

export const Sidebar = connect(mapStateToProps)(SidebarComponent);
