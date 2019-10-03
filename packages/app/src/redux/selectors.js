import { Utils } from 'common';

// Find a Kapp by Space Attribute Value
const kappBySpaceAttribute = (state, slugAttributeName) =>
  state.app.loading
    ? null
    : state.app.kapps.find(
        kapp =>
          kapp.slug ===
          Utils.getAttributeValue(state.app.space, slugAttributeName),
      );

export const selectAdminKapp = state =>
  kappBySpaceAttribute(state, 'Admin Kapp Slug');
export const selectQueueKapp = state =>
  kappBySpaceAttribute(state, 'Queue Kapp Slug');
export const selectServicesKapp = state =>
  kappBySpaceAttribute(state, 'Catalog Kapp Slug');
export const selectTeamsKapp = state =>
  kappBySpaceAttribute(state, 'Teams Kapp Slug');
export const selectTechBarKapp = state =>
  kappBySpaceAttribute(state, 'Tech Bar Kapp Slug');

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
