import React from 'react';
import { Link, Router } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { Icon, ErrorMessage, LoadingMessage } from 'common';
import { QueueSettings } from './QueueSettings';
import { actions as formActions } from '../../redux/modules/settingsForms';
import { PageTitle } from '../shared/PageTitle';
import { FormList } from './forms/FormList';
import { FormSettings } from './forms/FormSettings';
import { FormActivity } from './forms/FormActivity';
import { FormSubmissions } from './forms/FormSubmissions';
import { I18n } from '@kineticdata/react';
import { connect } from '../../redux/store';

// Wrapper for components that require the form object
export const FormSettingsWrapper = compose(
  connect(
    state => ({
      kapp: state.app.kapp,
      form: state.settingsForms.currentForm,
      loading: state.settingsForms.loading,
      error: state.settingsForms.error,
    }),
    { fetchFormRequest: formActions.fetchForm },
  ),
  lifecycle({
    componentWillMount(prev, next) {
      this.props.fetchFormRequest({
        kappSlug: this.props.kapp.slug,
        formSlug: this.props.formSlug,
      });
    },
  }),
)(
  ({ form, error, loading }) =>
    loading || error || !form ? (
      <div className="page-container">
        <PageTitle parts={[form && form.name, `Forms`]} />
        <div className="page-panel page-panel--white">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="../../../">
                  <I18n>queue</I18n>
                </Link>{' '}
                /{` `}
                <Link to="../../">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{` `}
                <Link to="../">
                  <I18n>forms</I18n>
                </Link>{' '}
                /{` `}
              </h3>
            </div>
          </div>
          {error ? (
            <ErrorMessage message={error.message} />
          ) : (
            <LoadingMessage />
          )}
        </div>
      </div>
    ) : (
      <Router>
        <FormSettings form={form} path="settings" />
        <FormActivity form={form} path="submissions/:id" />
        <FormSubmissions form={form} default />
      </Router>
    ),
);

export const Settings = () => (
  <Router>
    <QueueSettings path="general" />
    <FormList path="forms" />
    <FormSettingsWrapper path="forms/:formSlug/*" />
    {/* <FormActivity path="forms/:id/activity" /> */}
    <SettingsNavigation default />
  </Router>
);

const SettingsCard = ({ path, icon, name, description }) => (
  <Link to={path} className="card card--settings">
    <h1>
      <Icon image={icon || 'fa-sticky-note-o'} background="blueSlate" />
      <I18n>{name}</I18n>
    </h1>
    <p>
      <I18n>{description}</I18n>
    </p>
  </Link>
);

const SettingsNavigationComponent = ({ isSpaceAdmin }) => (
  <div className="page-container">
    <div className="page-panel page-panel--white">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">
              <I18n>queue</I18n>
            </Link>{' '}
            /{` `}
          </h3>
          <h1>
            <I18n>Settings</I18n>
          </h1>
        </div>
      </div>

      <div className="cards__wrapper cards__wrapper--seconds">
        {isSpaceAdmin && (
          <SettingsCard
            name="General Settings"
            path={`/kapps/queue/settings/general`}
            icon="fa-gear"
            description="View and Modify all Queue Settings"
          />
        )}
        <SettingsCard
          name="Forms"
          path={`/kapps/queue/settings/forms`}
          icon="fa-gear"
          description="View Forms and their Submissions."
        />
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  isSpaceAdmin: state.app.profile.spaceAdmin,
});

export const SettingsNavigation = compose(connect(mapStateToProps))(
  SettingsNavigationComponent,
);
