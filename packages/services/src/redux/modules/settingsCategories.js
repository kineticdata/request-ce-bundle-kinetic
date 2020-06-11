import { List, Record } from 'immutable';
import { Utils } from 'common';
import { CategoryHelper } from '../../models';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/settings/categories');

export const types = {
  FETCH_CATEGORIES_REQUEST: ns('FETCH_CATEGORIES_REQUEST'),
  FETCH_CATEGORIES_SUCCESS: ns('FETCH_CATEGORIES_SUCCESS'),
  FETCH_CATEGORIES_FAILURE: ns('FETCH_CATEGORIES_FAILURE'),
  UPDATE_CATEGORIES_REQUEST: ns('UPDATE_CATEGORIES_REQUEST'),
};

export const actions = {
  fetchCategoriesRequest: noPayload(types.FETCH_CATEGORIES_REQUEST),
  fetchCategoriesSuccess: withPayload(types.FETCH_CATEGORIES_SUCCESS),
  fetchCategoriesFailure: withPayload(types.FETCH_CATEGORIES_FAILURE),
  updateCategoriesRequest: withPayload(types.UPDATE_CATEGORIES_REQUEST),
};

export const State = Record({
  error: null,
  categoryHelper: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_CATEGORIES_REQUEST:
      return state.set('categoryHelper', null).set('error', null);
    case types.FETCH_CATEGORIES_SUCCESS:
      return state.set('categoryHelper', CategoryHelper(payload, true));
    case types.FETCH_CATEGORIES_FAILURE:
      return state.set('error', payload);
    default:
      return state;
  }
};

export default reducer;
