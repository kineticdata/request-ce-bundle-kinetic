import { Utils } from 'common';

// Find a Kapp by Space Attribute Value
const kappBySpaceAttribute = (state, slugAttributeName) =>
  !state.kinops.loading
    ? state.kinops.kapps.find(
        kapp =>
          kapp.slug ===
          Utils.getAttributeValue(state.kinops.space, slugAttributeName),
      )
    : null;

// Kapp Selectors
export const selectCurrentKapp = state =>
  !state.kinops.loading && state.kinops.kappSlug
    ? state.kinops.kapps.find(kapp => kapp.slug === state.kinops.kappSlug) ||
      null
    : null;

export const selectAdminKapp = state =>
  kappBySpaceAttribute(state, 'Admin Kapp Slug');
export const selectQueueKapp = state =>
  kappBySpaceAttribute(state, 'Queue Kapp Slug');
export const selectServicesKapp = state =>
  kappBySpaceAttribute(state, 'Catalog Kapp Slug');
export const selectTeamsKapp = state =>
  kappBySpaceAttribute(state, 'Teams Kapp Slug');

// Role Selectors
export const selectHasRoleDataAdmin = state =>
  !state.kinops.loading
    ? Utils.isMemberOf(state.kinops.profile, 'Role::Data Admin')
    : false;
export const selectHasRoleSubmissionSupport = state =>
  !state.kinops.loading
    ? Utils.isMemberOf(state.kinops.profile, 'Role::Submission Support')
    : false;
export const selectHasAccessToManagement = state =>
  !state.kinops.loading
    ? state.kinops.profile.spaceAdmin ||
      selectHasRoleDataAdmin(state) ||
      Utils.getTeams(state.kinops.profile).length > 0
    : false;
export const selectHasAccessToSupport = state =>
  !state.kinops.loading
    ? state.kinops.profile.spaceAdmin || selectHasRoleSubmissionSupport(state)
    : false;

export const selectIsGuest = state =>
  !state.kinops.loading
    ? state.kinops.profile.spaceAdmin === false &&
      Utils.getRoles(state.kinops.profile).length === 0
    : false;

// Kapp List Selectors
export const selectPredefinedKapps = state =>
  !state.kinops.loading
    ? [
        selectTeamsKapp(state),
        selectServicesKapp(state),
        selectQueueKapp(state),
      ].filter(kapp => kapp != null)
    : [];
export const selectAdditionalKapps = state =>
  !state.kinops.loading
    ? state.kinops.kapps
        .filter(
          kapp =>
            kapp !== selectAdminKapp(state) &&
            !selectPredefinedKapps(state).includes(kapp),
        )
        .filter(kapp => kapp !== selectCurrentKapp(state))
    : [];
