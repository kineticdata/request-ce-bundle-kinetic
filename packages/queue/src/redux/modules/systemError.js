export const types = {
  SET_SYSTEM_ERROR: '@kd/catalog/SET_SYSTEM_ERROR',
  CLEAR_SYSTEM_ERROR: '@kd/catalog/CLEAR_SYSTEM_ERROR',
};

export const actions = {
  setSystemError: error => ({ type: types.SET_SYSTEM_ERROR, payload: error }),
  clearSystemError: () => ({ type: types.CLEAR_SYSTEM_ERROR }),
};

export const defaultState = {
  system: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.SET_SYSTEM_ERROR:
      return { ...state, system: action.payload };
    case types.CLEAR_SYSTEM_ERROR:
      return { ...defaultState };
    default:
      return state;
  }
};

export default reducer;
