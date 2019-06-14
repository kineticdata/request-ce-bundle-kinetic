import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from '../redux/store';
import { compose } from 'recompose';
import {
  Icon,
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from 'common';
import { PageTitle } from './shared/PageTitle';
import { I18n } from '@kineticdata/react';

const SettingsCard = ({ path, icon, name, description }) => (
  <Link to={path} className="card card--service">
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
  isSchedulerAdmin,
  isSchedulerManager,
}) => (
  <div className="page-container page-container--space-settings">
    <PageTitle parts={['Settings']} />
    <div className="page-panel page-panel--datastore-content">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h1>
            <I18n>Settings</I18n>
          </h1>
        </div>
      </div>

      <I18n
        render={translate => (
          <div className="cards__wrapper cards__wrapper--services">
            {isSpaceAdmin && (
              <Fragment>
                <SettingsCard
                  name={translate('User Management')}
                  path={`/settings/users`}
                  icon="fa-users"
                  description={translate('Create, Edit and Import Users')}
                />

                <SettingsCard
                  name={translate('Team Management')}
                  path={`/settings/teams`}
                  icon="fa-users"
                  description={translate('Create and Edit Teams')}
                />

                <SettingsCard
                  name={translate('System Settings')}
                  path={`/settings/system`}
                  icon="fa-gear"
                  description={translate('View and Modify all System Settings')}
                />

                <SettingsCard
                  name={translate('Datastore Forms')}
                  path={`/settings/datastore`}
                  icon="fa-hdd-o"
                  description={translate(
                    'View, Create and Edit Reference Data',
                  )}
                />
                <SettingsCard
                  name={translate('Notifications')}
                  path={`/settings/notifications`}
                  icon="fa-envelope-o"
                  description={translate(
                    'View, Create and Edit Email Notifications',
                  )}
                />
                <SettingsCard
                  name={translate('Robots')}
                  path={`/settings/robots`}
                  icon="fa-tasks"
                  description={translate('View, Create and Edit Robots')}
                />
                <SettingsCard
                  name={translate('Translations')}
                  path={`/settings/translations`}
                  icon="fa-globe"
                  description={translate('View, Create and Edit Translations')}
                />
              </Fragment>
            )}
            {(isSchedulerAdmin || isSchedulerManager) && (
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
  isSpaceAdmin: state.app.profile.spaceAdmin,
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(state.app.profile),
  isSchedulerManager: selectHasRoleSchedulerManager(state.app.profile),
});

export const Settings = compose(connect(mapStateToProps))(SettingsComponent);
