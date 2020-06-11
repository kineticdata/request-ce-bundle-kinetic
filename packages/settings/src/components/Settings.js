import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from '../redux/store';
import { compose, withProps } from 'recompose';
import {
  Icon,
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from 'common';
import { NOTIFICATIONS_FORM_SLUG } from '../redux/modules/settingsNotifications';
import { ROBOT_DEFINITIONS_FORM_SLUG } from '../redux/modules/settingsRobots';
import { PageTitle } from './shared/PageTitle';
import { I18n } from '@kineticdata/react';

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

const SettingsComponent = ({
  isSpaceAdmin,
  showDatastore,
  showNotifications,
  showRobots,
  showSchedulers,
}) => (
  <div className="page-container">
    <PageTitle parts={['Settings']} />
    <div className="page-panel page-panel--white">
      <div className="page-title">
        <h1>
          <I18n>Settings</I18n>
        </h1>
      </div>

      <I18n
        render={translate => (
          <div className="cards__wrapper cards__wrapper--seconds">
            {isSpaceAdmin && (
              <SettingsCard
                name={translate('User Management')}
                path={`/settings/users`}
                icon="fa-users"
                description={translate('Create, Edit and Import Users')}
              />
            )}
            {isSpaceAdmin && (
              <SettingsCard
                name={translate('Team Management')}
                path={`/settings/teams`}
                icon="fa-users"
                description={translate('Create and Edit Teams')}
              />
            )}
            {isSpaceAdmin && (
              <SettingsCard
                name={translate('Space Settings')}
                path={`/settings/space`}
                icon="fa-gear"
                description={translate('View and Modify all Space Settings')}
              />
            )}
            {showDatastore && (
              <SettingsCard
                name={translate('Datastore Forms')}
                path={`/settings/datastore`}
                icon="fa-hdd-o"
                description={translate('View, Create and Edit Reference Data')}
              />
            )}
            {showNotifications && (
              <SettingsCard
                name={translate('Notifications')}
                path={`/settings/notifications`}
                icon="fa-envelope-o"
                description={translate(
                  'View, Create and Edit Email Notifications',
                )}
              />
            )}
            {showRobots && (
              <SettingsCard
                name={translate('Robots')}
                path={`/settings/robots`}
                icon="fa-tasks"
                description={translate('View, Create and Edit Robots')}
              />
            )}
            {isSpaceAdmin && (
              <SettingsCard
                name={translate('Translations')}
                path={`/settings/translations`}
                icon="fa-globe"
                description={translate('View, Create and Edit Translations')}
              />
            )}
            {showSchedulers && (
              <SettingsCard
                name={translate('Schedulers')}
                path={`/settings/schedulers`}
                icon="fa-calendar"
                description={translate('View, Create and Manage Schedulers')}
              />
            )}
          </div>
        )}
      />
    </div>
  </div>
);

const mapStateToProps = state => ({
  forms: state.settingsDatastore.forms,
  isSpaceAdmin: state.app.profile.spaceAdmin,
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(state.app.profile),
  isSchedulerManager: selectHasRoleSchedulerManager(state.app.profile),
});

export const Settings = compose(
  connect(mapStateToProps),
  withProps(props => ({
    showDatastore: props.spaceAdmin || !props.forms.isEmpty(),
    showNotifications: !!props.forms.find(
      form => form.slug === NOTIFICATIONS_FORM_SLUG,
    ),
    showRobots: !!props.forms.find(
      form => form.slug === ROBOT_DEFINITIONS_FORM_SLUG,
    ),
    showSchedulers: props.isSchedulerAdmin || props.isSchedulerManager,
  })),
)(SettingsComponent);
