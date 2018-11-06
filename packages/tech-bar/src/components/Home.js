import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
  withProps,
} from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { KappLink as Link, PageTitle, selectCurrentKapp } from 'common';
import { actions } from '../redux/modules/appointments';
import moment from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_DISPLAY_FORMAT = 'dddd, LL';
export const TIME_FORMAT = 'HH:mm';
export const TIME_DISPLAY_FORMAT = 'LT';

export const HomeComponent = ({
  kapp,
  techBars,
  loadingUpcoming,
  upcomingErrors,
  upcomingAppointments,
  loadingPast,
  pastErrors,
  pastAppointments,
  openDropdown,
  toggleDropdown,
}) => (
  <Fragment>
    <PageTitle parts={[]} />
    <div className="page-container page-container--tech-bar-home">
      <div className="home-title">
        Welcome to {kapp ? kapp.name : 'Tech Bar'}
      </div>
      <section className="mb-4">
        <h2 className="section__title">Tech Bars</h2>
        <div className="cards__wrapper--tech-bar">
          {techBars.map(techBar => (
            <div className="card card--tech-bar" key={techBar.id}>
              <div className="card-body">
                <h3 className="card-title">
                  <span>{techBar.values['Name']}</span>
                  <span>
                    <Dropdown
                      toggle={toggleDropdown(techBar.id)}
                      isOpen={openDropdown === techBar.id}
                    >
                      <DropdownToggle color="link" className="btn-sm">
                        <span className="fa fa-ellipsis-v fa-2x" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <Link
                          to={`/display/${techBar.values['Id']}/checkin`}
                          className="dropdown-item"
                          target="_blank"
                        >
                          <span className="fa fa-external-link fa-fw mr-2" />
                          <span>Check In</span>
                        </Link>
                        <Link
                          to={`/display/${techBar.values['Id']}/feedback`}
                          className="dropdown-item"
                          target="_blank"
                        >
                          <span className="fa fa-external-link fa-fw mr-2" />
                          <span>Feedback</span>
                        </Link>
                        <Link
                          to={`/display/${techBar.values['Id']}/overhead`}
                          className="dropdown-item"
                          target="_blank"
                        >
                          <span className="fa fa-external-link fa-fw mr-2" />
                          <span>Overhead</span>
                        </Link>
                      </DropdownMenu>
                    </Dropdown>
                  </span>
                </h3>
                <div className="card-subtitle">
                  {techBar.values['Location']}
                </div>
                <p className="card-text">{techBar.values['Description']}</p>
                <Link
                  to={`/forms/appointment?values[Scheduler Id]=${
                    techBar.values['Id']
                  }`}
                  className="btn btn-primary card-button"
                >
                  Schedule
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-4">
        <h2 className="section__title">Upcoming Appointments</h2>
        <div className="cards__wrapper--tech-bar">
          {upcomingAppointments.map(appt => {
            const date = moment.utc(appt.values['Event Date'], DATE_FORMAT);
            const start = moment.utc(appt.values['Event Time'], TIME_FORMAT);
            const end = start.clone().add(appt.values['Duration'], 'minute');
            return (
              <div className="card card--tech-bar" key={appt.id}>
                <div className="card-body">
                  <h5 className="card-title">
                    {date.format(DATE_DISPLAY_FORMAT)}
                  </h5>
                  <div className="card-subtitle">
                    {`${start.format(TIME_DISPLAY_FORMAT)} - ${end.format(
                      TIME_DISPLAY_FORMAT,
                    )}`}
                  </div>
                  <p className="card-text">{appt.values['Summary']}</p>
                  <Link
                    to={`/forms/appointment/${appt.id}`}
                    className="btn btn-dark card-button"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {upcomingAppointments.size === 0 &&
          !loadingUpcoming &&
          upcomingErrors.length === 0 && (
            <h6 className="text-muted">
              <em>You do not have any upcoming appointments.</em>
            </h6>
          )}
      </section>
      <section className="mb-4">
        <h2 className="section__title">Past Appointments</h2>
        <div className="cards__wrapper--tech-bar">
          {pastAppointments.map(appt => {
            const date = moment.utc(appt.values['Event Date'], DATE_FORMAT);
            const start = moment.utc(appt.values['Event Time'], TIME_FORMAT);
            const end = start.clone().add(appt.values['Duration'], 'minute');
            return (
              <div className="card card--tech-bar" key={appt.id}>
                <div className="card-body">
                  <h5 className="card-title">
                    {date.format(DATE_DISPLAY_FORMAT)}
                  </h5>
                  <div className="card-subtitle">
                    {`${start.format(TIME_DISPLAY_FORMAT)} - ${end.format(
                      TIME_DISPLAY_FORMAT,
                    )}`}
                  </div>
                  <p className="card-text">{appt.values['Summary']}</p>
                  <Link
                    to={`/forms/appointment/${appt.id}`}
                    className="btn btn-subtle card-button"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {pastAppointments.size === 0 &&
          !loadingPast &&
          pastErrors.length === 0 && (
            <h6 className="text-muted">
              <em>You do not have any past appointments.</em>
            </h6>
          )}
      </section>
    </div>
  </Fragment>
);

export const mapStateToProps = state => ({
  kapp: selectCurrentKapp(state),
  techBars: state.techBar.techBarApp.schedulers,
  loadingUpcoming: state.techBar.appointments.upcoming.loading,
  upcomingErrors: state.techBar.appointments.upcoming.errors,
  upcomingAppointments: state.techBar.appointments.upcoming.data,
  loadingPast: state.techBar.appointments.past.loading,
  pastErrors: state.techBar.appointments.past.errors,
  pastAppointments: state.techBar.appointments.past.data,
});

export const mapDispatchToProps = {
  push,
  fetchUpcomingAppointments: actions.fetchUpcomingAppointments,
  fetchPastAppointments: actions.fetchPastAppointments,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? false : dropdownSlug);

export const Home = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('openDropdown', 'setOpenDropdown', false),
  withHandlers({ toggleDropdown }),
  lifecycle({
    componentDidMount() {
      this.props.fetchUpcomingAppointments();
      this.props.fetchPastAppointments();
    },
  }),
)(HomeComponent);
