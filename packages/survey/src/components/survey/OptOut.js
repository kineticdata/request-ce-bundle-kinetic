import React, { Fragment } from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { actions } from '../../redux/modules/surveys';
import { connect } from '../../redux/store';
import { LoadingMessage } from 'common';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';
import { parse } from 'query-string';

export const OptOutComponent = ({
  kapp,
  kappSlug,
  fieldValues,
  form,
  handleFieldChange,
  handleSubmit,
  values,
}) => (
  <div className="page-container">
    {console.log('fv:', fieldValues)}
    {console.log('qv:', values)}
    <PageTitle parts={['Opt Out']} />
    {!form ? (
      <LoadingMessage />
    ) : (
      <Fragment>
        <div className="page-container container">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <I18n>{kapp.name}</I18n> /{' '}
              </h3>
              <h1>
                <I18n>{form.name}</I18n>
              </h1>
            </div>
          </div>
          <div className="form-description">
            <h4>
              <I18n>Opt Out</I18n>
            </h4>
            <p>
              <I18n>
                Please fill out the form below to opt out of future invitations
                to this survey.
              </I18n>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group col-6 required">
              <label htmlFor="emailAddress">
                <I18n>Email Address</I18n>
              </label>
              <input
                type="text"
                id="emailAddress"
                name="emailAddress"
                onChange={handleFieldChange}
                value={fieldValues.emailAddress}
              />
            </div>
            <div className="form-group col-6 required">
              <label htmlFor="confirm">
                <I18n>Confirm Opt Out</I18n>
              </label>
              <input
                type="checkbox"
                id="confirm"
                name="confirm"
                onChange={handleFieldChange}
                value={fieldValues.confirm}
              />
            </div>
            <div className="form__footer">
              <div className="form__footer__left col-6">
                <button
                  type="submit"
                  disabled={!fieldValuesValid(fieldValues)}
                  className="btn btn-primary"
                >
                  <I18n>Submit</I18n>
                </button>
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    )}
  </div>
);

const fieldValuesValid = fieldValues => {
  return fieldValues.emailAddress && fieldValues.confirm === 'true';
};

const valuesFromQueryParams = queryParams => {
  const params = parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};

export const mapStateToProps = state => ({
  kapp: state.app.kapp,
  kappSlug: state.app.kappSlug,
  forms: state.surveyApp.forms,
  appLocation: state.app.location,
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
  values: valuesFromQueryParams(state.router.location.search),
});

export const mapDispatchToProps = {
  submitOptOut: actions.submitOptOut,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    form: props.forms && props.forms.find(form => form.slug === props.slug),
  })),
  withState('form', 'setForm', props => props.form),
  withState('fieldValues', 'setFieldValues', {
    emailAddress: '',
    confirm: 'false',
  }),
  withHandlers({
    handleFieldChange: props => ({ target: { name, value } }) => {
      name && name === 'confirm'
        ? props.setFieldValues({
            ...props.fieldValues,
            [name]: value === (true || 'true') ? 'false' : 'true',
          })
        : props.setFieldValues({ ...props.fieldValues, [name]: value });
    },
    handleSubmit: props => event => {
      event.preventDefault();
      props.submitOptOut(props.fieldValues);
    },
  }),
);

export const OptOut = enhance(OptOutComponent);
