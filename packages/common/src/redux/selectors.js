import { Utils } from 'common';

// Role Selectors
export const selectHasRoleSchedulerAdmin = profile =>
  !profile ? false : Utils.isMemberOf(profile, 'Role::Scheduler');
export const selectHasRoleSchedulerManager = profile =>
  !profile ? false : Utils.isMemberOfDescendant(profile, 'Role::Scheduler');
export const selectHasRoleSchedulerAgent = profile =>
  !profile ? false : Utils.isMemberOfDescendant(profile, 'Scheduler');
