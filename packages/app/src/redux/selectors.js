import { Utils } from 'common';

// Find a Kapp by Space Attribute Value
const kappBySpaceAttribute = (state, slugAttributeName) =>
  !state.app.app.loading
    ? state.app.app.kapps.find(
        kapp =>
          kapp.slug ===
          Utils.getAttributeValue(state.app.app.space, slugAttributeName),
      )
    : null;

// Kapp Selectors
export const selectCurrentKapp = state =>
  !state.app.app.loading && state.app.app.kappSlug
    ? state.app.app.kapps.find(kapp => kapp.slug === state.app.app.kappSlug) ||
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
  !state.app.app.loading
    ? Utils.isMemberOf(state.app.app.profile, 'Role::Data Admin')
    : false;
export const selectHasRoleSubmissionSupport = state =>
  !state.app.app.loading
    ? Utils.isMemberOf(state.app.app.profile, 'Role::Submission Support')
    : false;
export const selectHasAccessToManagement = state =>
  !state.app.app.loading
    ? state.app.app.profile.spaceAdmin ||
      selectHasRoleDataAdmin(state) ||
      Utils.getTeams(state.app.app.profile).length > 0
    : false;
export const selectHasAccessToSupport = state =>
  !state.app.app.loading
    ? state.app.app.profile.spaceAdmin || selectHasRoleSubmissionSupport(state)
    : false;

export const selectIsGuest = state =>
  !state.app.app.loading
    ? state.app.app.profile.spaceAdmin === false &&
      Utils.getRoles(state.app.app.profile).length === 0
    : false;

// Kapp List Selectors
export const selectPredefinedKapps = state =>
  !state.app.app.loading
    ? [
        selectTeamsKapp(state),
        selectServicesKapp(state),
        selectQueueKapp(state),
      ].filter(kapp => kapp != null)
    : [];
export const selectAdditionalKapps = state =>
  !state.app.app.loading
    ? state.app.app.kapps
        .filter(
          kapp =>
            kapp !== selectAdminKapp(state) &&
            !selectPredefinedKapps(state).includes(kapp),
        )
        .filter(kapp => kapp !== selectCurrentKapp(state))
    : [];
