import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { I18n, SpaceForm } from '@kineticdata/react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { FormComponents } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { context } from '../../redux/store';

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
    <div className="row">
      <div className="col-12">{fields.get('name')}</div>
    </div>
    <div className="row">
      <div className="col-6">{fields.get('defaultLocale')}</div>
      <div className="col-6">{fields.get('defaultTimezone')}</div>
    </div>
    <div className="row">
      <div className="col-12">{fields.get('defaultKappDisplay')}</div>
    </div>
    <h2 className="section__title">
      <I18n>Workflow Options</I18n>
    </h2>
    <div className="row">
      <div className="col-12">{fields.get('defaultServiceDaysDue')}</div>
    </div>
    <div className="row">
      <div className="col-12">{fields.get('defaultTaskAssigneeTeam')}</div>
    </div>
    <h2 className="section__title">
      <I18n>Form Mapping</I18n>
    </h2>
    <div className="row">
      <div className="col-12">{fields.get('defaultApprovalForm')}</div>
    </div>
    <div className="row">
      <div className="col-12">{fields.get('feedbackFormSlug')}</div>
    </div>
    <div className="row">
      <div className="col-12">{fields.get('helpFormSlug')}</div>
    </div>
    <div className="row">
      <div className="col-12">{fields.get('requestAlertFormSlug')}</div>
    </div>
    <div className="row">
      <div className="col-12">{fields.get('suggestAServiceFormSlug')}</div>
    </div>
    <div className="row">
      <div className="col-12">{fields.get('defaultTaskFormSlug')}</div>
    </div>
    {error}
    {buttons}
  </Fragment>
);

export const SpaceSettingsComponent = ({ children, reloadApp, kapps }) => (
  <SpaceForm
    fieldSet={fieldSet}
    onSave={reloadApp}
    addFields={[
      {
        name: 'defaultKappDisplay',
        label: 'Default Kapp Display',
        type: 'select',
        helpText:
          'Allows Space Administrators to set a default Kapp that will display for Users in their Space. This can be overridden by a User Profile Attribute.',
        options: kapps
          ? kapps.map(kapp => ({
              label: kapp.name,
              value: kapp.slug,
            }))
          : [],
        initialValue: ({ space }) =>
          space
            ? space.getIn(['attributesMap', 'Default Kapp Display', 0])
            : '',
      },
      {
        name: 'defaultServiceDaysDue',
        label: 'Default Service Days Due',
        type: 'text',
        helpText:
          'Number of days until service is expected to be fulfilled - Overridden by Form / Kapp Attribute',
        initialValue: ({ space }) =>
          space ? space.getIn(['attributesMap', 'Service Days Due', 0]) : '',
      },
      {
        name: 'defaultTaskAssigneeTeam',
        label: 'Task Assignee Team',
        type: 'team',
        helpText: 'Team to assign tasks to if not defined in a form or kapp.',
        initialValue: ({ space }) =>
          space
            ? { name: space.getIn(['attributesMap', 'Task Assignee Team', 0]) }
            : '',
      },
      {
        name: 'defaultApprovalForm',
        label: 'Approval Form Slug',
        type: 'text',
        helpText:
          'The Queue kapp form which approvals should be created in (Overridden by Kapp and Form Attributes)',
        initialValue: ({ space }) =>
          space ? space.getIn(['attributesMap', 'Approval Form Slug', 0]) : '',
      },
      {
        name: 'feedbackFormSlug',
        label: 'Feedback Form',
        type: 'text',
        helpText: 'Form used for collecting feedback throughout the portal.',
        initialValue: ({ space }) =>
          space ? space.getIn(['attributesMap', 'Feedback Form Slug', 0]) : '',
      },
      {
        name: 'helpFormSlug',
        label: 'Help Form',
        type: 'text',
        helpText: 'Form used for requesting help throughout the portal.',
        initialValue: ({ space }) =>
          space ? space.getIn(['attributesMap', 'Help Form Slug', 0]) : '',
      },
      {
        name: 'requestAlertFormSlug',
        label: 'Request Alert Form',
        type: 'text',
        helpText:
          'Form used for requesting an alert be displayed in the portal.',
        initialValue: ({ space }) =>
          space
            ? space.getIn(['attributesMap', 'Request Alert Form Slug', 0])
            : '',
      },
      {
        name: 'suggestAServiceFormSlug',
        label: 'Suggest a Service Form',
        type: 'text',
        helpText: 'Form used to request a new service be added to the portal.',
        initialValue: ({ space }) =>
          space
            ? space.getIn(['attributesMap', 'Suggest a Service Form Slug', 0])
            : '',
      },
      {
        name: 'defaultTaskFormSlug',
        label: 'Default Task Form Slug',
        type: 'text',
        helpText:
          'The Queue kapp form to use when creating a task item (Overridden by Kapp and Form Attributes)',
        initialValue: ({ space }) =>
          space ? space.getIn(['attributesMap', 'Task Form Slug', 0]) : '',
      },
    ]}
    alterFields={{
      name: {
        helpText: 'The Name of the Space Referenced Throughout the System',
      },
      attributesMap: {
        serialize: ({ values }) => ({
          'Default Kapp Display': [values.get('defaultKappDisplay')],
          'Service Days Due': [values.get('defaultServiceDaysDue')],
          'Task Assignee Team': [values.get('defaultTaskAssigneeTeam')],
          'Approval Form Slug': [values.get('defaultApprovalForm')],
          'Feedback Form Slug': [values.get('feedbackFormSlug')],
          'Help Form Slug': [values.get('helpFormSlug')],
          'Request Alert Form Slug': [values.get('requestAlertFormSlug')],
          'Suggest a Service Slug': [values.get('suggestAServiceFormSlug')],
          'Task Form Slug': [values.get('defaultTaskFormSlug')],
        }),
      },
      defaultServiceDaysDue: {
        component: FormComponents.IntegerField,
      },
    }}
    components={{
      FormLayout: Layout,
    }}
  >
    {({ form, initialized }) =>
      initialized && (
        <div className="page-container page-container--space-settings">
          <PageTitle parts={['System Settings']} />
          <div className="page-panel page-panel--scrollable page-panel--space-profile-edit">
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
            <section>{form}</section>
          </div>
        </div>
      )
    }
  </SpaceForm>
);

const mapStateToProps = state => ({
  reloadApp: state.app.actions.refreshApp,
  kapps: state.app.kapps,
  loading: state.app.loading,
});

// Settings Container
export const SpaceSettings = compose(
  connect(
    mapStateToProps,
    null,
    null,
    { context },
  ),
)(SpaceSettingsComponent);
