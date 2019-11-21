import React from 'react';
import { Icon } from 'common';
import { Link, Router } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { ErrorMessage, LoadingMessage } from 'common';
import { PageTitle } from '../shared/PageTitle';
import { ServicesSettings } from './services_settings/ServicesSettings';
import { actions } from '../../redux/modules/settingsServices';
import { actions as formActions } from '../../redux/modules/settingsForms';
import { FormsList } from './forms/FormsList';
import { FormSettings } from './forms/FormSettings';
import { FormDetails } from './forms/FormDetails';
import { FormActivity } from './forms/FormActivity';
import { CreateForm } from './forms/CreateForm';
import { CategorySettings } from './categories/CategorySettings';
import { I18n } from '@kineticdata/react';
import { connect } from '../../redux/store';

// Wrapper for components that require the form object
export const FormSettingsWrapper = compose(
  connect(
    state => ({
      kapp: state.app.kapp,
      form: state.settingsForms.form,
      error: state.settingsForms.error,
    }),
    { fetchFormRequest: formActions.fetchFormRequest },
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
  ({ form, error }) =>
    error || !form ? (
      <div className="page-container">
        <PageTitle parts={[form && form.name, `Forms`]} />
        <div className="page-panel page-panel--white">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="../../../">
                  <I18n>services</I18n>
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
        <FormDetails form={form} default />
      </Router>
    ),
);

export const SettingsComponent = ({ kappSlug }) => (
  <Router>
    <ServicesSettings path="general" />
    <FormsList path="forms" />
    <CreateForm path="forms/new" />
    <CreateForm path="forms/clone/:id" />
    <FormSettingsWrapper path="forms/:formSlug/*" />
    <FormActivity path="forms/:id/activity" />
    <CategorySettings path="categories/*" />
    <SettingsNavigation default />
  </Router>
);

const mapStateToProps = (state, props) => ({
  kappSlug: state.app.kappSlug,
});

const mapDispatchToProps = {
  fetchServicesSettings: actions.fetchServicesSettings,
};

export const Settings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount(prev, next) {
      this.props.fetchServicesSettings();
    },
  }),
)(SettingsComponent);

const SettingsCard = ({ path, icon, name, description }) => (
  <Link to={path} className="card card--service">
    <h1>
      <Icon image={icon || 'fa-gear'} background="blueSlate" />
      <I18n>{name}</I18n>
    </h1>
    <p>
      <I18n>{description}</I18n>
    </p>
  </Link>
);

const SettingsNavigationComponent = ({ kapp, isSpaceAdmin }) => (
  <div className="page-container">
    <PageTitle parts={[]} />
    <div className="page-panel page-panel--white">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="../">
              <I18n>{kapp.name.toLowerCase()}</I18n>
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
            path="general"
            icon="fa-gear"
            description="View and Modify all Services Settings"
          />
        )}
        <SettingsCard
          name="Forms"
          path="forms"
          icon="fa-gear"
          description="View Forms and their Submissions."
        />
        {isSpaceAdmin && (
          <SettingsCard
            name="Categories"
            path="categories"
            icon="fa-gear"
            description="View and Modify Categories"
          />
        )}
      </div>
    </div>
  </div>
);

const mapStateToPropsNav = state => ({
  kapp: state.app.kapp,
  isSpaceAdmin: state.app.profile.spaceAdmin,
});

export const SettingsNavigation = compose(connect(mapStateToPropsNav))(
  SettingsNavigationComponent,
);
