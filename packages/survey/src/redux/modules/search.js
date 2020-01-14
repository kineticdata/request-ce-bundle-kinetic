import { LOCATION_CHANGE } from 'connected-react-router';
import { Utils } from 'common';
const ns = Utils.namespaceBuilder('survey/search');

export const types = {
  SEACH_INPUT_CHANGE: ns('SEACH_INPUT_CHANGE'),
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
