import { List, Record } from 'immutable';
import { CategoryHelper, Form } from '../../models';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/servicesApp');

export const types = {
  FETCH_APP_DATA_REQUEST: ns('FETCH_APP_DATA_REQUEST'),
  FETCH_APP_DATA_SUCCESS: ns('FETCH_APP_DATA_SUCCESS'),
  FETCH_APP_DATA_FAILURE: ns('FETCH_APP_DATA_FAILURE'),
};

export const actions = {
  fetchAppDataRequest: noPayload(types.FETCH_APP_DATA_REQUEST),
  fetchAppDataSuccess: withPayload(types.FETCH_APP_DATA_SUCCESS),
  fetchAppDataFailure: withPayload(types.FETCH_APP_DATA_FAILURE),
};

export const State = Record({
  loading: true,
  error: null,
  categoryGetter: () => null,
  categories: null,
  homeForms: null,
  searchableForms: null,
});

const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_DATA_REQUEST:
      return state.set('error', null);
    case types.FETCH_APP_DATA_SUCCESS:
      const categoryHelper = CategoryHelper(payload.categories);
      return state
        .set('loading', false)
        .set('categoryGetter', slug => categoryHelper.getCategory(slug))
        .set(
          'categories',
          categoryHelper
            .getRootCategories()
            .filterNot(category => category.isEmpty()),
        )
        .set('homeForms', List(payload.forms).map(Form))
        .set(
          'searchableForms',
          payload.searchableLimitReached
            ? null
            : List(payload.searchableForms).map(Form),
        );
    case types.FETCH_APP_DATA_FAILURE:
      return state.set('loading', false).set('error', payload);
    default:
      return state;
  }
};

export default reducer;
