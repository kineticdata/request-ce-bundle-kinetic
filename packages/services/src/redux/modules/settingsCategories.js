import { List, Record } from 'immutable';
import { Utils } from 'common';

const { namespace, noPayload, withPayload } = Utils;

export const types = {
  UPDATE_CATEGORIES: namespace('settingsCategories', 'UPDATE_CATEGORIES'),
  SET_CATEGORIES_ERRORS: namespace(
    'settingsCategories',
    'SET_CATEGORIES_ERRORS',
  ),
};

export const actions = {
  updateForm: withPayload(types.UPDATE_CATEGORIES),
  setCategoriesErrors: withPayload(types.SET_CATEGORIES_ERRORS),
};

export const State = Record({
  errors: [],
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_CATEGORIES_ERRORS:
      return state.set('errors', payload);
    default:
      return state;
  }
};

export default reducer;
