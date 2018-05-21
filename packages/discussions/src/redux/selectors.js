export const selectServerUrl = state =>
  state.app.space && `/${state.app.space.slug}/kinetic-response`;
