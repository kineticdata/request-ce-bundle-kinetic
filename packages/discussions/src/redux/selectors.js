import { bundle } from 'react-kinetic-core';
import { Utils } from 'common';
const { getAttributeValue, isMemberOf, getTeams, getRoles } = Utils;

export const selectServerUrl = state =>
  state.app.space && `/${state.app.space.slug}/kinetic-response`;

// Find a Kapp by Space Attribute Value
const kappBySpaceAttribute = (state, slugAttributeName) =>
  !state.app.loading
    ? state.app.kapps.find(
        kapp =>
          kapp.slug ===
          getAttributeValue(state.app.space, slugAttributeName),
      )
    : null;

// Kapp Selectors
export const selectCurrentKapp = state =>
  !state.app.loading
    ? state.app.kapps.find(kapp => kapp.slug === `${bundle.kappSlug()}`)
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
  !state.app.loading
    ? isMemberOf(state.app.profile, 'Role::Data Admin')
    : false;
export const selectHasRoleSubmissionSupport = state =>
  !state.app.loading
    ? isMemberOf(state.app.profile, 'Role::Submission Support')
    : false;
export const selectHasAccessToManagement = state =>
  !state.app.loading
    ? state.app.profile.spaceAdmin ||
      selectHasRoleDataAdmin(state) ||
      getTeams(state.app.profile).length > 0
    : false;
export const selectHasAccessToSupport = state =>
  !state.app.loading
    ? state.app.profile.spaceAdmin || selectHasRoleSubmissionSupport(state)
    : false;

export const selectIsGuest = state =>
  !state.app.loading
    ? state.app.profile.spaceAdmin === false &&
      getRoles(state.app.profile).length === 0
    : false;

// Kapp List Selectors
export const selectPredefinedKapps = state =>
  !state.app.loading
    ? [
        selectTeamsKapp(state),
        selectServicesKapp(state),
        selectQueueKapp(state),
      ]
        .filter(kapp => kapp != null)
        .filter(kapp => kapp !== selectCurrentKapp(state))
    : [];
export const selectAdditionalKapps = state =>
  !state.app.loading
    ? state.app.kapps
        .filter(
          kapp =>
            kapp !== selectAdminKapp(state) &&
            !selectPredefinedKapps(state).includes(kapp),
        )
        .filter(kapp => kapp !== selectCurrentKapp(state))
    : [];
