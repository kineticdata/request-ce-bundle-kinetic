import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { I18n } from '../../I18nProvider';

import { CoreAPI } from 'react-kinetic-core';

const CreateAccount = ({
  submitted,
  toSignIn,
  routed,
  email,
  handleEmail,
  firstName,
  handleFirstName,
  lastName,
  handleLastName,
  phone,
  handlePhone,
  comments,
  handleComments,
  formValid,
  handleSubmit,
}) =>
  submitted ? (
    <div className="login-form-container">
      <div className="submitted">
        <h3 className="form-title">
          <I18n>Create Account</I18n>
        </h3>
        <p className="subtitle">
          <I18n>Your request for a new account has been received.</I18n>
        </p>
        <p className="explaination">
          <I18n>
            Your request for a new account is being reviewed by the team. Once
            approved you will receive an email with further instructions.
          </I18n>
        </p>
      </div>
    </div>
  ) : (
    <form className="login-form-container" onSubmit={handleSubmit}>
      <div>
        <h3 className="form-title">
          <I18n>Create Account</I18n>
        </h3>

        <div className="name-section">
          <div className="form-group">
            <label className="required">
              <I18n>First Name</I18n>
            </label>
            <input
              autoFocus
              className="form-control"
              type="text"
              value={firstName}
              onChange={handleFirstName}
            />
          </div>
          <div className="form-group">
            <label className="required">
              <I18n>Last Name</I18n>
            </label>
            <input
              className="form-control"
              type="text"
              value={lastName}
              onChange={handleLastName}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="required">
            <I18n>Email</I18n>
          </label>
          <input
            className="form-control"
            type="text"
            value={email}
            onChange={handleEmail}
          />
        </div>
        <div className="form-group">
          <label>
            <I18n>Phone Number</I18n>
          </label>
          <input className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label>
            <I18n>Comments</I18n>
          </label>
          <input className="form-control" type="text" />
        </div>
      </div>
      <div className="button-group">
        <button className="btn btn-primary" type="submit" disabled={!formValid}>
          <I18n>Request Account</I18n>
        </button>
        <hr />
        <button
          className="btn btn-link"
          type="button"
          onClick={toSignIn(routed)}
        >
          &larr; <I18n>Back to Sign In</I18n>
        </button>
      </div>
    </form>
  );

const validateForm = ({ setFormValid, firstName, lastName, email }) => () =>
  setFormValid(firstName.length > 0 && lastName.length > 0 && email.length > 0);

const handleFirstName = ({ setFirstName, validateForm }) => e => {
  setFirstName(e.target.value);
  validateForm();
};
const handleLastName = ({ setLastName, validateForm }) => e => {
  setLastName(e.target.value);
  validateForm();
};
const handlePhone = ({ setPhone, validateForm }) => e => {
  setPhone(e.target.value);
};
const handleComments = ({ setComments }) => e => setComments(e.target.value);
const handleEmail = ({ setEmail, validateForm }) => e => {
  setEmail(e.target.value);
  validateForm();
};
const handleSubmit = ({
  firstName,
  lastName,
  email,
  phone,
  comments,
  setSubmitted,
  setError,
}) => async e => {
  e.preventDefault();

  try {
    await CoreAPI.createSubmission({
      kappSlug: 'admin',
      formSlug: 'kinops-account-request',
      values: {
        'First Name': firstName,
        'Last Name': lastName,
        Email: email,
        'Phone Number': phone,
        Comments: comments,
      },
      authAssumed: false,
    });

    setSubmitted(true);
  } catch (e) {
    setError(
      'There was a problem requesting your new account. Please verify the information you entered.',
    );
  }
};

export const CreateAccountForm = compose(
  withState('submitted', 'setSubmitted', false),
  withState('error', 'setError', ''),
  withState('firstName', 'setFirstName', ''),
  withState('lastName', 'setLastName', ''),
  withState('phone', 'setPhone', ''),
  withState('comments', 'setComments', ''),
  withState('formValid', 'setFormValid', false),
  withHandlers({
    validateForm,
  }),
  withHandlers({
    handleFirstName,
    handleLastName,
    handlePhone,
    handleComments,
    handleEmail,
    handleSubmit,
  }),
)(CreateAccount);
