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
import { actions as appointmentActions } from '../redux/modules/appointments';
import { actions as walkInActions } from '../redux/modules/walkIns';
import { I18n } from '../../../app/src/I18nProvider';

export const OverheadComponent = ({ errors, records }) => {
  return (
    <section className="tech-bar-display tech-bar-display__small mb-3">
      <div className="details-container">
        <div className="header bg-dark" />
        <div className="overhead-display body">
          <div className="form">
            <h1>
              {errors.length > 0 && (
                <span className="fa fa-exclamation-triangle text-danger mr-2" />
              )}
              <span>
                <I18n>Next up...</I18n>
              </span>
            </h1>
            <ul className="overhead-display-list">
              {records.filter(r => r.status === 'Checked In').map(r => (
                <li key={r.id}>
                  <span>{r.displayName}</span>
                  {r.isWalkIn && (
                    <small className="text-muted">
                      <I18n
                        render={translate => ` (${translate('Walk-In')})`}
                      />
                    </small>
                  )}
                </li>
              ))}
            </ul>
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
      updatedAt: a.updatedAt,
      username: a.values['Requested For'],
      displayName: a.values['Requested For Display Name'],
      status: a.values['Status'],
    }))
    .concat(
      state.techBar.walkIns.today.data.map(w => ({
        id: w.id,
        updatedAt: w.updatedAt,
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
  fetchTodayAppointments(techBarId);
  fetchTodayWalkIns(techBarId);
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
