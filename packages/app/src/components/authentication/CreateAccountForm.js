import React from 'react';
import { compose, withProps, withState, withHandlers } from 'recompose';
import { Map } from 'immutable';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { bundle } from '@kineticdata/react';
import { I18n } from '../../I18nProvider';

const CreateAccount = ({
  location,
  error,
  submitted,
  email,
  handleEmail,
  password,
  handlePassword,
  values,
  handleChange,
  formValid,
  handleSubmit,
}) => (
  <form className="login-form-container" onSubmit={handleSubmit}>
    <div>
      <h3 className="form-title">
        <I18n>Get Started</I18n>
      </h3>
      {error && <p className="alert alert-danger">{error}</p>}
      <div className="name-section">
        <div className="form-group">
          <label htmlFor="firstName" className="required">
            <I18n>First Name</I18n>
          </label>
          <input
            autoFocus
            className="form-control"
            id="firstName"
            type="text"
            value={values.get('firstName')}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName" className="required">
            <I18n>Last Name</I18n>
          </label>
          <input
            className="form-control"
            id="lastName"
            type="text"
            value={values.get('lastName')}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="email" className="required">
          <I18n>Email</I18n>
        </label>
        <input
          className="form-control"
          id="email"
          type="text"
          value={email}
          onChange={handleEmail}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="required">
          <I18n>Password</I18n>
        </label>
        <input
          className="form-control"
          id="password"
          type="password"
          value={password}
          onChange={handlePassword}
        />
      </div>
      <div className="form-group">
        <label htmlFor="passwordConfirmation" className="required">
          <I18n>Password Confirmation</I18n>
        </label>
        <input
          className="form-control"
          id="passwordConfirmation"
          type="password"
          value={values.get('passwordConfirmation')}
          onChange={handleChange}
        />
      </div>
    </div>
    <div className="button-group">
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!formValid || submitted}
      >
        <I18n>Accept Invitation</I18n>
      </button>
      <hr />
      <Link className="btn btn-link" to={`/login${location.search}`}>
        <I18n>Already have an account? Login</I18n>
      </Link>
    </div>
  </form>
);

const validateForm = props =>
  props.values.get('firstName').length > 0 &&
  props.values.get('lastName').length > 0 &&
  props.email.length > 0 &&
  props.password.length > 0 &&
  props.values.get('passwordConfirmation').length > 0 &&
  props.password === props.values.get('passwordConfirmation');

const handleChange = props => event => {
  const field = event.target.id;
  const value = event.target.value;
  props.setSubmitted(false);
  props.setValues(values => values.set(field, value));
};

const handleSubmit = ({
  values,
  email,
  password,
  invitationToken,
  setSubmitted,
  setError,
  handleLogin,
}) => async event => {
  event.preventDefault();
  setSubmitted(true);
  try {
    await axios.post(`${bundle.apiLocation()}/users?token=${invitationToken}`, {
      username: email,
      email,
      password,
      displayName: `${values.get('firstName')} ${values.get('lastName')}`,
      invitationToken,
    });
    handleLogin();
  } catch (error) {
    const errorMessage =
      error.response.status === 404
        ? 'Invitation expired.'
        : error.response.status === 400
          ? error.response.data.error
          : '';
    setError(`There was a problem creating your new account. ${errorMessage}`);
  }
};

export const CreateAccountForm = compose(
  withState('submitted', 'setSubmitted', false),
  withState('error', 'setError', ''),
  withState(
    'values',
    'setValues',
    Map({
      firstName: '',
      lastName: '',
      phone: '',
      passwordConfirmation: '',
    }),
  ),
  withProps(props => ({
    formValid: validateForm(props),
  })),
  withHandlers({
    handleChange,
    handleSubmit,
  }),
)(CreateAccount);
