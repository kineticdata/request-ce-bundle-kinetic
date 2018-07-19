import { List, Record } from 'immutable';
import { Utils } from 'common';

const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_CATEGORIES: namespace('settingsCategories', 'FETCH_CATEGORIES'),
  SET_CATEGORIES: namespace('settingsCategories', 'SET_CATEGORIES'),
  UPDATE_CATEGORY: namespace('settingsCategories', 'UPDATE_CATEGORY'),
  SET_CATEGORIES_ERRORS: namespace(
    'settingsCategories',
    'SET_CATEGORIES_ERRORS',
  ),
};

export const actions = {
  updateCategory: withPayload(types.UPDATE_CATEGORY),
  fetchCategories: withPayload(types.FETCH_CATEGORIES),
  setCategories: withPayload(types.SET_CATEGORIES),
  setCategoriesErrors: withPayload(types.SET_CATEGORIES_ERRORS),
};

export const State = Record({
  errors: [],
  rawCategories: null,
  loading: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_CATEGORIES:
      return state.set('loading', true);
    case types.SET_CATEGORIES:
      return state.set('loading', false).set('rawCategories', payload);
    case types.SET_CATEGORIES_ERRORS:
      return state.set('errors', payload);
    default:
      return state;
  }
};

export default reducer;
