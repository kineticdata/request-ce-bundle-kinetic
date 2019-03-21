import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import {
  Modal,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import {
  KappLink as Link,
  PageTitle,
  selectCurrentKapp,
  Moment,
  Constants,
  Utils,
} from 'common';
import { actions } from '../redux/modules/appointments';
import {
  SESSION_ITEM_USER_LOCATION,
  SESSION_ITEM_CURRENT_TECH_BAR,
  mapTechBarsForDistance,
  sortTechBarsByDistance,
} from '../redux/modules/techBarApp';
import moment from 'moment';
import { I18n } from '../../../app/src/I18nProvider';
import { DATE_FORMAT, TIME_FORMAT } from '../App';
import heroImage from '../assets/images/tech-bar-hero.jpg';

export const HomeComponent = ({
  kapp,
  techBars,
  loadingUpcoming,
  upcomingErrors,
  upcomingAppointments,
  modalOpen,
  setModalOpen,
  currentTechBar,
  selectCurrentTechBar,
  userLocation,
  getUserLocation,
  openDropdown,
  toggleDropdown,
  hasTechBarDisplayRole,
}) => {
  const selectedTechBar = currentTechBar || techBars.get(0);
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div
        className="hero--tech-bar"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="container">
          <div className="hero-welcome">
            <div className="title">
              <I18n>Welcome to {kapp ? kapp.name : 'Tech Bar'}</I18n>
            </div>
            <div className="subtitle">
              <I18n>
                We deliver in-person service that gets people back on track.
              </I18n>
            </div>
          </div>
          <div className="hero-card">
            <div className="card card--tech-bar-loc">
              <div className="card-body">
                <span className="icon fa fa-map-marker" />
                <div className="content">
                  <span className="title">
                    <I18n>{selectedTechBar.values['Name']}</I18n>
                    {techBars.size > 1 && (
                      <button
                        className="btn btn-inverse btn-sm"
                        onClick={() => setModalOpen(true)}
                      >
                        <I18n>Change</I18n>
                      </button>
                    )}
                  </span>
                  {selectedTechBar.values['Location'] && (
                    <div className="subtitle">
                      <I18n>{selectedTechBar.values['Location']}</I18n>
                    </div>
                  )}
                  <div className="details">
                    {selectedTechBar.values['Description'] && (
                      <p>
                        <I18n>{selectedTechBar.values['Description']}</I18n>
                      </p>
                    )}
                    {selectedTechBar.values['Details'] && (
                      <p>
                        <I18n>{selectedTechBar.values['Details']}</I18n>
                      </p>
                    )}
                  </div>
                </div>
                {/*hasTechBarDisplayRole(selectedTechBar.values['Name']) && (
                  <Dropdown
                    toggle={toggleDropdown(selectedTechBar.id)}
                    isOpen={openDropdown === selectedTechBar.id}
                  >
                    <DropdownToggle color="link" className="btn-sm">
                      <span className="fa fa-ellipsis-v fa-2x" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <Link
                        to={`/display/${selectedTechBar.values['Id']}/checkin`}
                        className="dropdown-item"
                        target="_blank"
                      >
                        <span className="fa fa-fw fa-external-link mr-2" />
                        <span>
                          <I18n>Check In</I18n>
                        </span>
                      </Link>
                      <Link
                        to={`/display/${selectedTechBar.values['Id']}/feedback`}
                        className="dropdown-item"
                        target="_blank"
                      >
                        <span className="fa fa-external-link fa-fw mr-2" />
                        <span>
                          <I18n>Feedback</I18n>
                        </span>
                      </Link>
                      <Link
                        to={`/display/${
                          selectedTechBar.values['Id']
                        }/checkin?crosslink`}
                        className="dropdown-item"
                        target="_blank"
                      >
                        <span className="fa fa-external-link fa-fw mr-2" />
                        <span>
                          <I18n>Check In</I18n> / <I18n>Feedback</I18n>
                        </span>
                      </Link>
                      <Link
                        to={`/display/${selectedTechBar.values['Id']}/overhead`}
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
                )*/}
              </div>
              <Link
                to={`/appointment/${selectedTechBar.values['Id']}`}
                className="btn btn-primary card-button"
              >
                <I18n>Schedule Now</I18n> →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="page-container page-container--tech-bar container">
        <section>
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <I18n>tech bar</I18n> /{' '}
              </h3>
              <h1>
                <I18n>Upcoming Appointments</I18n>
              </h1>
            </div>
          </div>
          <div className="cards__wrapper cards__wrapper--appt mb-3">
            {upcomingAppointments.map(appt => {
              const techBar = techBars.find(
                t => t.values['Id'] === appt.values['Scheduler Id'],
              );
              const date = moment.utc(appt.values['Event Date'], DATE_FORMAT);
              const start = moment.utc(appt.values['Event Time'], TIME_FORMAT);
              const end = start
                .clone()
                .add(appt.values['Event Duration'], 'minute');
              return (
                <Link
                  to={`/appointment/${appt.values['Scheduler Id']}/${appt.id}`}
                  className="card card--long card--appt"
                  key={appt.id}
                >
                  <i
                    className="fa fa-calendar fa-fw card-icon"
                    style={{ background: 'rgb(255, 74, 94)' }}
                  />
                  <div className="card-body">
                    <span className="card-title">
                      <Moment
                        timestamp={date}
                        format={Constants.MOMENT_FORMATS.dateWithDay}
                      />
                    </span>
                    <p className="card-subtitle">
                      <Moment
                        timestamp={start}
                        format={Constants.MOMENT_FORMATS.time}
                      />
                      {` - `}
                      <Moment
                        timestamp={end}
                        format={Constants.MOMENT_FORMATS.time}
                      />
                    </p>
                    {techBar && (
                      <p className="card-meta">
                        <strong>
                          <I18n>{techBar.values['Name']}</I18n>
                        </strong>
                      </p>
                    )}
                    <span
                      className={`badge ${
                        appt.coreState === 'Closed'
                          ? 'badge-dark'
                          : 'badge-success'
                      }`}
                    >
                      <I18n>{appt.values['Status']}</I18n>
                    </span>
                    <p className="card-text">{appt.values['Summary']}</p>
                  </div>
                </Link>
              );
            })}
            {upcomingAppointments.size === 0 &&
              !loadingUpcoming &&
              upcomingErrors.length === 0 && (
                <div className="text-center mx-auto text-muted">
                  <h3 className="mb-3">
                    <I18n>You have no upcoming appointments.</I18n>
                  </h3>
                  <p>
                    <I18n>
                      As you schedule appointments, they'll appear here.
                    </I18n>
                  </p>
                </div>
              )}
          </div>
          <Link to="/past" className="btn btn-link">
            <I18n>View Past Appointments</I18n>
          </Link>
        </section>
      </div>
      {modalOpen && (
        <Modal
          isOpen={!!modalOpen}
          toggle={() => setModalOpen(false)}
          size="sm"
          className="tech-bar-modal"
        >
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setModalOpen(false)}
              >
                <I18n>Cancel</I18n>
              </button>
              <span>Location</span>
              <Link to="/tech-bars" className="btn btn-sm btn-link">
                <I18n>View All</I18n>
              </Link>
            </h4>
          </div>
          {!userLocation && (
            <div className="modal-header">
              <div className="px-3 py-1 text-center">
                <button className="btn btn-link" onClick={getUserLocation}>
                  <span className="fa fa-fw fa-map-marker" />{' '}
                  <I18n>use my current location</I18n>
                </button>
              </div>
            </div>
          )}
          <ModalBody>
            <ul>
              {techBars.map(techBar => (
                <li
                  key={techBar.id}
                  onClick={() => selectCurrentTechBar(techBar.id)}
                >
                  <span className="title">
                    <I18n>{techBar.values['Name']}</I18n>
                  </span>
                  {techBar.values['Location'] && (
                    <div className="subtitle">
                      <I18n>{techBar.values['Location']}</I18n>
                    </div>
                  )}
                  {userLocation && (
                    <div className="subtitle">
                      <I18n
                        render={translate =>
                          techBar.distance
                            ? `(${techBar.distance.toFixed(1)} ${translate(
                                'miles',
                              )})`
                            : `(${translate('Distance Unknown')})`
                        }
                      />
                    </div>
                  )}
                  <div className="details">
                    {techBar.values['Description'] && (
                      <p>
                        <I18n>{techBar.values['Description']}</I18n>
                      </p>
                    )}
                    {techBar.values['Details'] && (
                      <p>
                        <I18n>{techBar.values['Details']}</I18n>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </ModalBody>
        </Modal>
      )}
    </Fragment>
  );
};

export const mapStateToProps = (state, props) => {
  return {
    kapp: selectCurrentKapp(state),
    techBars: state.techBar.techBarApp.schedulers
      .filter(s => s.values['Status'] === 'Active')
      .map(
        props.userLocation
          ? mapTechBarsForDistance(props.userLocation)
          : t => t,
      )
      .sort(props.userLocation ? sortTechBarsByDistance : () => 0),
    loadingUpcoming: state.techBar.appointments.upcoming.loading,
    upcomingErrors: state.techBar.appointments.upcoming.errors,
    upcomingAppointments: state.techBar.appointments.upcoming.data,
    profile: state.app.profile,
  };
};

export const mapDispatchToProps = {
  push,
  fetchUpcomingAppointments: actions.fetchUpcomingAppointments,
};

const selectCurrentTechBar = ({
  techBars,
  setCurrentTechBar,
  setModalOpen,
}) => id => {
  setModalOpen(false);
  sessionStorage.setItem(SESSION_ITEM_CURRENT_TECH_BAR, id);
  setCurrentTechBar(techBars.find(t => t.id === id));
};

const getUserLocation = ({ setUserLocation }) => () => {
  navigator.geolocation.getCurrentPosition(position => {
    if (position && position.coords) {
      const userLocObj = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setUserLocation(userLocObj);
      sessionStorage.setItem(
        SESSION_ITEM_USER_LOCATION,
        JSON.stringify(userLocObj),
      );
    }
  });
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? false : dropdownSlug);

const hasTechBarDisplayRole = ({ profile }) => techBarName =>
  Utils.isMemberOf(profile, `Role::Tech Bar Display::${techBarName}`);

export const Home = compose(
  withState('userLocation', 'setUserLocation', () => {
    try {
      const locObj = JSON.parse(
        sessionStorage.getItem(SESSION_ITEM_USER_LOCATION),
      );
      if (locObj && locObj.latitude != null && locObj.longitude != null) {
        return locObj;
      }
    } catch (e) {}
    return null;
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('currentTechBar', 'setCurrentTechBar', ({ techBars }) => {
    const techBarId = sessionStorage.getItem(SESSION_ITEM_CURRENT_TECH_BAR);
    return techBarId ? techBars.find(t => t.id === techBarId) : null;
  }),
  withState('modalOpen', 'setModalOpen', false),
  withState('openDropdown', 'setOpenDropdown', false),
  withHandlers({
    selectCurrentTechBar,
    getUserLocation,
    toggleDropdown,
    hasTechBarDisplayRole,
  }),
  lifecycle({
    componentDidMount() {
      if (!this.props.loadingUpcoming) {
        this.props.fetchUpcomingAppointments();
      }
      if (this.props.userLocation === null) {
        this.props.getUserLocation();
      }
    },
  }),
)(HomeComponent);
