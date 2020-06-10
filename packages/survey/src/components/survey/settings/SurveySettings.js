import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from '../../../redux/store';
import {
  lifecycle,
  compose,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import moment from 'moment';
import { FormComponents, LoadingMessage, addToast } from 'common';
import { PageTitle } from '../../shared/PageTitle';
import { bundle, I18n, FormForm } from '@kineticdata/react';
import { actions as surveyActions } from '../../../redux/modules/surveys';
import { actions as notificationsActions } from '../../../redux/modules/notifications';
import { SettingsWebApiView } from './SettingsWebApiView';
import { SettingsSidebar } from './SettingsSidebar';

const asArray = value => (value ? [JSON.stringify(value)] : []);

const BuilderLink = ({ tree }) => (
  <span className="workflow-builder-link">
    <a
      className="btn btn-sm btn-primary"
      href={`${bundle.spaceLocation()}/app/#/workflow/trees/builder/${
        tree.sourceName
      }/${tree.sourceGroup}/${tree.name}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="fa fa-mouse-pointer fa-fw" />
      Builder
    </a>
  </span>
);

const fieldSet = [
  'name',
  'slug',
  'description',
  // 'status',
  'submissionLabelExpression',
  'attributesMap',
  'workflowProcess',
  'reminderTemplate',
  'reminderInterval',
  'reminderMax',
  'invitationTemplate',
  'surveyStart',
  'surveyStop',
  'polling',
  'pollingSource',
  'pollingType',
  'pollingTrigger',
  'pollingInterval',
  'expiration',
  'allowOptOut',
  'maxFrequencyCount',
  'maxFrequencyDays',
  // 'eventInterval',
  'owningTeam',
  'owningIndividual',
  'confirmationPageText',
];

const SurveySettingsComponent = ({
  kapp,
  kappSlug,
  origForm,
  surveyConfig,
  surveyPollers,
  loading,
  templates,
  onSave,
  spaceAdmin,
  associatedTree,
  activeTab,
  toggleTab,
}) => {
  const FormLayout = ({ fields, error, buttons, dirty, formOptions }) => (
    <Fragment>
      <div className="survey-tabs">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => {
                toggleTab('1');
              }}
              disabled={dirty}
            >
              <I18n>General Settings</I18n>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => {
                toggleTab('2');
              }}
              disabled={dirty}
            >
              <I18n>Workflow Process</I18n>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '6' })}
              onClick={() => {
                toggleTab('6');
              }}
              disabled={dirty}
            >
              <I18n>Notifications</I18n>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => {
                toggleTab('3');
              }}
              disabled={dirty}
            >
              <I18n>Triggers</I18n>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '4' })}
              onClick={() => {
                toggleTab('4');
              }}
              disabled={dirty}
            >
              <I18n>Delivery Rules</I18n>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '5' })}
              onClick={() => {
                toggleTab('5');
              }}
              disabled={dirty}
            >
              <I18n>Security</I18n>
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          {/* General Settings */}
          <TabPane tabId="1">
            <div className="survey-settings survey-settings--general active">
              <div className="form-group__columns">
                {fields.get('name')}
                {fields.get('slug')}
              </div>
              {fields.get('description')}
              {/* {fields.get('status')} */}
              {fields.get('submissionLabelExpression')}
              {fields.get('confirmationPageText')}
              <div className="form-group__columns">
                {fields.get('surveyStart')}
                {fields.get('surveyStop')}
              </div>
            </div>
          </TabPane>

          {/* Workflow Process */}
          <TabPane tabId="2">
            <div className="survey-settings survey-settings--workflow">
              <div className="workflow-group">
                {fields.get('workflowProcess')}
                <p className="small">
                  A workflow can be created upon submission of a survey to
                  trigger additional actions
                </p>
                {spaceAdmin &&
                  associatedTree.tree &&
                  fields.get('workflowProcess').props['value'] === 'true' && (
                    <BuilderLink tree={associatedTree.tree} />
                  )}
              </div>
            </div>
          </TabPane>

          {/* Notifications */}
          <TabPane tabId="6">
            <div className="survey-settings survey-settings--workflow">
              {fields.get('invitationTemplate')}
              {fields.get('reminderTemplate')}
              <div className="form-group__columns">
                {fields.get('reminderInterval')}
                {fields.get('reminderMax')}
              </div>
            </div>
          </TabPane>

          {/* Triggers */}
          <TabPane tabId="3">
            <div className="survey-settings survey-settings--polling">
              {fields.get('polling')}
              {fields.get('pollingSource')}
              {fields.get('pollingType')}
              {fields.get('pollingTrigger')}
              {fields.get('pollingInterval')}
              {fields.getIn(['polling', 'props', 'value']) === 'false' && (
                <Fragment>
                  <p className="small">
                    Non-polling surveys will be triggered via an API call. Below
                    are several examples of how to make this call.
                  </p>
                  <SettingsWebApiView
                    kappSlug={formOptions.kappSlug}
                    formSlug={formOptions.formSlug}
                    formFields={origForm.fields}
                  />
                </Fragment>
              )}
            </div>
          </TabPane>

          {/* Delivery Rules */}
          <TabPane tabId="4">
            <div className="survey-settings survey-settings--delivery">
              {fields.get('expiration')}
              {fields.get('allowOptOut')}
              <p className="small">
                Allows a user to opt-out of retrieving this survey
              </p>
              <div className="form-group__columns">
                {fields.get('maxFrequencyCount')}
                {fields.get('maxFrequencyDays')}
              </div>
              <p className="small">
                Max Frequency Count and Days allows you to control the maximum
                number of surveys that will be sent to a given individual in at
                those number of days. For example, if this is an incident
                survey, you may not want to send more than one satisfaction
                survey a week (Max count: 1, Days: 7). The default is
                essentially having no limit.
              </p>
              {/* {fields.get('eventInterval')} */}
            </div>
          </TabPane>

          {/* Security Rules */}
          <TabPane tabId="5">
            <div className="survey-settings survey-settings--security">
              <div className="form-group__columns">
                {fields.get('owningTeam')}
                {fields.get('owningIndividual')}
              </div>
            </div>
          </TabPane>
        </TabContent>
      </div>
      {error}
      {buttons}
    </Fragment>
  );

  const notificationOptions =
    !!templates &&
    templates.map(t => ({
      value: t.values['Name'],
      label: t.values['Name'],
      slug: t.id,
    }));

  const surveyPollerOptions =
    !!surveyPollers &&
    surveyPollers.map(s => ({
      value: s['Poller Tree'],
      label: s['Poller Tree'],
    }));

  return (
    !loading &&
    origForm && (
      <I18n context={`forms.${origForm.slug}`}>
        <div className="page-container page-container--panels">
          <PageTitle parts={['Settings', origForm.name]} />
          <div className="page-panel page-panel--two-thirds page-panel--white">
            <div className="page-title">
              <div
                role="navigation"
                aria-label="breadcrumbs"
                className="page-title__breadcrumbs"
              >
                <span className="breadcrumb-item">
                  <Link to="../../">
                    <I18n>{kapp.name}</I18n>
                  </Link>
                </span>{' '}
                <span aria-hidden="true">/ </span>
                <span className="breadcrumb-item">
                  <Link to="../submissions">
                    <I18n>{origForm.name}</I18n>
                  </Link>
                </span>{' '}
                <span aria-hidden="true">/ </span>
                <h1>
                  <I18n>Settings</I18n>
                </h1>
              </div>
              <a
                href={`${bundle.spaceLocation()}/app/builder/#/${kappSlug}/forms/${
                  origForm.slug
                }/builder`}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <I18n>Form Builder</I18n>{' '}
                <i className="fa fa-fw fa-external-link" />
              </a>
            </div>
            {true ? ( //canManage
              <div className="datastore-settings">
                <FormForm
                  formSlug={origForm.slug}
                  kappSlug={kappSlug}
                  fieldSet={fieldSet}
                  onSave={onSave}
                  components={{ FormLayout }}
                  addFields={() => ({ form }) => {
                    return (
                      form && [
                        {
                          name: 'workflowProcess',
                          label: 'Run Workflow Process on Submit',
                          type: 'radio',
                          options: [
                            { label: 'No', value: 'false' },
                            { label: 'Yes', value: 'true' },
                          ],
                          initialValue:
                            associatedTree.tree &&
                            surveyConfig &&
                            surveyConfig['Use Custom Workflow']
                              ? surveyConfig['Use Custom Workflow']
                              : 'false',
                        },
                        {
                          name: 'reminderTemplate',
                          label: 'Reminder Notifications Template',
                          type: 'select',
                          renderAttributes: { typeahead: true },
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Reminders']['Reminder Template']
                              ? surveyConfig['Reminders']['Reminder Template']
                              : 'Survey Invitation',
                          options: notificationOptions,
                          helpText:
                            'This email notification template will be used when sending out a survey reminder',
                          component: FormComponents.NotificationField,
                        },

                        {
                          name: 'reminderInterval',
                          label: 'Reminder Notifications Interval (in days)',
                          type: 'text',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Reminders']['Reminder Interval']
                              ? surveyConfig['Reminders']['Reminder Interval']
                              : 2,
                          component: FormComponents.IntegerField,
                          helpText: 'Number of days between survey reminders',
                        },
                        {
                          name: 'reminderMax',
                          label: 'Reminder Notifications Max',
                          type: 'text',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Reminders']['Reminder Max']
                              ? surveyConfig['Reminders']['Reminder Max']
                              : 3,
                          component: FormComponents.IntegerField,
                          helpText:
                            'Maximum number of survey reminders that will be sent out (if survey is completed, reminders stop)',
                        },
                        {
                          name: 'invitationTemplate',
                          label: 'Invitation Notification Template',
                          type: 'select',
                          renderAttributes: { typeahead: true },
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Invitation Notification Name']
                              ? surveyConfig['Invitation Notification Name']
                              : 'Survey Invitation',
                          options: notificationOptions,
                          helpText: `This email notification template will be used when sending out the survey`,
                          component: FormComponents.NotificationField,
                        },
                        {
                          name: 'polling',
                          label: 'Poll For Survey Events',
                          type: 'radio',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Event Polling']['Poll']
                              ? surveyConfig['Event Polling']['Poll']
                              : 'false',
                          options: [
                            { value: 'true', label: 'Yes' },
                            { value: 'false', label: 'No' },
                          ],
                        },
                        {
                          name: 'pollingSource',
                          label: 'Source',
                          type: 'select',
                          visible: ({ values }) =>
                            values.get('polling') === 'true',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Event Polling']['Source']
                              ? surveyConfig['Event Polling']['Source']
                              : '',
                          options: surveyPollerOptions && surveyPollerOptions,
                        },
                        {
                          name: 'pollingType',
                          label: 'Type',
                          type: 'text',
                          visible: ({ values }) =>
                            values.get('polling') === 'true',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Event Polling']['Type']
                              ? surveyConfig['Event Polling']['Type']
                              : '',
                          helpText:
                            'Name of the form or object that will be polled',
                          placeholder: 'HPD:HelpDesk',
                        },
                        {
                          name: 'pollingTrigger',
                          label: 'Trigger',
                          type: 'text',
                          visible: ({ values }) =>
                            values.get('polling') === 'true',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Event Polling']['Trigger']
                              ? surveyConfig['Event Polling']['Trigger']
                              : '',
                          helpText:
                            'Query that will be executed to retrieve surveys',
                          placeholder: `‘Status’=”Completed”`,
                        },
                        {
                          name: 'pollingInterval',
                          label: 'Interval (in minutes)',
                          type: 'text',
                          visible: ({ values }) =>
                            values.get('polling') === 'true',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Event Polling']['Interval']
                              ? surveyConfig['Event Polling']['Interval']
                              : 1440,
                          helpText:
                            'Number of minutes between each polling query. This value is used to calculate begin and end dates (using last modified date/time on the record) that are appended to the query',
                          component: FormComponents.IntegerField,
                        },
                        {
                          name: 'surveyStart',
                          label: 'Survey Start',
                          type: 'date',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Survey Period']['Start']
                              ? surveyConfig['Survey Period']['Start']
                              : new moment().format('YYYY-MM-DD'),
                          component: FormComponents.DateField,
                          helpText: 'Date when surveys will begin being sent',
                        },
                        {
                          name: 'surveyStop',
                          label: 'Survey Stop',
                          type: 'date',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Survey Period']['Stop']
                              ? surveyConfig['Survey Period']['Stop']
                              : new moment().add(1, 'y').format('YYYY-MM-DD'),
                          component: FormComponents.DateField,
                          helpText: 'Date when surveys will stop being sent',
                        },
                        {
                          name: 'expiration',
                          label: 'Expiration in Days',
                          type: 'text',
                          initialValue:
                            surveyConfig && surveyConfig['Expiration']
                              ? surveyConfig['Expiration']
                              : 365,
                          component: FormComponents.IntegerField,
                          helpText:
                            'Number of days the user being surveyed has to fill it out',
                        },
                        {
                          name: 'allowOptOut',
                          label: 'Allow Opt-out',
                          type: 'radio',
                          initialValue:
                            surveyConfig && surveyConfig['Allow Opt-out']
                              ? surveyConfig['Allow Opt-out']
                              : 'false',
                          options: [
                            { value: 'true', label: 'Yes' },
                            { value: 'false', label: 'No' },
                          ],
                        },
                        {
                          name: 'maxFrequencyCount',
                          label: 'Max Frequency Count',
                          type: 'text',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Maximum Survey Frequency']['Count']
                              ? surveyConfig['Maximum Survey Frequency'][
                                  'Count'
                                ]
                              : 1,
                          component: FormComponents.IntegerField,
                        },
                        {
                          name: 'maxFrequencyDays',
                          label: 'Max Frequency Days',
                          type: 'text',
                          initialValue:
                            surveyConfig &&
                            surveyConfig['Maximum Survey Frequency']['Days']
                              ? surveyConfig['Maximum Survey Frequency']['Days']
                              : 7,
                          component: FormComponents.IntegerField,
                        },
                        // {
                        //   name: 'eventInterval',
                        //   label: 'Survey Event Interval',
                        //   type: 'text',
                        //   visible: ({ values }) =>
                        //     values.get('polling') === 'true',
                        //   initialValue:
                        //     surveyConfig &&
                        //     surveyConfig['Survey Event Interval']
                        //       ? surveyConfig['Survey Event Interval']
                        //       : 1,
                        //   component: FormComponents.IntegerField,
                        //   helpText:
                        //     'How many qualified events happen for each survey sent. For example, you may only want to send one survey for every 10 incidents (Interval: 10). The default is no limitation.',
                        // },
                        {
                          name: 'owningTeam',
                          label: 'Owning Team',
                          type: 'team',
                          helpText:
                            'Team allowed to review survey submissions and edit survey',
                          initialValue:
                            surveyConfig && surveyConfig['Owning Team']
                              ? surveyConfig['Owning Team']
                              : null,
                        },
                        {
                          name: 'owningIndividual',
                          label: 'Owning Individual',
                          type: 'user',
                          helpText:
                            'Individual allowed to review survey submissions and edit survey (in addition to owning team). Set to creator of the survey by default.',
                          initialValue:
                            surveyConfig && surveyConfig['Owning Individual']
                              ? surveyConfig['Owning Individual']
                              : null,
                        },
                        {
                          name: 'confirmationPageText',
                          label: 'Confirmation Page Text',
                          type: 'text',
                          helpText:
                            'Message shown to each survey participant after they have completed the survey. If no message is added, it will default to the message set at the kapp level or use the system default.',
                          initialValue: form.getIn([
                            'attributesMap',
                            'Confirmation Page Text',
                          ])
                            ? form.getIn([
                                'attributesMap',
                                'Confirmation Page Text',
                                0,
                              ])
                            : '',
                        },
                      ]
                    );
                  }}
                  alterFields={{
                    name: {
                      helpText: 'Name of the survey',
                    },
                    slug: {
                      helpText: 'Unique identifier of the survey',
                    },
                    description: { component: FormComponents.TextAreaField },
                    // status: {
                    //   options: [
                    //     { value: 'Active', label: 'Active' },
                    //     { value: 'Inactive', label: 'Inactive' },
                    //   ],
                    //   helpText: 'Only Active surveys will be sent out',
                    // },
                    submissionLabelExpression: {
                      language: 'js-template',
                      label: 'Survey Label',
                      helpText:
                        'A combination of fields from the survey and text to help you identify at a glance which survey submission is which.',
                    },
                    attributesMap: {
                      serialize: ({ values }) => ({
                        'Survey Configuration': asArray({
                          'Use Custom Workflow': values.get('workflowProcess'),
                          Reminders: {
                            'Reminder Template': values.get('reminderTemplate'),
                            'Reminder Interval': values.get('reminderInterval'),
                            'Reminder Max': values.get('reminderMax'),
                          },
                          'Invitation Notification Name': values.get(
                            'invitationTemplate',
                          ),
                          'Event Polling': {
                            Poll: values.get('polling'),
                            Source: values.get('pollingSource'),
                            Type: values.get('pollingType'),
                            Trigger: values.get('pollingTrigger'),
                            Interval: values.get('pollingInterval'),
                          },
                          'Survey Period': {
                            Start: values.get('surveyStart'),
                            Stop: values.get('surveyStop'),
                          },
                          Expiration: values.get('expiration'),
                          'Allow Opt-out': values.get('allowOptOut'),
                          'Maximum Survey Frequency': {
                            Count: values.get('maxFrequencyCount'),
                            Days: values.get('maxFrequencyDays'),
                          },
                          // 'Survey Event Interval': values.get('eventInterval'),
                          'Owning Team': values.get('owningTeam'),
                          'Owning Individual': values.get('owningIndividual'),
                        }),
                        'Confirmation Page Text': [
                          values.get('confirmationPageText'),
                        ],
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
            ) : (
              <p>
                <I18n>You do not have access to configure this survey.</I18n>
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
            <p>
              <I18n>
                <b>Note:</b> Updating a field will temporarily disable
                navigating between tabs. Reset or save your changes to continue.
              </I18n>
            </p>
            <SettingsSidebar tab={activeTab} />
          </div>
        </div>
      </I18n>
    )
  );
};

export const mapStateToProps = (state, { slug }) => ({
  loading: state.surveys.currentFormLoading || state.notifications.loading,
  spaceAdmin: state.app.profile.spaceAdmin ? true : false,
  kapp: state.app.kapp,
  kappSlug: state.app.kappSlug,
  formSlug: slug,
  surveyPollers: state.surveys.surveyPollers,
  origForm: state.surveys.form,
  templates: state.notifications.notificationTemplates,
  associatedTree: state.surveys.associatedTree,
});

export const mapDispatchToProps = {
  fetchNotifications: notificationsActions.fetchNotifications,
  fetchSurveyPollers: surveyActions.fetchSurveyPollers,
  fetchFormRequest: surveyActions.fetchFormRequest,
  clearSurveyState: surveyActions.clearSurveyState,
};

export const SurveySettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('activeTab', 'setActiveTab', '1'),
  withProps(props => ({
    surveyConfig:
      props.origForm &&
      props.origForm['attributesMap'] &&
      props.origForm['attributesMap']['Survey Configuration'][0] !== '' &&
      JSON.parse(props.origForm['attributesMap']['Survey Configuration'][0]),
    pollingSourceList:
      props.forms && props.forms.find(form => form.slug === 'survey-pollers'),
  })),
  withHandlers({
    toggleTab: props => tab => {
      if (props.activeTab !== tab) props.setActiveTab(tab);
    },
    onSave: props => () => () => {
      props.fetchFormRequest({
        kappSlug: props.kappSlug,
        formSlug: props.origForm.slug,
      });
      addToast(`${props.origForm.name} settings saved successfully.`);
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchFormRequest({
        kappSlug: this.props.kapp.slug,
        formSlug: this.props.slug,
      });
      this.props.fetchNotifications();
      this.props.fetchSurveyPollers();
    },
    componentWillUnmount() {
      this.props.clearSurveyState();
    },
  }),
)(SurveySettingsComponent);
