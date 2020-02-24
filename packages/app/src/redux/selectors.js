import { Utils } from 'common';

// Role Selectors
export const selectHasRoleDataAdmin = state =>
  !state.app.loading
    ? Utils.isMemberOf(state.app.profile, 'Role::Data Admin')
    : false;
export const selectHasRoleSubmissionSupport = state =>
  !state.app.loading
    ? Utils.isMemberOf(state.app.profile, 'Role::Submission Support')
    : false;
export const selectHasAccessToManagement = state =>
  !state.app.loading
    ? state.app.profile.spaceAdmin ||
      selectHasRoleDataAdmin(state) ||
      Utils.getTeams(state.app.profile).length > 0
    : false;
export const selectHasAccessToSupport = state =>
  !state.app.loading
    ? state.app.profile.spaceAdmin || selectHasRoleSubmissionSupport(state)
    : false;

export const selectIsGuest = state =>
  !state.app.loading
    ? state.app.profile.spaceAdmin === false &&
      Utils.getRoles(state.app.profile).length === 0
    : false;
