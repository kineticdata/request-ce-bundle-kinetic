import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose, withHandlers, withState, withProps } from 'recompose';
import {
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  TaskActions,
  addToastAlert,
} from 'common';

import { DisplayTabs } from './Display';
import { TIME_FORMAT } from '../constants';
import { actions } from '../redux/modules/appointments';
import moment from 'moment';
import { CoreForm, Moment, I18n } from '@kineticdata/react';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const CheckInComponent = ({
  crosslink,
  kapp,
  techBarId,
  techBar,
  appointments,
  error,
  showDetails,
  toggleShowDetails,
  input,
  setInput,
  getFilteredAppointments,
}) => {
  const filteredAppointments =
    showDetails === 'appointment' && input.length > 2
      ? getFilteredAppointments()
      : null;
  return (
    <section className="tech-bar-display tech-bar-display--checkin">
      {!showDetails ? (
        <Fragment>
          <div className="full-screen-container">
            {crosslink && (
              <DisplayTabs
                techBarId={techBarId}
                checkInClassName={'bg-dark'}
                onClick={() => toggleShowDetails(null)}
              />
            )}
            <div className="header bg-dark" />
            <div className="body">
              <div className="form">
                <button
                  type="button"
                  className="btn btn--checkin btn-success"
                  onClick={() => toggleShowDetails('appointment')}
                >
                  <I18n>I have an appointment</I18n>
                </button>
                {techBar.settings.allowWalkIns && (
                  <button
                    type="button"
                    className="btn btn--checkin btn-info"
                    onClick={() => toggleShowDetails('walkin')}
                  >
                    <I18n>I am a walk-in</I18n>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          {showDetails === 'appointment' && (
            <div className="full-screen-container">
              {crosslink && (
                <DisplayTabs
                  techBarId={techBarId}
                  checkInClassName={'bg-success'}
                  onClick={() => toggleShowDetails(null)}
                />
              )}
              <div className="header bg-success" />
              <div className="body">
                <h1>
                  <I18n>I have an appointment</I18n>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => toggleShowDetails(null)}
                  >
                    <I18n>Cancel</I18n>
                  </button>
                </h1>

                <div className="form">
                  <div className="form-group">
                    <label htmlFor="appointment-search-input">
                      <I18n>Find Appointment by Name or Email</I18n>
                    </label>
                    <input
                      type="text"
                      name="appointment-search-input"
                      id="appointment-search-input"
                      className="form-control"
                      autoComplete="off"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                    />
                  </div>
                </div>

                {filteredAppointments && (
                  <div className="form-group">
                    {filteredAppointments.map(appt => (
                      <div className="tech-bar-appointment-card" key={appt.id}>
                        <div className="details">
                          <div>{appt.values['Requested For Display Name']}</div>
                          <div className="text-muted">
                            <Moment
                              timestamp={moment(
                                appt.values['Event Time'],
                                TIME_FORMAT,
                              )}
                              format={Moment.formats.time}
                            />
                            {' - '}
                            <I18n>{appt.values['Event Type']}</I18n>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            TaskActions.createAction({
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
                                toggleShowDetails(null);
                                addToastAlert({
                                  severity: 'success',
                                  title: `${
                                    appt.values['Requested For Display Name']
                                  } has been successfully checked in.`,
                                  duration: 5000,
                                });
                              },
                              errorCallback: () => {
                                toggleShowDetails(null);
                                addToastAlert({
                                  title:
                                    'There was an error while checking you in.',
                                  duration: 5000,
                                });
                              },
                            })
                          }
                        >
                          <I18n>Check In</I18n>
                        </button>
                      </div>
                    ))}
                    {filteredAppointments.size === 0 &&
                      (!error && !appointments ? (
                        <div className="text-center">
                          <span className="fa fa-spinner fa-spin" />
                        </div>
                      ) : (
                        <div className="alert alert-warning text-center">
                          <I18n>No appointments found.</I18n>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {showDetails === 'walkin' && (
            <div className="full-screen-container">
              {crosslink && (
                <DisplayTabs
                  techBarId={techBarId}
                  checkInClassName={'bg-info'}
                  onClick={() => toggleShowDetails(null)}
                />
              )}
              <div className="header bg-info" />
              <div className="body">
                <h1>
                  <I18n>I am a walk-in</I18n>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => toggleShowDetails(null)}
                  >
                    <I18n>Cancel</I18n>
                  </button>
                </h1>
                <I18n context={`kapps.${kapp.slug}.forms.walk-in`}>
                  <CoreForm
                    className="body"
                    kapp={kapp.slug}
                    form="walk-in"
                    globals={globals}
                    values={{
                      'Scheduler Id': techBarId,
                    }}
                    completed={() => {
                      toggleShowDetails(null);
                      addToastAlert({
                        severity: 'success',
                        title: 'You have successfully checked in.',
                        duration: 5000,
                      });
                    }}
                    notFoundComponent={ErrorNotFound}
                    unauthorizedComponent={ErrorUnauthorized}
                    unexpectedErrorComponent={ErrorUnexpected}
                  />
                </I18n>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </section>
  );
};

export const mapStateToProps = (state, props) => ({
  kapp: state.app.kapp,
  error: state.appointments.error,
  appointments: state.appointments.today,
});

export const mapDispatchToProps = {
  fetchTodayAppointmentsRequest: actions.fetchTodayAppointmentsRequest,
};

const toggleShowDetails = ({
  showDetails,
  setShowDetails,
  setInput,
  fetchTodayAppointmentsRequest,
  techBarId,
}) => name => {
  setShowDetails(showDetails === name ? null : name);
  setInput('');
  if (name === 'appointment') {
    fetchTodayAppointmentsRequest({
      schedulerId: techBarId,
      status: 'Scheduled',
    });
  }
};

const getFilteredAppointments = ({ input, appointments }) => () =>
  appointments
    ? appointments.filter(
        appt =>
          appt.values['Requested For Display Name']
            .toLowerCase()
            .includes(input.toLowerCase()) ||
          appt.values['Requested For']
            .toLowerCase()
            .includes(input.toLowerCase()),
      )
    : null;

export const CheckIn = compose(
  withProps(({ techBar }) => ({
    techBarId: techBar.values['Id'],
  })),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('showDetails', 'setShowDetails', null),
  withState('input', 'setInput', ''),
  withHandlers({
    toggleShowDetails,
    getFilteredAppointments,
  }),
)(CheckInComponent);
