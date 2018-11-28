import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
  withProps,
} from 'recompose';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { selectCurrentKapp, toastActions } from 'common';
import { CoreAPI } from 'react-kinetic-core';
import { actions as appointmentActions } from '../redux/modules/appointments';
import { actions as walkInActions } from '../redux/modules/walkIns';
import { I18n } from '../../../app/src/I18nProvider';

const FEEDBACK_IDENTITY_ATTRIBUTE = 'Feedback Identity';
const FEEDBACK_FORM_SLUG = 'feedback';

export const FeedbackComponent = ({
  kapp,
  techBarId,
  techBar,
  loading,
  getFilteredAppointments,
  handleExperienceClick,
  experience,
  input,
  setInput,
  appointmentId,
  setAppointmentId,
  addSuccess,
  addError,
  disabled,
  feedbackIdentityRequired,
  resetExperience,
  handleAppointmentSelect,
  handleSubmitFeedback,
}) => {
  const filteredAppointments =
    experience && input.length > 2 ? getFilteredAppointments() : null;
  return (
    <section className="tech-bar-display tech-bar-display__small mb-3">
      <div className="details-container">
        <div className="header bg-dark text-white">
          <I18n>How was your experience?</I18n>
        </div>
        <div className="form body">
          <div className="experience-options my-5">
            <button
              type="button"
              className="btn btn-success"
              disabled={disabled}
              onClick={() => handleExperienceClick('Positive')}
            >
              <span className="fa fa-smile-o" />
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={disabled}
              onClick={() => handleExperienceClick('Negative')}
            >
              <span className="fa fa-frown-o" />
            </button>
          </div>
          <div className="form-group" />
        </div>
      </div>
      {experience && (
        <Modal
          isOpen={!!experience}
          toggle={resetExperience}
          size="md"
          className="feedback-identity-modal"
        >
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                type="button"
                className="btn btn-link"
                onClick={resetExperience}
              >
                <I18n>Cancel</I18n>
              </button>
              <span>
                <I18n>Tell Us Who You Are</I18n>
              </span>
            </h4>
          </div>
          <ModalBody>
            <div className="form">
              <div
                className={`form-group ${
                  feedbackIdentityRequired ? 'required' : ''
                }`}
              >
                <label htmlFor="appointment-search-input">
                  <I18n>Find Your Appointment by Name or Email</I18n>
                  {feedbackIdentityRequired ? (
                    <span className="text-danger">*</span>
                  ) : (
                    <span>
                      ( <I18n>Optional</I18n>)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="appointment-search-input"
                  id="appointment-search-input"
                  className="form-control"
                  autoComplete="off"
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    setAppointmentId('');
                  }}
                />
              </div>
              {filteredAppointments && (
                <div className="form-group">
                  {filteredAppointments.map(appt => (
                    <div
                      className={`card--appointment ${
                        appointmentId === appt.id ? 'selected' : ''
                      }`}
                      key={appt.id}
                    >
                      <div className="details">
                        <div>{appt.displayName}</div>
                        <div className="text-muted">
                          <I18n>{appt.type}</I18n>
                        </div>
                      </div>
                      {appointmentId !== appt.id && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setAppointmentId(appt.id)}
                        >
                          <I18n>Select</I18n>
                        </button>
                      )}
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
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-primary"
              disabled={feedbackIdentityRequired && !appointmentId}
              onClick={() => handleSubmitFeedback()}
            >
              <I18n>Submit Feedback</I18n>
            </button>
          </ModalFooter>
        </Modal>
      )}
    </section>
  );
};

export const mapStateToProps = (state, props) => ({
  kapp: selectCurrentKapp(state),
  loading:
    state.techBar.appointments.today.loading ||
    state.techBar.walkIns.today.loading,
  errors: [
    ...state.techBar.appointments.today.errors,
    ...state.techBar.walkIns.today.errors,
  ],
  appointments: state.techBar.appointments.today.data,
  walkIns: state.techBar.walkIns.today.data,
  records: state.techBar.appointments.today.data
    .map(a => ({
      id: a.id,
      type: 'Appointment',
      username: a.values['Requested For'],
      displayName: a.values['Requested For Display Name'],
    }))
    .concat(
      state.techBar.walkIns.today.data.map(w => ({
        id: w.id,
        type: 'Walk-In',
        username: w.values['Requested For'] || w.values['Email'],
        displayName:
          w.values['Requested For Display Name'] ||
          `${w.values['First Name']} ${w.values['Last Name']}`,
      })),
    ),
});

export const mapDispatchToProps = {
  push,
  fetchTodayAppointments: appointmentActions.fetchTodayAppointments,
  fetchTodayWalkIns: walkInActions.fetchTodayWalkIns,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

const getFilteredAppointments = ({ input, records }) => () =>
  records.filter(
    appt =>
      appt.username.toLowerCase().includes(input.toLowerCase()) ||
      appt.displayName.toLowerCase().includes(input.toLowerCase()),
  );

const resetExperience = ({
  experience,
  setExperience,
  input,
  setInput,
}) => () => {
  setExperience('');
  setInput('');
};

const handleExperienceClick = ({
  feedbackIdentityAvailable,
  setExperience,
  handleSubmitFeedback,
  techBarId,
  fetchTodayAppointments,
  fetchTodayWalkIns,
}) => value => {
  if (feedbackIdentityAvailable) {
    setExperience(value);
    fetchTodayAppointments(techBarId);
    fetchTodayWalkIns(techBarId);
  } else {
    handleSubmitFeedback({ Experience: value });
  }
};

const handleSubmitFeedback = ({
  kapp,
  experience,
  appointmentId,
  resetExperience,
  addError,
  addSuccess,
  setDisabled,
}) => values => {
  CoreAPI.createSubmission({
    kappSlug: kapp.slug,
    formSlug: FEEDBACK_FORM_SLUG,
    values: values || {
      Experience: experience,
      'Appointment Id': appointmentId,
    },
    completed: true,
  }).then(({ submission, errors, serverError }) => {
    if (serverError || errors) {
      addError(
        'There was an error while submitting your feedback. Please consult an administrator.',
      );
    } else {
      addSuccess('Your feedback has been submitted.', 'Thank You');
      setDisabled(true);
      setTimeout(() => setDisabled(false), 4000);
    }
    resetExperience();
  });
};

export const Feedback = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ techBar, kapp }) => {
    const feedbackIdentityAttribute = kapp.attributes.find(
      attr => attr.name === FEEDBACK_IDENTITY_ATTRIBUTE,
    );
    return {
      techBarId: techBar.values['Id'],
      feedbackIdentityAvailable:
        !!feedbackIdentityAttribute &&
        (feedbackIdentityAttribute.values[0] === 'Required' ||
          feedbackIdentityAttribute.values[0] === 'Optional'),
      feedbackIdentityRequired:
        !!feedbackIdentityAttribute &&
        feedbackIdentityAttribute.values[0] === 'Required',
    };
  }),
  withState('experience', 'setExperience', null),
  withState('input', 'setInput', ''),
  withState('appointmentId', 'setAppointmentId', ''),
  withState('disabled', 'setDisabled', false),
  withHandlers({ resetExperience }),
  withHandlers({
    getFilteredAppointments,
    handleSubmitFeedback,
  }),
  withHandlers({ handleExperienceClick }),
)(FeedbackComponent);
