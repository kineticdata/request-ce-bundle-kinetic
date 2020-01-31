import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { bundle, buildBindings } from '@kineticdata/react';
import { FormComponents, LoadingMessage, Utils } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { I18n, FormForm } from '@kineticdata/react';
import { actions } from '../../redux/modules/settingsDatastore';
import { actions as notificationsActions } from '../../redux/modules/settingsNotifications';
import { context } from '../../redux/store';

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
  // 'scoring',
  // 'lowScoreNotification',
  // 'lowScoreNotificationConfig',
  'eventsRequired',
  'invitationNotification',
  'invitationNotificationSelect',
  'reminderNotifications',
  'reminderNotificationsNumber',
  'reminderNotificationsInterval',
  'multiLanguageNotifications',
  'maxInvitationsNumber',
  'maxInvitationsInterval',
  'allowOptOut',
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
    {/* <h2 className="section__title">
      <I18n>Scoring</I18n>
    </h2> */}
    {/* {fields.get('scoring')} */}
    {/* {fields.get('lowScoreNotification')} */}
    {/* {fields.get('lowScoreNotificationSelect')} */}
    {/* <br /> */}
    <h2 className="section__title">
      <I18n>Delivery</I18n>
    </h2>
    {fields.get('eventsRequired')}
    {fields.get('invitationNotification')}
    {fields.get('invitationNotificationSelect')}
    {fields.get('reminderNotifications')}
    <div className="form-group__columns">
      {fields.get('reminderNotificationsNumber')}
      {fields.get('reminderNotificationsInterval')}
    </div>
    {fields.get('multiLanguageNotifications')}
    <div className="survey-settings-label">
      <I18n>Maximum Invitations Per User</I18n>
    </div>
    <div className="form-group__columns">
      {fields.get('maxInvitationsNumber')}
      {fields.get('maxInvitationsInterval')}
    </div>
    {fields.get('allowOptOut')}
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

const SurveySettingsComponent = ({
  kappSlug,
  canManage,
  origForm,
  loading,
  taskSourceName,
  templates,
  snippets,
}) => {
  const WorkflowField = FormComponents.WorkflowField({
    taskSourceName,
    kappSlug: kappSlug,
    formSlug: origForm.slug,
  });

  const notificationOptions =
    !!templates &&
    !!snippets &&
    templates
      .map(t => ({
        value: t.values['Name'],
        label: `Template: ${t.values['Name']}`,
      }))
      .concat(
        snippets.map(s => ({
          value: s.values['Name'],
          label: `Snippet: ${s.values['Name']}`,
        })),
      );

  return (
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
                    formSlug={origForm.slug}
                    // kappSlug={kappSlug}
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
                            initialValue:
                              surveyConfig && surveyConfig['Source'],
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
                            type: 'code',
                            language: 'js-template',
                            helpText:
                              'Qualification or event required to initiate survey',
                            initialValue:
                              surveyConfig && surveyConfig['Trigger Condition'],
                            options: ({ space, kapp, form }) =>
                              buildBindings({
                                space,
                                kapp,
                                form,
                                scope: 'Datastore Submission',
                              }),
                          },
                          {
                            name: 'useCustomWorkflow',
                            type: 'checkbox',
                            helpText:
                              'If selected, each survey response will trigger the selected custom workflow',
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Use Custom Workflow'],
                            component: WorkflowField,
                          },
                          // {
                          //   name: 'scoring',
                          //   label: 'Scoring',
                          //   type: 'checkbox',
                          //   helpText:
                          //     'Determines whether or not the survey responses will be scored',
                          //   initialValue:
                          //     surveyConfig && surveyConfig['Scoring'],
                          // },
                          // {
                          //   name: 'lowScoreNotification',
                          //   label: 'Low Score Notification',
                          //   type: 'checkbox',
                          //   visible: ({ values }) => values.get('scoring'),
                          //   transient: ({ values }) => !values.get('scoring'),
                          //   helpText:
                          //     'If the survey receives a low enough score, the survey owner will be notifified',
                          //   initialValue:
                          //     surveyConfig &&
                          //     surveyConfig['Low Score Notification']['active'],
                          // },
                          // {
                          //   name: 'lowScoreNotificationConfig',
                          //   label: 'TBD',
                          //   type: 'text',
                          //   visible: ({ values }) => values.get('lowScoreNotification'),
                          //   transient: ({ values }) => !values.get('lowScoreNotification'),
                          //   helpText: '',
                          //   initialValue:
                          //     surveyConfig &&
                          //     surveyConfig['Low Score Notification']['config'],
                          // },
                          {
                            name: 'eventsRequired',
                            label:
                              'Events Required to Trigger Survey Invitation',
                            type: 'text',
                            helpText:
                              'Number of trigger events needed to initiate one invitation',
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Events Required to Trigger'],
                          },
                          {
                            name: 'invitationNotification',
                            label: 'Invitation Notification',
                            type: 'checkbox',
                            helpText:
                              'If an invited user exists in the system, they will receive the invitation via sytem notifications',
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Invitation Notification']['active'],
                          },
                          {
                            name: 'invitationNotificationSelect',
                            label: 'Notification',
                            type: 'select',
                            visible: ({ values }) =>
                              values.get('invitationNotification'),
                            required: ({ values }) =>
                              values.get('invitationNotification'),
                            transient: ({ values }) =>
                              !values.get('invitationNotification'),
                            helpText:
                              'Notification template to use for invitations',
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Invitation Notification'][
                                'notification'
                              ],
                            options: notificationOptions,
                          },
                          {
                            name: 'reminderNotifications',
                            label: 'Reminder Notifications',
                            type: 'checkbox',
                            helpText:
                              'If an invited user exists in the system, they will be sent reminders to complete the survey',
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Reminder Notifications']['active'],
                          },
                          {
                            name: 'reminderNotificationsNumber',
                            label: 'Number',
                            type: 'text',
                            visible: ({ values }) =>
                              values.get('reminderNotifications'),
                            required: ({ values }) =>
                              values.get('reminderNotifications'),
                            transient: ({ values }) =>
                              !values.get('reminderNotifications'),
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Reminder Notifications']['number'],
                          },
                          {
                            name: 'reminderNotificationsInterval',
                            label: 'Interval',
                            type: 'select',
                            visible: ({ values }) =>
                              values.get('reminderNotifications'),
                            required: ({ values }) =>
                              values.get('reminderNotifications'),
                            transient: ({ values }) =>
                              !values.get('reminderNotifications'),
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Reminder Notifications'][
                                'interval'
                              ],
                            options: ['Day', 'Week', 'Month'].map(s => ({
                              label: s,
                              value: s,
                            })),
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
                            name: 'maxInvitationsNumber',
                            label: 'Number',
                            type: 'text',
                            helpText:
                              'Maximum number of invitations a user can receive',
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Max Invitations Per User'][
                                'number'
                              ],
                          },
                          {
                            name: 'maxInvitationsInterval',
                            label: 'Interval',
                            type: 'select',
                            helpText: 'Per the selected interval',
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Max Invitations Per User'][
                                'interval'
                              ],
                            options: ['Day', 'Week', 'Month'].map(s => ({
                              label: s,
                              value: s,
                            })),
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
                            name: 'owningTeam',
                            label: 'Owning Team',
                            type: 'team',
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
                            type: 'user',
                            helpText:
                              'User will receive notifications regarding this survey',
                            initialValue:
                              surveyConfig &&
                              surveyConfig['Assigned Individual'],
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
                            // Scoring: values.get('scoring'),
                            // 'Low Score Notification': {
                            //   active: values.get('lowScoreNotification'),
                            //   // config: values.get('lowScoreNotificationConfig'),
                            // },
                            'Events Required to Trigger': values.get(
                              'eventsRequired',
                            ),
                            'Invitation Notification': {
                              active: values.get('invitationNotification'),
                              notification: values.get(
                                'invitationNotificationSelect',
                              ),
                            },
                            'Reminder Notifications': {
                              active: values.get('reminderNotifications'),
                              number: values.get('reminderNotificationsNumber'),
                              interval: values.get(
                                'reminderNotificationsInterval',
                              ),
                            },
                            'Multi-language Notifications': values.get(
                              'multiLanguageNotifications',
                            ),
                            'Max Invitations Per User': {
                              number: values.get('maxInvitationsNumber'),
                              interval: values.get('maxInvitationsInterval'),
                            },
                            'Allow Opt-out': values.get('allowOptOut'),
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
                which will open the form builder in a new window. You will need
                to reload this page after making changes in the form builder.
              </I18n>
            </p>
          </div>
        </div>
      </I18n>
    )
  );
};

export const mapStateToProps = (state, { slug }) => ({
  loading:
    state.settingsDatastore.currentFormLoading ||
    state.settingsNotifications.loading,
  canManage: state.settingsDatastore.currentForm.canManage,
  origForm: state.settingsDatastore.currentForm,
  kappSlug: state.app.kappSlug,
  formSlug: slug,
  taskSourceName: Utils.getAttributeValue(state.app.space, 'Task Source Name'),
  templates: state.settingsNotifications.notificationTemplates,
  snippets: state.settingsNotifications.notificationSnippets,
});

export const mapDispatchToProps = {
  fetchForm: actions.fetchForm,
  fetchNotifications: notificationsActions.fetchNotifications,
};

export const SurveySettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.formSlug);
      this.props.fetchNotifications();
    },
  }),
)(SurveySettingsComponent);
