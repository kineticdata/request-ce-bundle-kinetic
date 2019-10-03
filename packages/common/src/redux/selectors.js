import { Utils } from 'common';

// Role Selectors
export const selectHasRoleSchedulerAdmin = profile =>
  !profile ? false : Utils.isMemberOf(profile, 'Role::Scheduler');
export const selectHasRoleSchedulerManager = profile =>
  !profile ? false : Utils.isMemberOfDescendant(profile, 'Role::Scheduler');
export const selectHasRoleSchedulerAgent = profile =>
  !profile ? false : Utils.isMemberOfDescendant(profile, 'Scheduler');

// Kapp List Selectors
export const selectVisibleKapps = state => {
  if (state.app.loading) {
    return [];
  }
  const adminKappSlug = Utils.getAttributeValue(
    state.app.space,
    'Admin Kapp Slug',
    'admin',
  );
  return state.app.kapps.filter(
    k =>
      k.slug !== adminKappSlug &&
      !Utils.hasAttributeValue(k, 'Hidden', ['True', 'Yes'], true),
  );
};

// Find a Kapp by Space Attribute Value
const selectKappBySlug = (state, slug) =>
  state.app.loading ? null : state.app.kapps.find(kapp => kapp.slug === slug);

export const selectAdminKappSlug = state =>
  Utils.getAttributeValue(state.app.space, 'Admin Kapp Slug', 'admin');
export const selectQueueKappSlug = state =>
  Utils.getAttributeValue(state.app.space, 'Queue Kapp Slug', 'queue');
export const selectServicesKappSlug = state =>
  Utils.getAttributeValue(state.app.space, 'Catalog Kapp Slug', 'services');

export const selectAdminKapp = state =>
  selectKappBySlug(state, selectAdminKappSlug(state));
export const selectQueueKapp = state =>
  selectKappBySlug(state, selectQueueKappSlug(state));
