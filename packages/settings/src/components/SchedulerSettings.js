import React from 'react';
import { connect } from '../redux/store';
import { compose, lifecycle } from 'recompose';
import { Router } from '../App';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  ErrorUnauthorized,
  CreateScheduler,
  Scheduler,
  SchedulersList,
} from 'common';

export const SchedulerSettingsComponent = ({
  isSchedulerAdmin,
  isSchedulerManager,
  profile,
}) =>
  isSchedulerAdmin || isSchedulerManager ? (
    <Router>
      <CreateScheduler
        path="new"
        profile={profile}
        type="TechBar"
        pathPrefix={`/settings/schedulers`}
        breadcrumbs={[
          {
            label: 'settings',
            path: '/settings',
          },
          {
            label: 'schedulers',
            path: '/settings/schedulers',
          },
        ]}
      />
      <Scheduler
        path=":id"
        profile={profile}
        pathPrefix={`/settings/schedulers`}
        breadcrumbs={[
          {
            label: 'settings',
            path: '/settings',
          },
          {
            label: 'schedulers',
            path: '/settings/schedulers',
          },
        ]}
      />
      <SchedulersList
        default
        profile={profile}
        pathPrefix={`/settings/schedulers`}
        breadcrumbs={[
          {
            label: 'settings',
            path: '/settings',
          },
        ]}
      />
    </Router>
  ) : (
    <ErrorUnauthorized />
  );

export const mapStateToProps = (state, props) => ({
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(state.app.profile),
  isSchedulerManager: selectHasRoleSchedulerManager(state.app.profile),
  profile: state.app.profile,
});

export const SchedulerSettings = compose(
  connect(mapStateToProps),
  lifecycle({
    componentWillUnmount() {},
  }),
)(SchedulerSettingsComponent);
