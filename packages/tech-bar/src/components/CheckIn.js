import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withState, withProps } from 'recompose';
import {
  selectCurrentKapp,
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  toastActions,
  TaskActions,
  AttributeSelectors,
} from 'common';
import { TIME_FORMAT, TIME_DISPLAY_FORMAT } from '../App';
import { actions } from '../redux/modules/appointments';
import moment from 'moment';
import { CoreForm } from 'react-kinetic-core';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const CheckInComponent = ({
  kapp,
  techBarId,
  techBar,
  loading,
  appointments,
  showDetails,
  toggleShowDetails,
  input,
  setInput,
  walkInUser,
  setWalkInUser,
  getFilteredAppointments,
  addSuccess,
  addError,
}) => {
  const filteredAppointments =
    showDetails === 'appointment' && input.length > 2
      ? getFilteredAppointments()
      : null;
  return (
    <section className="tech-bar-display tech-bar-display__small mb-3">
      {!showDetails ? (
        <Fragment>
          <button
            type="button"
            className="check-in-option btn btn-success mb-5"
            onClick={() => toggleShowDetails('appointment')}
          >
            I have an appointment
          </button>
          <button
            type="button"
            className="check-in-option btn btn-info"
            onClick={() => toggleShowDetails('walkin')}
          >
            I am a walk-in
          </button>
        </Fragment>
      ) : (
        <Fragment>
          {showDetails === 'appointment' && (
            <div className="details-container">
              <div className="header bg-success text-white">
                I have an appointment
                <button
                  type="button"
                  className="btn btn-link text-white"
                  onClick={() => toggleShowDetails(null)}
                >
                  Cancel
                </button>
              </div>
              <div className="form body">
                <div className="form-group">
                  <label htmlFor="appointment-search-input">
                    Find Appointment by Name or Email
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
                {filteredAppointments && (
                  <div className="form-group">
                    {filteredAppointments.map(appt => (
                      <div className="card--appointment" key={appt.id}>
                        <div className="details">
                          <div>{appt.values['Requested For Display Name']}</div>
                          <div className="text-muted">
                            {moment(
                              appt.values['Event Time'],
                              TIME_FORMAT,
                            ).format(TIME_DISPLAY_FORMAT)}
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
                                addSuccess(
                                  `${
                                    appt.values['Requested For Display Name']
                                  } has been successfully checked in.`,
                                );
                              },
                              errorCallback: () => {
                                toggleShowDetails(null);
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
                    {filteredAppointments.size === 0 &&
                      (loading ? (
                        <div className="text-center">
                          <span className="fa fa-spinner fa-spin" />
                        </div>
                      ) : (
                        <div className="alert alert-warning text-center">
                          No appointments found.
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {showDetails === 'walkin' && (
            <div className="details-container">
              <div className="header bg-info text-white">
                I am a walk-in
                <button
                  type="button"
                  className="btn btn-link text-white"
                  onClick={() => toggleShowDetails(null)}
                >
                  Cancel
                </button>
              </div>
              <div className="body">
                {!walkInUser && (
                  <div className="form">
                    <div className="form-group">
                      <label htmlFor="walkin-account-select">
                        Find Your Account
                      </label>
                      <AttributeSelectors.PeopleSelect
                        id="walkin-account-select"
                        users={true}
                        value={[]}
                        valueMapper={value => value.user.username}
                        onChange={e => setWalkInUser(e.target.value)}
                      />
                    </div>
                    <div className="form-group text-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setWalkInUser(true)}
                      >
                        I do not have an account
                      </button>
                    </div>
                  </div>
                )}
                {walkInUser && (
                  <CoreForm
                    className="body"
                    kapp={kapp.slug}
                    form="walk-in"
                    globals={globals}
                    values={{
                      'Scheduler Id': techBarId,
                      'Requested For': walkInUser !== true ? walkInUser : '',
                    }}
                    completed={() => {
                      toggleShowDetails(null);
                      addSuccess(`You have successfully checked in.`);
                    }}
                    notFoundComponent={ErrorNotFound}
                    unauthorizedComponent={ErrorUnauthorized}
                    unexpectedErrorComponent={ErrorUnexpected}
                  />
                )}
              </div>
            </div>
          )}
        </Fragment>
      )}
    </section>
  );
};

export const mapStateToProps = (state, props) => ({
  kapp: selectCurrentKapp(state),
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

const toggleShowDetails = ({
  showDetails,
  setShowDetails,
  setInput,
  setWalkInUser,
  fetchTodayAppointments,
  techBarId,
}) => name => {
  setShowDetails(showDetails === name ? null : name);
  setInput('');
  setWalkInUser(null);
  if (name === 'appointment') {
    fetchTodayAppointments(techBarId);
  }
};

const getFilteredAppointments = ({ input, appointments }) => () =>
  appointments.filter(
    appt =>
      appt.values['Requested For Display Name']
        .toLowerCase()
        .includes(input.toLowerCase()) ||
      appt.values['Requested For'].toLowerCase().includes(input.toLowerCase()),
  );

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
  withState('walkInUser', 'setWalkInUser', null),
  withHandlers({
    toggleShowDetails,
    getFilteredAppointments,
  }),
)(CheckInComponent);
