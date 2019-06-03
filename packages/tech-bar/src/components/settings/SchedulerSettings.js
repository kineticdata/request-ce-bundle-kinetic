import React from 'react';
import { connect } from '../../redux/store';
import { compose, lifecycle } from 'recompose';
import { Router } from '../../App';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  ErrorUnauthorized,
  CreateScheduler,
  Scheduler,
  SchedulersList,
} from 'common';
import { actions } from '../../redux/modules/techBarApp';

export const SchedulerSettingsComponent = ({
  kapp,
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
        pathPrefix={`/kapps/${kapp.slug}/settings/schedulers`}
        breadcrumbs={[
          {
            label: 'tech bar',
            path: `/kapps/${kapp.slug}`,
          },
          {
            label: 'settings',
            path: `/kapps/${kapp.slug}/settings`,
          },
          {
            label: 'schedulers',
            path: `/kapps/${kapp.slug}/settings/schedulers`,
          },
        ]}
      />
      <Scheduler
        path=":id"
        profile={profile}
        pathPrefix={`/kapps/${kapp.slug}/settings/schedulers`}
        breadcrumbs={[
          {
            label: 'tech bar',
            path: `/kapps/${kapp.slug}`,
          },
          {
            label: 'settings',
            path: `/kapps/${kapp.slug}/settings`,
          },
          {
            label: 'schedulers',
            path: `/kapps/${kapp.slug}/settings/schedulers`,
          },
        ]}
      />
      <SchedulersList
        default
        profile={profile}
        pathPrefix={`/kapps/${kapp.slug}/settings/schedulers`}
        breadcrumbs={[
          {
            label: 'tech bar',
            path: `/kapps/${kapp.slug}`,
          },
          {
            label: 'settings',
            path: `/kapps/${kapp.slug}/settings`,
          },
        ]}
      />
    </Router>
  ) : (
    <ErrorUnauthorized />
  );

export const mapStateToProps = (state, props) => ({
  kapp: state.app.kapp,
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(state.app.profile),
  isSchedulerManager: selectHasRoleSchedulerManager(state.app.profile),
  profile: state.app.profile,
});

export const mapDispatchToProps = {
  fetchAppDataRequest: actions.fetchAppDataRequest,
};

export const SchedulerSettings = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillUnmount() {
      this.props.fetchAppDataRequest(true);
    },
  }),
)(SchedulerSettingsComponent);
