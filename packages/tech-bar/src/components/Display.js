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
  KappLink as Link,
  PageTitle,
  selectCurrentKapp,
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  toastActions,
  Actions,
} from 'common';
import { actions } from '../redux/modules/appointments';
import moment from 'moment';
import { CoreForm } from 'react-kinetic-core';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_DISPLAY_FORMAT = 'dddd, LL';
export const TIME_FORMAT = 'HH:mm';
export const TIME_DISPLAY_FORMAT = 'LT';

export const DisplayComponent = ({
  kapp,
  techBar,
  appointments,
  displayMode,
  showDetails,
  setShowDetails,
  input,
  setInput,
  addSuccess,
  addError,
}) => {
  const filteredAppointments =
    showDetails === 'appointment' && input.length >= 3
      ? appointments.filter(
          appt =>
            appt.values['Requested For'].includes(input) ||
            appt.values['Requested For Display Name'].includes(input),
        )
      : null;
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container page-container--tech-bar-display">
        {techBar && (
          <Fragment>
            <div className="home-title text-center mb-4">
              {techBar.values['Name']}
            </div>
            {showDetails === 'walkin' ? (
              <Fragment>
                <div className="page-title">
                  <div className="page-title__wrapper">
                    <h3>
                      <a
                        onClick={() => {
                          setShowDetails(null);
                        }}
                      >
                        check in
                      </a>{' '}
                      /{' '}
                    </h3>
                    <h1>Walk-In</h1>
                  </div>
                </div>
                <CoreForm
                  kapp={kapp.slug}
                  form="walk-in"
                  globals={globals}
                  completed={() => {
                    setShowDetails(null);
                    addSuccess(`You have successfully checked in.`);
                  }}
                  values={{
                    'Scheduler Id': techBar.values['Id'],
                  }}
                  notFoundComponent={ErrorNotFound}
                  unauthorizedComponent={ErrorUnauthorized}
                  unexpectedErrorComponent={ErrorUnexpected}
                />
              </Fragment>
            ) : (
              <section className="tech-bar-display">
                <div
                  className={`check-in-card mb-5 ${
                    showDetails === 'appointment' ? 'open' : ''
                  }`}
                >
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setShowDetails(
                        showDetails === 'appointment' ? null : 'appointment',
                      );
                      setInput('');
                    }}
                  >
                    I have an appointment
                  </button>
                  <form className="details">
                    {showDetails === 'appointment' && (
                      <Fragment>
                        <div className="form-group">
                          <label htmlFor="">
                            Find Appointment by Name or Email
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                          />
                        </div>
                        {filteredAppointments && (
                          <div className="form-group">
                            {filteredAppointments.map(appt => (
                              <div className="appt-card">
                                <div className="appt-info">
                                  <div>
                                    {appt.values['Requested For Display Name']}
                                  </div>
                                  <div className="text-muted">
                                    {moment(
                                      appt.values['Event Time'],
                                      TIME_FORMAT,
                                    ).format(TIME_DISPLAY_FORMAT)}
                                  </div>
                                </div>
                                <button
                                  className="btn btn-primary appt-action"
                                  onClick={() =>
                                    Actions.createAction({
                                      action: `Tech Bar Check In - ${
                                        appt.values['Scheduler Id']
                                      }`,
                                      type: 'submission',
                                      operation: 'update',
                                      relatedId: appt.id,
                                      jsonInput: {
                                        values: { Status: 'Checked In' },
                                      },
                                      successCallback: () => {
                                        setShowDetails(null);
                                        setInput('');
                                        addSuccess(
                                          `${
                                            appt.values[
                                              'Requested For Display Name'
                                            ]
                                          } has been successfully checked in.`,
                                        );
                                      },
                                      errorCallback: () => {
                                        setShowDetails(null);
                                        setInput('');
                                        addError(
                                          `There was an error while checking you in.`,
                                        );
                                      },
                                    })
                                  }
                                >
                                  Check In
                                </button>
                              </div>
                            ))}
                            {filteredAppointments.size === 0 && (
                              <div className="alert alert-warning text-center">
                                No appointments found.
                              </div>
                            )}
                          </div>
                        )}
                      </Fragment>
                    )}
                  </form>
                </div>
                <div
                  className={`check-in-card ${
                    showDetails === 'walkin' ? 'open' : ''
                  }`}
                >
                  <button
                    className="btn btn-info"
                    onClick={() => {
                      setShowDetails(
                        showDetails === 'walkin' ? null : 'walkin',
                      );
                      setInput('');
                    }}
                  >
                    I am a walk-in
                  </button>
                </div>
              </section>
            )}
          </Fragment>
        )}
        {!techBar && <ErrorNotFound />}
      </div>
    </Fragment>
  );
};

export const mapStateToProps = (state, props) => ({
  kapp: selectCurrentKapp(state),
  techBar: state.techBar.techBarApp.schedulers.find(
    scheduler => scheduler.values['Id'] === props.techBarId,
  ),
  loading: state.techBar.appointments.today.loading,
  errors: state.techBar.appointments.today.errors,
  appointments: state.techBar.appointments.today.data,
});

export const mapDispatchToProps = {
  push,
  fetchTodayAppointments: actions.fetchTodayAppointments,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const Display = compose(
  withProps(({ match: { params: { id, mode } } }) => ({
    techBarId: id,
    displayMode: ['checkin', 'survey', 'overhead'].includes(mode)
      ? mode
      : 'checkin',
  })),
  withState('showDetails', 'setShowDetails', null),
  withState('input', 'setInput', ''),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      if (this.props.techBar) {
        this.props.fetchTodayAppointments(this.props.techBarId);
      }
    },
  }),
)(DisplayComponent);
