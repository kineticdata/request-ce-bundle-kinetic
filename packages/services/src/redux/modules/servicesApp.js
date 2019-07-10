import { List, Record } from 'immutable';
import { Category, Form } from '../../models';
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
  categories: null,
  homeForms: null,
});

const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_DATA_REQUEST:
      return state.set('error', null);
    case types.FETCH_APP_DATA_SUCCESS:
      return state
        .set('loading', false)
        .set(
          'categories',
          List(payload.categories)
            .map(Category)
            .filter(category => !category.hidden && category.forms.length > 0),
        )
        .set('homeForms', List(payload.forms).map(Form));
    case types.FETCH_APP_DATA_FAILURE:
      return state.set('loading', false).set('error', payload);
    default:
      return state;
  }
};

export default reducer;
