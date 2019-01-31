import { LOCATION_CHANGE } from 'connected-react-router';

export const types = {
  SEACH_INPUT_CHANGE: '@kd/catalog/SEACH_INPUT_CHANGE',
};

export const actions = {
  searchInputChange: value => ({
    type: types.SEACH_INPUT_CHANGE,
    payload: value,
  }),
};

export const defaultState = {
  inputValue: '',
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.SEACH_INPUT_CHANGE:
      return { ...state, inputValue: action.payload };
    case LOCATION_CHANGE:
      return { ...state, ...defaultState };
    default:
      return state;
  }
};

export default reducer;
