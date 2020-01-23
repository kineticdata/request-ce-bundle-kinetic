import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { lifecycle, compose, withHandlers } from 'recompose';
import { bundle } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';
import { I18n, FormForm } from '@kineticdata/react';
import { actions } from '../../redux/modules/settingsDatastore';
import { context } from '../../redux/store';

const fieldSet = [
  'name',
  'slug',
  'description',
  'status',
  'submissionLabelExpression',
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
    {fields.get('submissionLabelExpression')}
    {fields.get('useCustomWorkflow')}
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

const SettingsComponent = ({ kappSlug, canManage, origForm, loading }) =>
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
                <I18n>{origForm.name}</I18n> /{` `}
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
          {true ? (
            <div className="datastore-settings">
              <div className="form settings">
                <FormForm
                  datastore={true}
                  //   kappSlug={kappSlug}
                  formSlug={origForm.slug}
                  fieldSet={fieldSet}
                  components={{ FormLayout }}
                  addFields={() => ({ form }) =>
                    form && [
                      {
                        name: 'useCustomWorkflow',
                        label: 'Use Custom Workflow',
                        type: 'checkbox',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Use Custom Workflow',
                          0,
                        ]),
                      },
                      {
                        name: 'scoring',
                        label: 'Scoring',
                        type: 'checkbox',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Scoring',
                          0,
                        ]),
                      },
                      {
                        name: 'multiLanguageNotifications',
                        label: 'Multi-language Notifications',
                        type: 'checkbox',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Multi-language Notifications',
                          0,
                        ]),
                      },
                      {
                        name: 'lowScoreNotification',
                        label: 'Low Score Notification',
                        type: 'checkbox',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Low Score Notification',
                          0,
                        ]),
                      },
                      {
                        name: 'sendReminders',
                        label: 'Send Reminders',
                        type: 'checkbox',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Send Reminders',
                          0,
                        ]),
                      },
                      {
                        name: 'invitationNotifications',
                        label: 'Invitation Notifications',
                        type: 'checkbox',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Invitation Notifications',
                          0,
                        ]),
                      },
                      {
                        name: 'reminderNotifications',
                        label: 'Reminder Notifications',
                        type: 'checkbox',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Reminder Notifications',
                          0,
                        ]),
                      },
                      {
                        name: 'allowOptOut',
                        label: 'Allow Opt Out',
                        type: 'checkbox',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Allow Opt Out',
                          0,
                        ]),
                      },
                      {
                        name: 'maxInvitations',
                        label: 'Max Invitations Per User Per Day',
                        type: 'text',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Max Invitations Per User Per Day',
                          0,
                        ]),
                      },
                      {
                        name: 'eventsRequired',
                        label: 'Events Required to Trigger Survey',
                        type: 'text',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Events Required to Trigger Survey',
                          0,
                        ]),
                      },
                      {
                        name: 'owningTeam',
                        label: 'Owning Team',
                        type: 'text',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Owning Team',
                          0,
                        ]),
                      },
                      {
                        name: 'authentication',
                        label: 'Authentication',
                        type: 'text',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Authentication',
                          0,
                        ]),
                      },
                      {
                        name: 'assignedIndividual',
                        label: 'Assigned Individual',
                        type: 'text',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Assigned Individual',
                          0,
                        ]),
                      },
                      {
                        name: 'submitter',
                        label: 'Submitter',
                        type: 'text',
                        helpText: 'TBD',
                        initialValue: form.getIn([
                          'attributesMap',
                          'Submitter',
                          0,
                        ]),
                      },
                    ]}
                />
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
)(SettingsComponent);
