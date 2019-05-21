import React, { Fragment } from 'react';
import { connect } from '../../../redux/store';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import {
  Utils,
  ErrorNotFound,
  selectHasRoleSchedulerAdmin,
  Table,
  LoadingMessage,
} from 'common';
import { PageTitle } from '../../shared/PageTitle';
import { Link } from '@reach/router';
import moment from 'moment';
import { actions } from '../../../redux/modules/appointments';
import { I18n, Moment } from '@kineticdata/react';
import { TechBarDisplayMembers } from './TechBarDisplayMembers';
import { TIME_FORMAT } from '../../../constants';

export const TechBarComponent = ({
  techBar,
  hasManagerAccess,
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
                <Link to="../../../">
                  <I18n>tech bar</I18n>
                </Link>{' '}
                /{` `}
                <Link to="../../">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{` `}
                <Link to="../">
                  <I18n>tech bars</I18n>
                </Link>{' '}
                /{` `}
              </h3>
              <h1>
                <I18n>{techBar.values['Name']}</I18n>
              </h1>
            </div>
            {hasManagerAccess && (
              <Link to="edit" className="btn btn-primary">
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
                    format={Moment.formats.dateWithDay}
                  />
                </span>
              </div>

              {appointments ? (
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
                          <Link to={`appointment/${row._id}`}>{content}</Link>
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
                        const start = moment.utc(
                          row['Event Time'],
                          TIME_FORMAT,
                        );
                        const end = start
                          .clone()
                          .add(row['Event Duration'], 'minute');
                        return (
                          <td>
                            <Moment
                              timestamp={start}
                              format={Moment.formats.time}
                            />
                            {` - `}
                            <Moment
                              timestamp={end}
                              format={Moment.formats.time}
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
              ) : (
                <LoadingMessage />
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
  const isSchedulerAdmin = selectHasRoleSchedulerAdmin(state.app.profile);
  const techBar = state.techBarApp.schedulers.find(
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
    kapp: state.app.kapp,
    techBar,
    hasManagerAccess:
      isSchedulerAdmin ||
      (techBar &&
        Utils.isMemberOf(
          state.app.profile,
          `Role::Scheduler::${techBar.values['Name']}`,
        )),
    appointmentError: state.appointments.error,
    appointments: state.appointments.list,
    appointmentDate: state.appointments.listDate,
  };
};

export const mapDispatchToProps = {
  fetchAppointmentsListRequest: actions.fetchAppointmentsListRequest,
  setAppointmentsListDate: actions.setAppointmentsListDate,
};

export const TechBar = compose(
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
      setAppointmentsListDate,
      techBar,
    }) => () => {
      setAppointmentsListDate({
        date: appointmentDate.add(-1, 'day'),
        schedulerId: techBar.values['Id'],
      });
    },
    handleNextDay: ({
      appointmentDate,
      setAppointmentsListDate,
      techBar,
    }) => () => {
      setAppointmentsListDate({
        date: appointmentDate.add(1, 'day'),
        schedulerId: techBar.values['Id'],
      });
    },
    handleToday: ({ setAppointmentsListDate, techBar }) => () => {
      setAppointmentsListDate({
        date: moment(),
        schedulerId: techBar.values['Id'],
      });
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppointmentsListRequest({
        schedulerId: this.props.techBar.values['Id'],
      });
    },
  }),
)(TechBarComponent);
