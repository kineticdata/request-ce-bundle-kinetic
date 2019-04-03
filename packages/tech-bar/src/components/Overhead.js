import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Moment, Constants } from 'common';
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
  withProps,
} from 'recompose';
import { actions as appointmentActions } from '../redux/modules/appointments';
import { actions as walkInActions } from '../redux/modules/walkIns';
import { I18n } from '../../../app/src/I18nProvider';
import moment from 'moment';

export const OverheadComponent = ({ errors, records }) => {
  return (
    <section className="tech-bar-display tech-bar-display--overhead">
      <div className="full-screen-container">
        <div className="header bg-dark" />
        <div className="body">
          <div className="form">
            <h1>
              {errors.length > 0 && (
                <span className="fa fa-fw fa-exclamation-triangle text-danger mr-2" />
              )}
              <span>
                <I18n>Checked In</I18n>
              </span>
            </h1>
            <ol className="overhead-display-list">
              {records
                .filter(r => r.status === 'Checked In')
                .map(r => (
                  <li key={r.id}>
                    {r.displayName}{' '}
                    {r.isWalkIn ? (
                      <small>
                        <I18n
                          render={translate => `(${translate('Walk-In')})`}
                        />
                      </small>
                    ) : (
                      <small>
                        {'('}
                        <Moment
                          timestamp={r.appointmentTime}
                          format={Constants.MOMENT_FORMATS.time}
                        />
                        {')'}
                      </small>
                    )}
                  </li>
                ))}
            </ol>
          </div>
          <div className="form">
            <h1>
              {errors.length > 0 && (
                <span className="fa fa-fw fa-exclamation-triangle text-danger mr-2" />
              )}
              <span>
                <I18n>Now Serving</I18n>
              </span>
            </h1>
            <ol className="overhead-display-list">
              {records
                .filter(r => r.status === 'In Progress')
                .map(r => (
                  <li key={r.id}>
                    {r.displayName}{' '}
                    {r.isWalkIn ? (
                      <small>
                        <I18n
                          render={translate => `(${translate('Walk-In')})`}
                        />
                      </small>
                    ) : (
                      <small>
                        {'('}
                        <Moment
                          timestamp={r.appointmentTime}
                          format={Constants.MOMENT_FORMATS.time}
                        />
                        {')'}
                      </small>
                    )}
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export const mapStateToProps = (state, props) => ({
  errors: [
    ...state.techBar.appointments.today.errors,
    ...state.techBar.walkIns.today.errors,
  ],
  records: state.techBar.appointments.today.data
    .map(a => ({
      id: a.id,
      updatedAt: `${a.values['Event Date']} ${a.values['Event Time']}`,
      appointmentTime: `${a.values['Event Date']} ${a.values['Event Time']}`,
      username: a.values['Requested For'],
      displayName: a.values['Requested For Display Name'],
      status: a.values['Status'],
    }))
    .concat(
      state.techBar.walkIns.today.data.map(w => ({
        id: w.id,
        updatedAt: moment
          .utc(w.updatedAt)
          .tz(props.techBar.values['Timezone'] || moment.tz.guess())
          .format('YYYY-MM-DD HH:mm'),
        isWalkIn: true,
        username: w.values['Requested For'] || w.values['Email'],
        displayName:
          w.values['Requested For Display Name'] ||
          `${w.values['First Name']} ${w.values['Last Name']}`,
        status: w.values['Status'],
      })),
    )
    .sortBy(r => r.updatedAt),
});

export const mapDispatchToProps = {
  push,
  fetchTodayAppointments: appointmentActions.fetchTodayAppointments,
  fetchTodayWalkIns: walkInActions.fetchTodayWalkIns,
};

const fetchData = ({
  techBarId,
  fetchTodayAppointments,
  fetchTodayWalkIns,
}) => () => {
  fetchTodayAppointments({
    schedulerId: techBarId,
    status: ['Checked In', 'In Progress'],
  });
  fetchTodayWalkIns({
    schedulerId: techBarId,
    status: ['Checked In', 'In Progress'],
  });
};

export const Overhead = compose(
  withProps(({ techBar }) => ({
    techBarId: techBar.values['Id'],
  })),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('poller', 'setPoller', null),
  withHandlers({
    fetchData,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchData();
      this.props.setPoller(
        setInterval(() => {
          this.props.fetchData();
        }, 30000),
      );
    },
    componentWillUnmount() {
      clearInterval(this.props.poller);
    },
  }),
)(OverheadComponent);
