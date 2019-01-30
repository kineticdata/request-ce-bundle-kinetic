import { LOCATION_CHANGE } from 'connected-react-router';

export const types = {
  SEACH_INPUT_CHANGE: '@kd/catalog/SEACH_INPUT_CHANGE',
  SEARCH_RESULTS_FORM_EXISTS: '@kd/catalog/SEARCH_RESULTS_FORM_EXISTS',
};

export const actions = {
  searchInputChange: value => ({
    type: types.SEACH_INPUT_CHANGE,
    payload: value,
  }),
  searchResultsFormExists: value => ({
    type: types.SEARCH_RESULTS_FORM_EXISTS,
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
    case types.SEARCH_RESULTS_FORM_EXISTS:
      return { ...state, searchResultsFormExists: action.payload };
    case LOCATION_CHANGE:
      return { ...state, ...defaultState };
    default:
      return state;
  }
};

export default reducer;
