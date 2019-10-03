import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { I18n, SpaceForm } from '@kineticdata/react';
import { compose, withHandlers } from 'recompose';
import { connect } from '../../redux/store';

import {
  FormComponents,
  addToast,
  selectVisibleKapps,
  selectAdminKappSlug,
  selectQueueKappSlug,
  selectServicesKappSlug,
} from 'common';
import { PageTitle } from '../shared/PageTitle';

const fieldSet = [
  'name',
  'defaultLocale',
  'defaultTimezone',
  'attributesMap',
  'defaultKappDisplay',
  'defaultServiceDaysDue',
  'defaultTaskAssigneeTeam',
  'defaultApprovalForm',
  'feedbackFormSlug',
  'helpFormSlug',
  'requestAlertFormSlug',
  'suggestAServiceFormSlug',
  'defaultTaskFormSlug',
];

const Layout = ({ fields, error, buttons }) => (
  <Fragment>
    <h2 className="section__title">
      <I18n>Display Options</I18n>
    </h2>
    {fields.get('name')}
    <div className="form-group__columns">
      {fields.get('defaultLocale')}
      {fields.get('defaultTimezone')}
    </div>
    {fields.get('defaultKappDisplay')}
    <h2 className="section__title">
      <I18n>Workflow Options</I18n>
    </h2>
    {fields.get('defaultServiceDaysDue')}
    {fields.get('defaultTaskAssigneeTeam')}
    <h2 className="section__title">
      <I18n>Form Mapping</I18n>
    </h2>
    {fields.get('defaultApprovalForm')}
    {fields.get('feedbackFormSlug')}
    {fields.get('helpFormSlug')}
    {fields.get('requestAlertFormSlug')}
    {fields.get('suggestAServiceFormSlug')}
    {fields.get('defaultTaskFormSlug')}
    {error}
    {buttons}
  </Fragment>
);

const initialFormValue = (object, attributeName) =>
  object.hasIn(['attributesMap', attributeName, 0])
    ? { slug: object.getIn(['attributesMap', attributeName, 0]) }
    : null;
const asArray = value => (value ? [value] : []);

export const SpaceSettingsComponent = ({
  children,
  onSave,
  visibleKapps,
  adminKappSlug,
  queueKappSlug,
  servicesKappSlug,
}) => (
  <SpaceForm
    fieldSet={fieldSet}
    onSave={onSave}
    addFields={() => ({ space }) =>
      space && [
        {
          name: 'defaultKappDisplay',
          label: 'Default Kapp Display',
          type: 'select',
          helpText:
            'Allows Space Administrators to set a default Kapp that will display for Users in their Space. This can be overridden by a User Profile Attribute.',
          options: [
            { label: 'Discussions', value: 'discussions' },
            ...visibleKapps.map(kapp => ({
              label: kapp.name,
              value: kapp.slug,
            })),
          ],
          initialValue: space.getIn([
            'attributesMap',
            'Default Kapp Display',
            0,
          ]),
        },
        {
          name: 'defaultServiceDaysDue',
          label: 'Default Service Days Due',
          type: 'text',
          helpText:
            'Number of days until service is expected to be fulfilled - Overridden by Form / Kapp Attribute',
          initialValue: space.getIn(['attributesMap', 'Service Days Due', 0]),
          component: FormComponents.IntegerField,
        },
        {
          name: 'defaultTaskAssigneeTeam',
          label: 'Task Assignee Team',
          type: 'team',
          helpText: 'Team to assign tasks to if not defined in a form or kapp.',
          initialValue: space.hasIn(['attributesMap', 'Task Assignee Team', 0])
            ? { name: space.getIn(['attributesMap', 'Task Assignee Team', 0]) }
            : null,
        },
        {
          name: 'defaultApprovalForm',
          label: 'Approval Form Slug',
          type: 'form',
          helpText:
            'The Queue kapp form which approvals should be created in (Overridden by Kapp and Form Attributes)',
          initialValue: initialFormValue(space, 'Approval Form Slug'),
          search: { kappSlug: queueKappSlug },
        },
        {
          name: 'feedbackFormSlug',
          label: 'Feedback Form',
          type: 'form',
          helpText: 'Form used for collecting feedback throughout the portal.',
          initialValue: initialFormValue(space, 'Feedback Form Slug'),
          search: { kappSlug: adminKappSlug },
        },
        {
          name: 'helpFormSlug',
          label: 'Help Form',
          type: 'form',
          helpText: 'Form used for requesting help throughout the portal.',
          initialValue: initialFormValue(space, 'Help Form Slug'),
          search: { kappSlug: adminKappSlug },
        },
        {
          name: 'requestAlertFormSlug',
          label: 'Request Alert Form',
          type: 'form',
          helpText:
            'Form used for requesting an alert be displayed in the portal.',
          initialValue: initialFormValue(space, 'Request Alert Form Slug'),
          search: { kappSlug: adminKappSlug },
        },
        {
          name: 'suggestAServiceFormSlug',
          label: 'Suggest a Service Form',
          type: 'form',
          helpText:
            'Form used to request a new service be added to the portal.',
          initialValue: initialFormValue(space, 'Suggest a Service Form Slug'),
          search: { kappSlug: servicesKappSlug },
        },
        {
          name: 'defaultTaskFormSlug',
          label: 'Default Task Form Slug',
          type: 'form',
          helpText:
            'The Queue kapp form to use when creating a task item (Overridden by Kapp and Form Attributes)',
          initialValue: initialFormValue(space, 'Task Form Slug'),
          search: { kappSlug: queueKappSlug },
        },
      ]}
    alterFields={{
      name: {
        helpText: 'The Name of the Space Referenced Throughout the System',
      },
      attributesMap: {
        serialize: ({ values }) => ({
          'Default Kapp Display': asArray(values.get('defaultKappDisplay')),
          'Service Days Due': asArray(values.get('defaultServiceDaysDue')),
          'Task Assignee Team': asArray(
            values.getIn(['defaultTaskAssigneeTeam', 'name']),
          ),
          'Approval Form Slug': asArray(
            values.getIn(['defaultApprovalForm', 'slug']),
          ),
          'Feedback Form Slug': asArray(
            values.getIn(['feedbackFormSlug', 'slug']),
          ),
          'Help Form Slug': asArray(values.getIn(['helpFormSlug', 'slug'])),
          'Request Alert Form Slug': asArray(
            values.getIn(['requestAlertFormSlug', 'slug']),
          ),
          'Suggest a Service Form Slug': asArray(
            values.getIn(['suggestAServiceFormSlug', 'slug']),
          ),
          'Task Form Slug': asArray(
            values.getIn(['defaultTaskFormSlug', 'slug']),
          ),
        }),
      },
    }}
    components={{
      FormLayout: Layout,
    }}
  >
    {({ form, initialized }) =>
      initialized && (
        <div className="page-container">
          <PageTitle parts={['System Settings']} />
          <div className="page-panel page-panel--white">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>
                  <Link to="/settings">
                    <I18n>settings</I18n>
                  </Link>{' '}
                  /{` `}
                </h3>
                <h1>
                  <I18n>System Settings</I18n>
                </h1>
              </div>
            </div>
            <section className="form">{form}</section>
          </div>
        </div>
      )
    }
  </SpaceForm>
);

const mapStateToProps = state => ({
  loading: state.app.loading,
  reloadApp: state.app.actions.refreshApp,
  visibleKapps: selectVisibleKapps(state),
  adminKappSlug: selectAdminKappSlug(state),
  queueKappSlug: selectQueueKappSlug(state),
  servicesKappSlug: selectServicesKappSlug(state),
});

// Settings Container
export const SpaceSettings = compose(
  connect(mapStateToProps),
  withHandlers({
    onSave: props => () => () => {
      addToast('System settings saved successfully.');
      props.reloadApp();
    },
  }),
)(SpaceSettingsComponent);
