export const selectServerUrl = state =>
  state.app.app.space && `/${state.app.app.space.slug}/kinetic-response`;
