import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { lifecycle, compose, withHandlers } from 'recompose';
import { bundle } from '@kineticdata/react';
import { FormComponents, LoadingMessage } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { I18n, FormForm } from '@kineticdata/react';
import { actions } from '../../redux/modules/settingsDatastore';
import { context } from '../../redux/store';
import { getIn } from 'immutable';

const asArray = value => (value ? [JSON.stringify(value)] : []);

const fieldSet = [
  'name',
  'slug',
  'description',
  'status',
  'submissionLabelExpression',
  'attributesMap',
  'source',
  'type',
  'triggerConditionCode',
  'useCustomWorkflow',
  'scoring',
  'multiLanguageNotifications',
  'lowScoreNotification',
  'sendReminders',
  'invitationNotifications',
  'reminderNotifications',
  'allowOptOut',
  'maxInvitations',
  'eventsRequired',
  'owningTeam',
  'authentication',
  'assignedIndividual',
  'submitter',
];

const FormLayout = ({ fields, error, buttons }) => (
  <Fragment>
    <h2 className="section__title">
      <I18n>General</I18n>
    </h2>
    <div className="form-group__columns">
      {fields.get('name')}
      {fields.get('slug')}
    </div>
    {fields.get('description')}
    {fields.get('status')}
    {fields.get('submissionLabelExpression')}
    {fields.get('useCustomWorkflow')}
    <div className="form-group__columns">
      {fields.get('source')}
      {fields.get('type')}
    </div>
    {fields.get('triggerConditionCode')}
    <br />
    <h2 className="section__title">
      <I18n>Scoring &amp; Delivery</I18n>
    </h2>
    <div className="form-group__columns">
      {fields.get('scoring')}
      {fields.get('lowScoreNotification')}
    </div>
    <div className="form-group__columns">
      {fields.get('multiLanguageNotifications')}
      {fields.get('sendReminders')}
    </div>
    <div className="form-group__columns">
      {fields.get('invitationNotifications')}
      {fields.get('reminderNotifications')}
    </div>
    {fields.get('allowOptOut')}
    <div className="form-group__columns">
      {fields.get('maxInvitations')}
      {fields.get('eventsRequired')}
    </div>
    <br />
    <h2 className="section__title">
      <I18n>Security</I18n>
    </h2>
    <div className="form-group__columns">
      {fields.get('owningTeam')}
      {fields.get('assignedIndividual')}
    </div>
    <div className="form-group__columns">
      {fields.get('authentication')}
      {fields.get('submitter')}
    </div>
    <br />
    {error}
    {buttons}
  </Fragment>
);

const SurveySettingsComponent = ({ kappSlug, canManage, origForm, loading }) =>
  !loading && (
    <I18n context={`datastore.forms.${origForm.slug}`}>
      <div className="page-container page-container--panels">
        <PageTitle parts={['Settings', origForm.name, 'Datastore']} />
        <div className="page-panel page-panel--two-thirds page-panel--white">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="../../">
                  <I18n>survey</I18n>
                </Link>{' '}
                /{` `}
                <Link to="../submissions">
                  <I18n>{origForm.name}</I18n>
                </Link>{' '}
                /{` `}
              </h3>
              <h1>
                <I18n>Settings</I18n>
              </h1>
            </div>
            <a
              href={`${bundle.spaceLocation()}/app/builder/#/forms/${
                origForm.slug
              }/builder`}
              className="btn btn-primary"
              target="_blank"
            >
              <I18n>Form Builder</I18n>{' '}
              <i className="fa fa-fw fa-external-link" />
            </a>
          </div>
          {canManage ? (
            <div className="datastore-settings">
              <div className="form settings">
                <FormForm
                  datastore={true}
                  //   kappSlug={kappSlug}
                  formSlug={origForm.slug}
                  fieldSet={fieldSet}
                  components={{ FormLayout }}
                  addFields={() => ({ form }) => {
                    const surveyConfig =
                      form &&
                      form.getIn([
                        'attributesMap',
                        'Survey Configuration',
                        0,
                      ]) &&
                      JSON.parse(
                        form.getIn([
                          'attributesMap',
                          'Survey Configuration',
                          0,
                        ]),
                      );
                    return (
                      form && [
                        {
                          name: 'source',
                          label: 'Source',
                          type: 'text',
                          helpText: 'System initiating the survey',
                          initialValue: surveyConfig && surveyConfig['Source'],
                        },
                        {
                          name: 'type',
                          label: 'Type',
                          type: 'text',
                          helpText: 'Type of source used to initiate survey',
                          initialValue: surveyConfig && surveyConfig['Type'],
                        },
                        {
                          name: 'triggerConditionCode',
                          label: 'Trigger Condition',
                          type: 'text',
                          helpText:
                            'Qualification or event required to initiate survey',
                          initialValue:
                            surveyConfig && surveyConfig['Trigger Condition'],
                        },
                        {
                          name: 'useCustomWorkflow',
                          label: 'Use Custom Workflow',
                          type: 'checkbox',
                          helpText:
                            'If selected, each survey response will trigger the selected custom workflow',
                          initialValue:
                            surveyConfig && surveyConfig['Use Custom Workflow'],
                        },
                        {
                          name: 'scoring',
                          label: 'Scoring',
                          type: 'checkbox',
                          helpText:
                            'Determines whether or not the survey responses will be scored',
                          initialValue: surveyConfig && surveyConfig['Scoring'],
                        },
                        {
                          name: 'multiLanguageNotifications',
                          label: 'Multi-language Notifications',
                          type: 'checkbox',
                          helpText: 'TBD',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Multi-language Notifications'],
                        },
                        {
                          name: 'lowScoreNotification',
                          label: 'Low Score Notification',
                          type: 'checkbox',
                          helpText:
                            'If the survey receives a low enough score, the survey owner will be notifified',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Low Score Notification'],
                        },
                        {
                          name: 'sendReminders',
                          label: 'Send Reminders',
                          type: 'checkbox',
                          helpText:
                            'Additional invitations will be sent reminding those invited to complete the survey',
                          initialValue:
                            surveyConfig && surveyConfig['Send Reminders'],
                        },
                        {
                          name: 'invitationNotifications',
                          label: 'Invitation Notifications',
                          type: 'checkbox',
                          helpText:
                            'If an invited user exists in the system, they will receive invitations via sytem notifications',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Invitation Notifications'],
                        },
                        {
                          name: 'reminderNotifications',
                          label: 'Reminder Notifications',
                          type: 'checkbox',
                          helpText:
                            'If an invited user exists in the system, they will be sent reminders to complete the survey',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Reminder Notifications'],
                        },
                        {
                          name: 'allowOptOut',
                          label: 'Allow Opt-out',
                          type: 'checkbox',
                          helpText:
                            'Invited users can opt out of receiving future invitations for this survey',
                          initialValue:
                            surveyConfig && surveyConfig['Allow Opt-out'],
                        },
                        {
                          name: 'maxInvitations',
                          label: 'Max Invitations Per User Per Day',
                          type: 'text',
                          helpText:
                            'Maximum number of invitations a user can receive per day',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Max Invitations Per User Per Day'],
                        },
                        {
                          name: 'eventsRequired',
                          label: 'Events Required to Trigger Survey',
                          type: 'text',
                          helpText:
                            'Number of trigger events needed to initiate one invitation',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Events Required to Trigger'],
                        },
                        {
                          name: 'owningTeam',
                          label: 'Owning Team',
                          type: 'text',
                          helpText:
                            'Team will receive notifications regarding this survey',
                          initialValue:
                            surveyConfig && surveyConfig['Owning Team'],
                        },
                        {
                          name: 'authentication',
                          label: 'Authentication',
                          type: 'text',
                          helpText: 'TBD',
                          initialValue:
                            surveyConfig && surveyConfig['Authentication'],
                        },
                        {
                          name: 'assignedIndividual',
                          label: 'Assigned Individual',
                          type: 'text',
                          helpText:
                            'User will receive notifications regarding this survey',
                          initialValue:
                            surveyConfig && surveyConfig['Assigned Individual'],
                        },
                        {
                          name: 'submitter',
                          label: 'Submitter',
                          type: 'text',
                          helpText: 'TBD',
                          initialValue:
                            surveyConfig && surveyConfig['Submitter'],
                        },
                      ]
                    );
                  }}
                  alterFields={{
                    description: { component: FormComponents.TextAreaField },
                    attributesMap: {
                      serialize: ({ values }) => ({
                        'Survey Configuration': asArray({
                          'Use Custom Workflow': values.get(
                            'useCustomWorkflow',
                          ),
                          Source: values.get('source'),
                          Type: values.get('type'),
                          'Trigger Condition': values.get(
                            'triggerConditionCode',
                          ),
                          Scoring: values.get('scoring'),
                          'Multi-language Notifications': values.get(
                            'multiLanguageNotifications',
                          ),
                          'Low Score Notification': values.get(
                            'lowScoreNotification',
                          ),
                          'Send Reminders': values.get('sendReminders'),
                          'Invitation Notifications': values.get(
                            'invitationNotifications',
                          ),
                          'Reminder Notifications': values.get(
                            'reminderNotifications',
                          ),
                          'Allow Opt-out': values.get('allowOptOut'),
                          'Max Invitations Per User Per Day': values.get(
                            'maxInvitations',
                          ),
                          'Events Required to Trigger': values.get(
                            'eventsRequired',
                          ),
                          'Owning Team': values.get('owningTeam'),
                          Authentication: values.get('authentication'),
                          'Assigned Individual': values.get(
                            'assignedIndividual',
                          ),
                          Submitter: values.get('submitter'),
                        }),
                      }),
                    },
                  }}
                >
                  {({ form, initialized }) =>
                    initialized ? (
                      <section className="form">{form}</section>
                    ) : (
                      <LoadingMessage />
                    )
                  }
                </FormForm>
              </div>
            </div>
          ) : (
            <p>
              <I18n>You do not have access to configure this datastore.</I18n>
            </p>
          )}
        </div>
        <div className="page-panel page-panel--one-thirds page-panel--transparent page-panel--sidebar page-panel--datastore-sidebar">
          <h3>
            <I18n>Survey Settings</I18n>
          </h3>
          <p>
            <I18n>
              To update the survey form fields, click the Form Builder button,
              which will open the form builder in a new window. You will need to
              reload this page after making changes in the form builder.
            </I18n>
          </p>
        </div>
      </div>
    </I18n>
  );

const handleSave = ({ updateForm }) => () => () => {
  updateForm();
};

const handleReset = ({ resetForm }) => () => () => {
  resetForm();
};

export const mapStateToProps = (state, { slug }) => ({
  loading: state.settingsDatastore.currentFormLoading,
  canManage: state.settingsDatastore.currentForm.canManage,
  origForm: state.settingsDatastore.currentForm,
  kappSlug: state.app.kappSlug,
  updatedForm: state.settingsDatastore.currentFormChanges,
  formSlug: slug,
  hasChanged: !state.settingsDatastore.currentForm.equals(
    state.settingsDatastore.currentFormChanges,
  ),
  bridges: state.settingsDatastore.bridges,
  bridgeSlug: '',
});

export const mapDispatchToProps = {
  push,
  fetchForm: actions.fetchForm,
  setFormChanges: actions.setFormChanges,
  updateForm: actions.updateForm,
  resetForm: actions.resetForm,
};

export const SurveySettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withHandlers({
    handleSave,
    handleReset,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.formSlug);
      window.addEventListener('focus', this.props.windowFocusListener);
    },
    componentWillUnmount() {
      window.removeEventListener('focus', this.props.windowFocusListener);
    },
  }),
)(SurveySettingsComponent);
