import { Utils } from 'common';

// Role Selectors
export const selectHasRoleSchedulerAdmin = state =>
  !state.app.loading
    ? Utils.isMemberOf(state.app.profile, 'Role::Scheduler')
    : false;
export const selectHasRoleSchedulerManager = state =>
  !state.app.loading
    ? Utils.isMemberOfDescendant(state.app.profile, 'Role::Scheduler')
    : false;
export const selectHasRoleSchedulerAgent = state =>
  !state.app.loading
    ? Utils.isMemberOfDescendant(state.app.profile, 'Scheduler')
    : false;
export const selectHasRoleCurrentSchedulerManager = state =>
  !state.common.schedulers.scheduler.loading
    ? Utils.isMemberOf(
        state.app.profile,
        `Role::Scheduler::${state.common.schedulers.scheduler.data.name}`,
      )
    : false;
