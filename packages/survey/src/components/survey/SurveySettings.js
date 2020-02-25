import React, { Fragment, useState } from 'react';
import { Link } from '@reach/router';
import { connect } from '../../redux/store';
import {
  lifecycle,
  compose,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { FormComponents, LoadingMessage, Utils } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { bundle, I18n, FormForm } from '@kineticdata/react';
import { actions as surveyActions } from '../../redux/modules/surveys';
import { actions as notificationsActions } from '../../redux/modules/notifications';
import { actions as robotsActions } from '../../redux/modules/robots';
import { SurveySettingsWebApiView } from './SurveySettingsWebApiView';
// import { isActiveClass } from '../../utils';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

const asArray = value => (value ? [JSON.stringify(value)] : []);

const BuilderLink = ({ tree }) => (
  <span className="workflow-builder-link">
    <a
      className="btn btn-sm btn-primary"
      href={`${bundle.spaceLocation()}/app/#/space/workflow/trees/builder/${
        tree.sourceName
      }/${tree.sourceGroup}/${tree.name}`}
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
  'status',
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
  // 'pollingInterval',
  'expiration',
  'allowOptOut',
  'maxFrequencyCount',
  'maxFrequencyDays',
  'eventInterval',
  'owningTeam',
  'authenticated',
  'assignedIndividual',
  'submitter',
];

const FormLayoutComponent = ({
  fields,
  error,
  buttons,
  dirty,
  formOptions,
  associatedTree,
}) => {
  const [activeTab, setActiveTab] = useState('1');
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Fragment>
      {/* reactStrap navigation */}
      <div className="survey-tabs">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => {
                toggle('1');
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
                toggle('2');
              }}
              disabled={dirty}
            >
              <I18n>Workflow Process</I18n>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => {
                toggle('3');
              }}
              disabled={dirty}
            >
              <I18n>Polling</I18n>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '4' })}
              onClick={() => {
                toggle('4');
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
                toggle('5');
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
              {fields.get('status')}
              {fields.get('submissionLabelExpression')}
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
                {associatedTree.tree && (
                  <BuilderLink tree={associatedTree.tree} />
                )}
              </div>
              {fields.get('reminderTemplate')}
              <div className="form-group__columns">
                {fields.get('reminderInterval')}
                {fields.get('reminderMax')}
              </div>
              {fields.get('invitationTemplate')}
            </div>
          </TabPane>

          {/* Polling */}
          <TabPane tabId="3">
            <div className="survey-settings survey-settings--polling">
              {fields.get('polling')}
              {fields.get('pollingSource')}
              {fields.get('pollingType')}
              {fields.get('pollingTrigger')}
              {/* {fields.get('pollingInterval')} */}
              {fields.getIn(['polling', 'props', 'value']) === 'false' && (
                <SurveySettingsWebApiView kappSlug={formOptions.kappSlug} />
              )}
            </div>
          </TabPane>

          {/* Delivery Rules */}
          <TabPane tabId="4">
            <div className="survey-settings survey-settings--delivery">
              {fields.get('expiration')}
              {fields.get('allowOptOut')}
              <div className="form-group__columns">
                {fields.get('maxFrequencyCount')}
                {fields.get('maxFrequencyDays')}
              </div>
              {fields.get('eventInterval')}
            </div>
          </TabPane>

          {/* Security Rules */}
          <TabPane tabId="5">
            <div className="survey-settings survey-settings--security">
              <div className="form-group__columns">
                {fields.get('owningTeam')}
                {fields.get('assignedIndividual')}
              </div>
              <div className="form-group__columns">
                {fields.get('authenticated')}
                {fields.get('submitter')}
              </div>
            </div>
          </TabPane>
        </TabContent>
      </div>

      {/* previous style */}
      {/* <div className="survey-tabs">
      <ul className="nav nav-tabs">
        <li role="presentation">
          <Link to="somewhere" className="active">
            <I18n>General Settings</I18n>
          </Link>
        </li>

        <li role="presentation">
          <Link to="somewhere">
            <I18n>Workflow Process</I18n>
          </Link>
        </li>
        <li role="presentation">
          <Link to="somewhere">
            <I18n>Polling</I18n>
          </Link>
        </li>
        <li role="presentation">
          <Link to="somewhere">
            <I18n>Delivery Rules</I18n>
          </Link>
        </li>
        <li role="presentation">
          <Link to="somewhere">
            <I18n>Security</I18n>
          </Link>
        </li>
      </ul>
    </div> */}
      {/* <div className="survey-tabs__content"> */}
      {/* General Settings */}
      {/* <div className="survey-settings survey-settings--general active">
        <div className="form-group__columns">
          {fields.get('name')}
          {fields.get('slug')}
        </div>
        {fields.get('description')}
        {fields.get('status')}
        {fields.get('submissionLabelExpression')}
      </div> */}

      {/* Workflow Process */}
      {/* <div className="survey-settings survey-settings--workflow">
        {fields.get('workflowProcess')}
        {fields.get('reminderTemplate')}
        <div className="form-group__columns">
          {fields.get('reminderInterval')}
          {fields.get('reminderMax')}
        </div>
        {fields.get('invitationTemplate')}
        <div className="form-group__columns">
          {fields.get('surveyStart')}
          {fields.get('surveyStop')}
        </div>
      </div> */}

      {/* Polling */}
      {/* <div className="survey-settings survey-settings--polling">
        {fields.get('polling')}
        {fields.get('pollingSource')}
        {fields.get('pollingType')}
        {fields.get('pollingTrigger')}
        {fields.get('pollingInterval')}
      </div> */}

      {/* Delivery Rules */}
      {/* <div className="survey-settings survey-settings--delivery">
        {fields.get('expiration')}
        {fields.get('allowOptOut')}
        <div className="form-group__columns">
          {fields.get('maxFrequencyCount')}
          {fields.get('maxFrequencyDays')}
        </div>
        {fields.get('eventInterval')}
      </div> */}

      {/* Security Rules */}
      {/* <div className="survey-settings survey-settings--security">
        <div className="form-group__columns">
          {fields.get('owningTeam')}
          {fields.get('assignedIndividual')}
        </div>
        <div className="form-group__columns">
          {fields.get('authenticated')}
          {fields.get('submitter')}
        </div>
      </div> */}
      {/* </div> */}

      {error}
      {buttons}
    </Fragment>
  );
};

const SurveySettingsComponent = ({
  kapp,
  kappSlug,
  canManage,
  origForm,
  loading,
  taskSourceName,
  templates,
  snippets,
  robots,
  customWorkflow,
  setCustomWorkflow,
  onSave,
}) => {
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
      )
      .concat([{ value: 'Survey Invitation', label: 'Survey Invitation' }]); // placeholder

  const robotOptions =
    !!robots &&
    robots.map(r => ({
      value: r.values['Robot Name'],
      label: r.values['Task Tree'],
    }));

  return (
    !loading &&
    origForm && (
      <I18n context={`forms.${origForm.slug}`}>
        <div className="page-container page-container--panels">
          <PageTitle parts={['Settings', origForm.name]} />
          <div className="page-panel page-panel--two-thirds page-panel--white">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="../../">
                    <I18n>{kapp.name}</I18n>
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
                href={`${bundle.spaceLocation()}/app/builder/#/${kappSlug}/forms/${
                  origForm.slug
                }/builder`}
                className="btn btn-primary"
                target="_blank"
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
                  onSave={() => onSave}
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
                          name: 'workflowProcess',
                          label: 'Workflow Process',
                          type: 'radio',
                          options: [
                            { label: 'Standard', value: 'false' },
                            { label: 'Custom', value: 'true' },
                          ],
                          initialValue: surveyConfig
                            ? surveyConfig['Use Custom Workflow']
                            : 'false',
                          onChange: ({ values }) =>
                            setCustomWorkflow(values.get('workflowProcess')),
                        },
                        {
                          name: 'reminderTemplate',
                          label: 'Reminder Notifications Template',
                          type: 'select',
                          initialValue: surveyConfig
                            ? surveyConfig['Reminders']['Reminder Template']
                            : '',
                          options: notificationOptions,
                        },

                        {
                          name: 'reminderInterval',
                          label: 'Reminder Notifications Interval',
                          type: 'text',
                          initialValue: surveyConfig
                            ? surveyConfig['Reminders']['Reminder Interval']
                            : 0,
                          component: FormComponents.IntegerField,
                        },
                        {
                          name: 'reminderMax',
                          label: 'Reminder Notifications Max',
                          type: 'text',
                          initialValue: surveyConfig
                            ? surveyConfig['Reminders']['Reminder Max']
                            : 0,
                          component: FormComponents.IntegerField,
                        },
                        {
                          name: 'invitationTemplate',
                          label: 'Invitation Template',
                          type: 'select',
                          initialValue: surveyConfig
                            ? surveyConfig['Invitation Notification Name']
                            : 'Survey Invitation',
                          options: notificationOptions,
                        },
                        {
                          name: 'polling',
                          label: 'Poll For Survey Events',
                          type: 'radio',
                          initialValue: surveyConfig
                            ? surveyConfig['Event Polling']['Poll']
                            : 'false',
                          options: [
                            { value: 'true', label: 'Yes' },
                            { value: 'false', label: 'No' },
                          ],
                        },
                        {
                          name: 'pollingSource',
                          label: 'Polling Source',
                          type: 'select',
                          visible: ({ values }) =>
                            values.get('polling') === 'true',
                          initialValue: surveyConfig
                            ? surveyConfig['Event Polling']['Source']
                            : '',
                          options: robotOptions && robotOptions,
                        },
                        {
                          name: 'pollingType',
                          label: 'Polling Type',
                          type: 'text',
                          visible: ({ values }) =>
                            values.get('polling') === 'true',
                          initialValue: surveyConfig
                            ? surveyConfig['Event Polling']['Type']
                            : '',
                        },
                        {
                          name: 'pollingTrigger',
                          label: 'Polling Trigger',
                          type: 'text',
                          visible: ({ values }) =>
                            values.get('polling') === 'true',
                          initialValue: surveyConfig
                            ? surveyConfig['Event Polling']['Trigger']
                            : '',
                        },
                        // {
                        //   name: 'pollingInterval',
                        //   label: 'Polling Interval',
                        //   type: 'text',
                        //   visible: ({ values }) =>
                        //     values.get('polling') === 'true',
                        //   initialValue: surveyConfig
                        //     ? surveyConfig['Event Polling']['Interval']
                        //     : 1,
                        //   component: FormComponents.IntegerField,
                        // },
                        {
                          name: 'surveyStart',
                          label: 'Survey Start',
                          type: 'date',
                          initialValue: surveyConfig
                            ? surveyConfig['Survey Period']['Start']
                            : '',
                          component: FormComponents.DateField,
                        },
                        {
                          name: 'surveyStop',
                          label: 'Survey Stop',
                          type: 'date',
                          initialValue: surveyConfig
                            ? surveyConfig['Survey Period']['Stop']
                            : '',
                          component: FormComponents.DateField,
                        },
                        {
                          name: 'expiration',
                          label: 'Expiration in Days',
                          type: 'text',
                          initialValue: surveyConfig
                            ? surveyConfig['Expiration']
                            : 365,
                          component: FormComponents.IntegerField,
                        },
                        {
                          name: 'allowOptOut',
                          label: 'Allow Opt-out',
                          type: 'radio',
                          initialValue: surveyConfig
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
                          initialValue: surveyConfig
                            ? surveyConfig['Maximum Survey Frequency']['Count']
                            : 1000,
                          component: FormComponents.IntegerField,
                        },
                        {
                          name: 'maxFrequencyDays',
                          label: 'Max Frequency Days',
                          type: 'text',
                          initialValue: surveyConfig
                            ? surveyConfig['Maximum Survey Frequency']['Days']
                            : 1,
                          component: FormComponents.IntegerField,
                        },
                        {
                          name: 'eventInterval',
                          label: 'Survey Event Interval',
                          type: 'text',
                          initialValue: surveyConfig
                            ? surveyConfig['Survey Event Interval']
                            : 1,
                          component: FormComponents.IntegerField,
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
                          name: 'authenticated',
                          label: 'Authenticated',
                          type: 'text',
                          helpText: 'TBD',
                          initialValue:
                            surveyConfig && surveyConfig['Authenticated'],
                        },
                        {
                          name: 'assignedIndividual',
                          label: 'Assigned Individual',
                          type: 'user',
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
                          'Survey Event Interval': values.get('eventInterval'),
                          'Owning Team': values.get('owningTeam'),
                          Authenticated: values.get('authenticated'),
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
          </div>
        </div>
      </I18n>
    )
  );
};

export const mapStateToProps = (state, { slug }) => ({
  loading: state.surveys.currentFormLoading || state.notifications.loading,
  origForm: state.surveys.form,
  kapp: state.app.kapp,
  kappSlug: state.app.kappSlug,
  formSlug: slug,
  taskSourceName: Utils.getAttributeValue(state.app.space, 'Task Source Name'),
  templates: state.notifications.notificationTemplates,
  snippets: state.notifications.notificationSnippets,
  robots: state.robots.robots.toJS(),
  associatedTree: state.surveys.associatedTree,
});

export const mapDispatchToProps = {
  fetchFormRequest: surveyActions.fetchFormRequest,
  fetchNotifications: notificationsActions.fetchNotifications,
  fetchRobots: robotsActions.fetchRobots,
  createSurveyCustomWorkflowTree: surveyActions.createSurveyCustomWorkflowTree,
  deleteSurveyCustomWorkflowTree: surveyActions.deleteSurveyCustomWorkflowTree,
  fetchAssociatedTree: surveyActions.fetchAssociatedTree,
};

const FormLayout = compose(connect(mapStateToProps))(FormLayoutComponent);

export const SurveySettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('customWorkflow', 'setCustomWorkflow', ''),
  withProps(props => ({
    form: props.forms && props.forms.find(form => form.slug === props.slug),
  })),
  withHandlers({
    onSave: props => () => {
      props.customWorkflow === 'true'
        ? props.createSurveyCustomWorkflowTree({
            sourceName: props.taskSourceName,
            kappSlug: props.kappSlug,
            formSlug: props.origForm.slug,
          })
        : props.customWorkflow === 'false' &&
          props.deleteSurveyCustomWorkflowTree({
            sourceName: props.taskSourceName,
            kappSlug: props.kappSlug,
            formSlug: props.origForm.slug,
          });
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchFormRequest({
        kappSlug: this.props.kappSlug,
        formSlug: this.props.slug,
      });
      this.props.fetchAssociatedTree({
        name: 'Submitted',
        sourceGroup: `Submissions > ${this.props.kappSlug} > ${
          this.props.slug
        }`,
        sourceName: this.props.taskSourceName,
      });
      this.props.fetchNotifications();
      this.props.fetchRobots();
    },
  }),
)(SurveySettingsComponent);
