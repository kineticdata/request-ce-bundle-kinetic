export const types = {
  SYNC_APP_STATE: 'SYNC_APP_STATE',
};

export const reducer = (state = {}, action) => {
  let newState = { ...state };
  if (action.type === types.SYNC_APP_STATE) {
    newState[action.payload.key] = action.payload.value;
  }
  if (
    newState.space &&
    newState.profile &&
    newState.kappSlug &&
    newState.layoutSize
  ) {
    newState.ready = true;
  } else {
    newState.ready = false;
  }
  return newState;
};
