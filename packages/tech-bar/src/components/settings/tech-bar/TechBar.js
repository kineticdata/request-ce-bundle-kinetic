import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import {
  KappLink as Link,
  PageTitle,
  selectCurrentKapp,
  Utils,
  ErrorNotFound,
  selectHasRoleSchedulerAdmin,
  Moment,
  Constants,
} from 'common';
import moment from 'moment';
import { actions } from '../../../redux/modules/appointments';
import { I18n } from '../../../../../app/src/I18nProvider';
import { TIME_FORMAT } from '../../../App';

export const TechBarComponent = ({
  techBar,
  hasManagerAccess,
  loadingAppointments,
  appointmentErrors,
  appointments,
  appointmentDate,
  handlePreviousDay,
  handleNextDay,
  handleToday,
  isToday,
}) => {
  return techBar ? (
    <Fragment>
      <PageTitle parts={[techBar.values['Name'], 'Tech Bar Settings']} />
      <div className="page-container page-container--tech-bar-settings">
        <div className="page-panel page-panel--scrollable">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">
                  <I18n>tech bar</I18n>
                </Link>{' '}
                /{` `}
                <Link to="/settings">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{` `}
                <Link to="/settings/general">
                  <I18n>tech bars</I18n>
                </Link>{' '}
                /{` `}
              </h3>
              <h1>
                <I18n>{techBar.values['Name']}</I18n>
              </h1>
            </div>
            {hasManagerAccess && (
              <Link
                to={`/settings/general/${techBar.id}/edit`}
                className="btn btn-primary"
              >
                <I18n>Edit Settings</I18n>
              </Link>
            )}
          </div>
          <div className="content-wrapper">
            <div className="form">
              <h2 className="section__title">
                <I18n>General Settings</I18n>
              </h2>
              <div className="form-group">
                <label>
                  <I18n>Allow Walk-Ins</I18n>
                </label>
                <div>
                  <I18n>{techBar.settings.allowWalkIns ? 'Yes' : 'No'}</I18n>
                </div>
              </div>
              <div className="form-group">
                <label>
                  <I18n>Feedback Identification</I18n>
                </label>
                <div>
                  <I18n>{techBar.settings.feedbackIdentitifcation}</I18n>
                </div>
              </div>
            </div>
            <div>
              <h2 className="section__title">
                <I18n>Appointments</I18n>
              </h2>
              <div className="appointments-control mb-3">
                <div className="btn-group">
                  <button
                    className="btn btn-inverse"
                    onClick={handlePreviousDay}
                  >
                    <span className="fa fa-chevron-left" />
                  </button>
                  <button
                    className="btn btn-inverse"
                    onClick={handleToday}
                    disabled={isToday}
                  >
                    <I18n>Today</I18n>
                  </button>
                  <button className="btn btn-inverse" onClick={handleNextDay}>
                    <span className="fa fa-chevron-right" />
                  </button>
                </div>
                <span className="ml-3">
                  <Moment
                    timestamp={appointmentDate}
                    format={Constants.MOMENT_FORMATS.dateWithDay}
                  />
                </span>
              </div>
              <div className="cards__wrapper cards__wrapper--appt">
                {appointments.map(appt => {
                  const start = moment.utc(
                    appt.values['Event Time'],
                    TIME_FORMAT,
                  );
                  const end = start
                    .clone()
                    .add(appt.values['Duration'], 'minute');
                  return (
                    <div className="card card--appt" key={appt.id}>
                      <i
                        className="fa fa-calendar fa-fw card-icon"
                        style={{ background: 'rgb(255, 74, 94)' }}
                      />
                      <div className="card-body">
                        <h1 className="card-title">
                          <span>
                            {appt.values['Requested For Display Name']}{' '}
                            <small>({appt.values['Event Type']})</small>
                          </span>
                          <span
                            className={`badge ${
                              appt.coreState === 'Closed'
                                ? 'badge-dark'
                                : 'badge-success'
                            }`}
                          >
                            {appt.values['Status']}
                          </span>
                        </h1>
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
                        <p className="card-text">{appt.values['Summary']}</p>
                        <Link
                          to={`/settings/general/${techBar.id}/appointment/${
                            appt.id
                          }`}
                          className="btn btn-link text-left pl-0"
                        >
                          <I18n>View Details →</I18n>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
              {appointments.size === 0 &&
                !loadingAppointments &&
                appointmentErrors.length === 0 && (
                  <h6 className="text-muted">
                    <em>
                      <I18n>
                        There are no appointments for the selected date.
                      </I18n>
                    </em>
                  </h6>
                )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  ) : (
    <ErrorNotFound />
  );
};

export const mapStateToProps = (state, props) => {
  const isSchedulerAdmin = selectHasRoleSchedulerAdmin(state);
  const techBar = state.techBar.techBarApp.schedulers.find(
    scheduler =>
      scheduler.id === props.techBarId &&
      (isSchedulerAdmin ||
        Utils.isMemberOf(
          state.app.profile,
          `Role::Scheduler::${scheduler.values['Name']}`,
        ) ||
        Utils.isMemberOf(
          state.app.profile,
          `Scheduler::${scheduler.values['Name']}`,
        )),
  );
  return {
    kapp: selectCurrentKapp(state),
    techBar,
    hasManagerAccess:
      isSchedulerAdmin ||
      (techBar &&
        Utils.isMemberOf(
          state.app.profile,
          `Role::Scheduler::${techBar.values['Name']}`,
        )),
    loadingAppointments: state.techBar.appointments.list.loading,
    appointmentErrors: state.techBar.appointments.list.errors,
    appointments: state.techBar.appointments.list.data,
    appointmentDate: state.techBar.appointments.list.date,
  };
};

export const mapDispatchToProps = {
  push,
  fetchAppointmentsList: actions.fetchAppointmentsList,
  setAppointmentsDate: actions.setAppointmentsDate,
};

export const TechBar = compose(
  withProps(({ match: { params: { id } } }) => ({ techBarId: id })),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ appointmentDate }) => ({
    isToday:
      appointmentDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'),
  })),
  withHandlers({
    handlePreviousDay: ({
      appointmentDate,
      setAppointmentsDate,
      techBar,
    }) => () => {
      setAppointmentsDate({
        date: appointmentDate.add(-1, 'day'),
        schedulerId: techBar.values['Id'],
      });
    },
    handleNextDay: ({
      appointmentDate,
      setAppointmentsDate,
      techBar,
    }) => () => {
      setAppointmentsDate({
        date: appointmentDate.add(1, 'day'),
        schedulerId: techBar.values['Id'],
      });
    },
    handleToday: ({ setAppointmentsDate, techBar }) => () => {
      setAppointmentsDate({
        date: moment(),
        schedulerId: techBar.values['Id'],
      });
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppointmentsList({
        schedulerId: this.props.techBar.values['Id'],
      });
    },
  }),
)(TechBarComponent);
