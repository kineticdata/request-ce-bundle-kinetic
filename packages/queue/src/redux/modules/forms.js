import { List } from 'immutable';
import { Form } from '../../models';
import { Utils } from 'common';
const { withPayload, noPayload } = Utils;
const ns = Utils.namespaceBuilder('queue/forms');

export const types = {
  FETCH_FORMS_REQUEST: ns('FETCH_FORMS_REQUEST'),
  FETCH_FORMS_SUCCESS: ns('FETCH_FORMS_SUCCESS'),
  FETCH_FORMS_FAILURE: ns('FETCH_FORMS_FAILURE'),
};

export const actions = {
  fetchFormsRequest: noPayload(types.FETCH_FORMS_REQUEST),
  fetchFormsSuccess: withPayload(types.FETCH_FORMS_SUCCESS),
  fetchFormsFailure: withPayload(types.FETCH_FORMS_FAILURE),
};

export const defaultState = {
  loading: true,
  error: null,
  data: List(),
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.FETCH_FORMS_REQUEST:
      return { ...state, loading: true, error: null };
    case types.FETCH_FORMS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: List(action.payload).map(Form),
      };
    case types.FETCH_FORMS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
