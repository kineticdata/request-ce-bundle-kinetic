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
  Table,
} from 'common';
import moment from 'moment';
import { actions } from '../../../redux/modules/techBarApp';
import { actions as appointmentActions } from '../../../redux/modules/appointments';
import { I18n } from '../../../../../app/src/I18nProvider';
import { TechBarDisplayMembers } from './TechBarDisplayMembers';
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
  push,
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
            <div className="mb-5">
              <h2 className="section__title">
                <I18n>Front Desk Users</I18n>
              </h2>
              <TechBarDisplayMembers
                techBar={techBar}
                hasManagerAccess={hasManagerAccess}
              />
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

              <Table
                props={{
                  class: 'table--settings table-hover',
                  name: 'appointments-table',
                  id: 'appointments-table',
                }}
                data={appointments
                  .map(a => ({
                    ...a.values,
                    _id: a.id,
                    _coreState: a.coreState,
                  }))
                  .toJS()}
                columns={[
                  {
                    value: 'Summary',
                    title: 'Summary',
                    renderBodyCell: ({ content, row }) => (
                      <td>
                        <Link
                          to={`/settings/general/${techBar.id}/appointment/${
                            row._id
                          }`}
                        >
                          {content}
                        </Link>
                      </td>
                    ),
                  },
                  {
                    value: 'Requested For Display Name',
                    title: 'User',
                  },
                  {
                    value: 'Event Time',
                    title: 'Time',
                    renderBodyCell: ({ content, row }) => {
                      const start = moment.utc(row['Event Time'], TIME_FORMAT);
                      const end = start
                        .clone()
                        .add(row['Event Duration'], 'minute');
                      return (
                        <td>
                          <Moment
                            timestamp={start}
                            format={Constants.MOMENT_FORMATS.time}
                          />
                          {` - `}
                          <Moment
                            timestamp={end}
                            format={Constants.MOMENT_FORMATS.time}
                          />
                        </td>
                      );
                    },
                  },
                  {
                    value: 'Event Type',
                    title: 'Event Type',
                  },
                  {
                    value: 'Status',
                    title: 'Status',
                    width: '1%',
                    renderBodyCell: ({ content, row }) => (
                      <td>
                        <span
                          className={`badge ${
                            row._coreState === 'Closed'
                              ? 'badge-dark'
                              : 'badge-success'
                          }`}
                        >
                          <I18n>{content}</I18n>
                        </span>
                      </td>
                    ),
                  },
                ]}
                emptyMessage="There are no appointments for the selected date."
                filtering={false}
                pagination={false}
                sortOrder={2}
                render={({ table }) => (
                  <div className="table-wrapper">{table}</div>
                )}
              />
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
    displayTeamLoading: state.techBar.techBarApp.displayTeamLoading,
    displayTeam: state.techBar.techBarApp.displayTeam,
  };
};

export const mapDispatchToProps = {
  push,
  fetchAppointmentsList: appointmentActions.fetchAppointmentsList,
  setAppointmentsDate: appointmentActions.setAppointmentsDate,
  fetchDisplayTeam: actions.fetchDisplayTeam,
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
      this.props.fetchDisplayTeam({
        techBarName: this.props.techBar.values['Name'],
      });
    },
  }),
)(TechBarComponent);
