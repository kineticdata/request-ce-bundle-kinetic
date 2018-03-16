import { bundle } from 'react-kinetic-core';

import { getAttributeValue, isMemberOf, getTeams, getRoles } from '../utils';

export const selectServerUrl = state =>
  state.kinops.space && `/${state.kinops.space.slug}/kinetic-response`;

// Find a Kapp by Space Attribute Value
const kappBySpaceAttribute = (state, slugAttributeName) =>
  !state.kinops.loading
    ? state.kinops.kapps.find(
        kapp =>
          kapp.slug ===
          getAttributeValue(state.kinops.space, slugAttributeName),
      )
    : null;

// Kapp Selectors
export const selectCurrentKapp = state =>
  !state.kinops.loading
    ? state.kinops.kapps.find(kapp => kapp.slug === `${bundle.kappSlug()}`)
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
    ? isMemberOf(state.kinops.profile, 'Role::Data Admin')
    : false;
export const selectHasRoleSubmissionSupport = state =>
  !state.kinops.loading
    ? isMemberOf(state.kinops.profile, 'Role::Submission Support')
    : false;
export const selectHasAccessToManagement = state =>
  !state.kinops.loading
    ? state.kinops.profile.spaceAdmin ||
      selectHasRoleDataAdmin(state) ||
      getTeams(state.kinops.profile).length > 0
    : false;
export const selectHasAccessToSupport = state =>
  !state.kinops.loading
    ? state.kinops.profile.spaceAdmin || selectHasRoleSubmissionSupport(state)
    : false;

export const selectIsGuest = state =>
  !state.kinops.loading
    ? state.kinops.profile.spaceAdmin === false &&
      getRoles(state.kinops.profile).length === 0
    : false;

// Kapp List Selectors
export const selectPredefinedKapps = state =>
  !state.kinops.loading
    ? [
        selectTeamsKapp(state),
        selectServicesKapp(state),
        selectQueueKapp(state),
      ]
        .filter(kapp => kapp != null)
        .filter(kapp => kapp !== selectCurrentKapp(state))
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
