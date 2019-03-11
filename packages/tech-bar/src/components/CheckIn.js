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
  Moment,
  Constants,
} from 'common';
import { DisplayTabs } from './Display';
import { TIME_FORMAT } from '../App';
import { actions } from '../redux/modules/appointments';
import moment from 'moment';
import { CoreForm } from 'react-kinetic-lib';
import { I18n } from '../../../app/src/I18nProvider';

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
                      <div className="card--appointment" key={appt.id}>
                        <div className="details">
                          <div>{appt.values['Requested For Display Name']}</div>
                          <div className="text-muted">
                            <Moment
                              timestamp={moment(
                                appt.values['Event Time'],
                                TIME_FORMAT,
                              )}
                              format={Constants.MOMENT_FORMATS.time}
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
                          <I18n>Check In</I18n>
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
                          <I18n>No appointments found.</I18n>
                        </div>
                      ))}
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => toggleShowDetails(null)}
                >
                  <I18n>Cancel</I18n>
                </button>
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
                <h1>I am a walk-in</h1>
                {!walkInUser && (
                  <div className="form">
                    <div className="form-group">
                      <label htmlFor="walkin-account-select">
                        <I18n>Find Your Account</I18n>
                      </label>
                      <AttributeSelectors.PeopleSelect
                        id="walkin-account-select"
                        users={true}
                        value={[]}
                        valueMapper={value => value.user.username}
                        onChange={e => setWalkInUser(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setWalkInUser(true)}
                      >
                        <I18n>I do not have an account</I18n>
                      </button>
                    </div>
                  </div>
                )}
                {walkInUser && (
                  <I18n context={`kapps.${kapp.slug}.forms.walk-in`}>
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
                  </I18n>
                )}
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => toggleShowDetails(null)}
                >
                  <I18n>Cancel</I18n>
                </button>
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
    fetchTodayAppointments({ schedulerId: techBarId, status: 'Scheduled' });
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
