import * as Utils from '../../utils';

// Discussion Server
export const selectDiscussionsEnabled = state =>
  state.app.space &&
  Utils.getAttributeValue(state.app.space, 'Discussion Server Url', null) ===
    null
    ? false
    : true;

// Get Current Kapp
export const selectCurrentKapp = state =>
  !state.app.loading && state.app.config.kappSlug
    ? state.app.kapps.find(kapp => kapp.slug === state.app.config.kappSlug) ||
      null
    : null;

// Get Current Kapp Slug
export const selectCurrentKappSlug = state => state.app.config.kappSlug;
