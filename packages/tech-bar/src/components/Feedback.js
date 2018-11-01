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
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { selectCurrentKapp, toastActions } from 'common';
import { CoreAPI } from 'react-kinetic-core';
import { actions } from '../redux/modules/appointments';

const FEEDBACK_IDENTITY_ATTRIBUTE = 'Feedback Identity';
const FEEDBACK_FORM_SLUG = 'feedback';

export const FeedbackComponent = ({
  kapp,
  techBarId,
  techBar,
  appointments,
  handleExperienceClick,
  experience,
  input,
  setInput,
  addSuccess,
  addError,
  disabled,
  feedbackIdentityRequired,
  resetExperience,
  handleSubmitFeedback,
}) => {
  return (
    <section className="tech-bar-display tech-bar-display__small mb-3">
      <div className="details-container">
        <div className="header bg-dark text-white">
          How was your experience?
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
                Cancel
              </button>
              <span>Tell Us Who You Are</span>
            </h4>
          </div>
          <ModalBody>
            <div className="form">
              <div
                className={`form-group ${
                  feedbackIdentityRequired ? 'required' : ''
                }`}
              >
                <label htmlFor="email-input">
                  Email{feedbackIdentityRequired ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ' (Optional)'
                  )}
                </label>
                <input
                  type="text"
                  name="email-input"
                  id="email-input"
                  className="form-control"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-primary"
              disabled={feedbackIdentityRequired && !/^.+@.+\..+$/.test(input)}
              onClick={() => handleSubmitFeedback()}
            >
              Submit Feedback
            </button>
          </ModalFooter>
        </Modal>
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

const getFilteredAppointments = ({ input, appointments }) => () =>
  appointments.filter(
    appt =>
      appt.values['Requested For Display Name']
        .toLowerCase()
        .includes(input.toLowerCase()) ||
      appt.values['Requested For'].toLowerCase().includes(input.toLowerCase()),
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
}) => value => {
  if (feedbackIdentityAvailable) {
    setExperience(value);
  } else {
    handleSubmitFeedback({ Experience: value });
  }
};

const handleSubmitFeedback = ({
  kapp,
  experience,
  input,
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
      Username: input,
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
  withState('disabled', 'setDisabled', false),
  withHandlers({ resetExperience }),
  withHandlers({
    getFilteredAppointments,
    handleSubmitFeedback,
  }),
  withHandlers({ handleExperienceClick }),
  lifecycle({
    componentDidMount() {
      this.props.fetchTodayAppointments(this.props.techBarId);
    },
  }),
)(FeedbackComponent);
