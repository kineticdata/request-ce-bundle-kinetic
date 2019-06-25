import * as Utils from '../../utils';
// TODO remove after all instances are removed

// Discussion Server
export const selectDiscussionsEnabled = state =>
  state.app.space &&
  Utils.getAttributeValue(state.app.space, 'Discussion Server Url', null) ===
    null
    ? false
    : true;

// Get Current Kapp
export const selectCurrentKapp = state =>
  !state.app.loading && state.app.kappSlug
    ? state.app.kapps.find(kapp => kapp.slug === state.app.kappSlug) || null
    : null;

// Get Current Kapp Slug
export const selectCurrentKappSlug = state => state.app.kappSlug;
