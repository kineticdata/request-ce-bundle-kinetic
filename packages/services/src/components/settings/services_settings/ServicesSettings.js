import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import {
  I18n,
  KappForm,
  SubmissionSearch,
  searchSubmissions,
} from '@kineticdata/react';
import { compose, withHandlers } from 'recompose';
import { connect } from '../../../redux/store';
import { FormComponents, addToast, selectQueueKappSlug } from 'common';
import { PageTitle } from '../../shared/PageTitle';

const fieldSet = [
  'name',
  'icon',
  'recordSearchHistory',
  'defaultServiceDaysDue',
  'defaultKappApprover',
  'defaultTaskAssigneeTeam',
  'defaultApprovalForm',
  'defaultTaskForm',
  'sharedBridgedResourceForm',
  'notificationCreate',
  'notificationComplete',
  'attributesMap',
];

const FormLayout = ({ fields, error, buttons }) => (
  <Fragment>
    <h2 className="section__title">
      <I18n>Display Options</I18n>
    </h2>
    {fields.get('name')}
    {fields.get('icon')}
    {fields.get('recordSearchHistory')}
    <br />
    <h2 className="section__title">
      <I18n>Workflow Options</I18n>
    </h2>
    {fields.get('defaultServiceDaysDue')}
    {fields.get('defaultKappApprover')}
    {fields.get('defaultTaskAssigneeTeam')}
    <br />
    <h2 className="section__title">
      <I18n>Form Mapping</I18n>
    </h2>
    {fields.get('defaultApprovalForm')}
    {fields.get('defaultTaskForm')}
    {fields.get('sharedBridgedResourceForm')}
    {fields.get('notificationCreate')}
    {fields.get('notificationComplete')}
    {error}
    {buttons}
  </Fragment>
);

const initialFormValue = (object, attributeName) =>
  object.hasIn(['attributesMap', attributeName, 0])
    ? { slug: object.getIn(['attributesMap', attributeName, 0]) }
    : null;
const asArray = value => (value ? [value] : []);

const notificationSearch = new SubmissionSearch(true)
  .index('values[Name]')
  .includes(['values'])
  .limit(1000)
  .build();

export const ServicesSettingsComponent = ({
  currentKapp,
  onSave,
  queueKappSlug,
}) => (
  <KappForm
    kappSlug={currentKapp.slug}
    fieldSet={fieldSet}
    onSave={onSave}
    components={{ FormLayout }}
    addDataSources={{
      notifications: {
        fn: searchSubmissions,
        params: [
          {
            datastore: true,
            form: 'notification-data',
            search: notificationSearch,
          },
        ],
        transform: result => result.submissions,
      },
    }}
    addFields={() => ({ kapp, notifications }) =>
      kapp &&
      notifications && [
        {
          name: 'icon',
          label: 'Display Icon',
          type: 'text',
          helpText: 'Font Awesome icon to display in Kapp links.',
          initialValue: kapp.getIn(['attributesMap', 'Icon', 0]),
          component: FormComponents.IconField,
        },
        {
          name: 'recordSearchHistory',
          label: 'Record Search History',
          type: 'select',
          helpText: 'Controls when searches made from this kapp are recorded.',
          initialValue: kapp.getIn(
            ['attributesMap', 'Record Search History', 0],
            'Off',
          ),
          placeholder: 'Off (never recorded)',
          options: [
            { label: 'All (always recorded)', value: 'All' },
            {
              label: 'None (only recorded if no results found)',
              value: 'None',
            },
          ],
        },
        {
          name: 'defaultServiceDaysDue',
          label: 'Default Service Days Due',
          type: 'text',
          helpText:
            'Number of days until service is expected to be fulfilled for forms in this Kapp - This attribute is overridden if set at the form level.',
          initialValue: kapp.getIn(['attributesMap', 'Service Days Due', 0]),
          component: FormComponents.IntegerField,
        },
        {
          name: 'defaultKappApprover',
          label: 'Default Kapp Approver',
          type: 'text',
          helpText:
            "Options are: Team Name, Individual Name or 'Manager'. If this is set, all forms in this kapp will get approvals sent to the value set here unless specified in a form.",
          initialValue: kapp.getIn(['attributesMap', 'Approver', 0]),
        },
        {
          name: 'defaultTaskAssigneeTeam',
          label: 'Default Kapp Task Assignee Team',
          type: 'team',
          helpText: 'Team to assign tasks to if not defined in a form.',
          initialValue: kapp.hasIn(['attributesMap', 'Task Assignee Team', 0])
            ? { name: kapp.getIn(['attributesMap', 'Task Assignee Team', 0]) }
            : null,
        },
        {
          name: 'defaultApprovalForm',
          label: 'Approval Form',
          type: 'form',
          helpText:
            'The Queue kapp form which approvals should be created in (Overridden by Form attributes)',
          initialValue: initialFormValue(kapp, 'Approval Form Slug'),
          search: { kappSlug: queueKappSlug },
        },
        {
          name: 'defaultTaskForm',
          label: 'Default Task Form',
          type: 'form',
          helpText:
            'The Queue kapp form to use when creating a task item (Overridden by Form attributes)',
          initialValue: initialFormValue(kapp, 'Task Form Slug'),
          search: { kappSlug: queueKappSlug },
        },
        {
          name: 'sharedBridgedResourceForm',
          label: 'Shared Bridged Resource Form',
          type: 'form',
          helpText:
            'Slug of the form that exposes shared bridged resources in this kapp (typically shared-resources).',
          initialValue: initialFormValue(
            kapp,
            'Shared Bridged Resource Form Slug',
          ),
          search: { kappSlug: currentKapp.slug },
        },
        {
          name: 'notificationCreate',
          label: 'Default Notification Template Name - Create',
          type: 'select',
          renderAttributes: { typeahead: true },
          helpText:
            "Name of the Notification Template to use when this kapp's submissions are submitted.",
          initialValue: kapp.getIn([
            'attributesMap',
            'Notification Template Name - Create',
            0,
          ]),
          options: notifications
            ? notifications
                .map(notification => ({
                  label: notification.getIn(['values', 'Name']),
                  value: notification.getIn(['values', 'Name']),
                  slug: notification.get('id'),
                }))
                .toJS()
            : [],
          component: FormComponents.NotificationField,
        },
        {
          name: 'notificationComplete',
          label: 'Default Notification Template Name - Complete',
          type: 'select',
          renderAttributes: { typeahead: true },
          helpText:
            "Name of the Notification Template to use when this kapp's submissions are completed.",
          initialValue: kapp.getIn([
            'attributesMap',
            'Notification Template Name - Complete',
            0,
          ]),
          options: notifications
            ? notifications
                .map(notification => ({
                  label: notification.getIn(['values', 'Name']),
                  value: notification.getIn(['values', 'Name']),
                  slug: notification.get('id'),
                }))
                .toJS()
            : [],
          component: FormComponents.NotificationField,
        },
      ]}
    alterFields={{
      name: {
        helpText: 'The name of the Kapp referenced throughout the Kapp.',
      },
      attributesMap: {
        serialize: ({ values }) => ({
          Icon: asArray(values.get('icon')),
          'Record Search History': asArray(values.get('recordSearchHistory')),
          'Service Days Due': asArray(values.get('defaultServiceDaysDue')),
          Approver: asArray(values.get('defaultKappApprover')),
          'Task Assignee Team': asArray(
            values.getIn(['defaultTaskAssigneeTeam', 'name']),
          ),
          'Approval Form Slug': asArray(
            values.getIn(['defaultApprovalForm', 'slug']),
          ),
          'Task Form Slug': asArray(values.getIn(['defaultTaskForm', 'slug'])),
          'Shared Bridged Resource Form Slug': asArray(
            values.getIn(['sharedBridgedResourceForm', 'slug']),
          ),
          'Notification Template Name - Complete': asArray(
            values.getIn(['notificationComplete']),
          ),
          'Notification Template Name - Create': asArray(
            values.getIn(['notificationCreate']),
          ),
        }),
      },
    }}
  >
    {({ form, initialized }) => (
      <div className="page-container">
        <PageTitle parts={[`${currentKapp.name} Settings`]} />
        <div className="page-panel page-panel--white">
          <div className="page-title">
            <div
              role="navigation"
              aria-label="breadcrumbs"
              className="page-title__breadcrumbs"
            >
              <span className="breadcrumb-item">
                <Link to="../../">
                  <I18n>services</I18n>
                </Link>
              </span>{' '}
              <span aria-hidden="true">/ </span>
              <span className="breadcrumb-item">
                <Link to="../">
                  <I18n>settings</I18n>
                </Link>
              </span>{' '}
              <span aria-hidden="true">/ </span>
              <h1>
                <I18n>{currentKapp.name} Settings</I18n>
              </h1>
            </div>
          </div>
          {initialized && <section className="form">{form}</section>}
        </div>
      </div>
    )}
  </KappForm>
);

const mapStateToProps = state => ({
  currentKapp: state.app.kapp,
  reloadApp: state.app.actions.refreshApp,
  queueKappSlug: selectQueueKappSlug(state),
});

// Settings Container
export const ServicesSettings = compose(
  connect(mapStateToProps),
  withHandlers({
    onSave: props => () => () => {
      addToast(`${props.currentKapp.name} settings saved successfully.`);
      props.reloadApp();
    },
  }),
)(ServicesSettingsComponent);
