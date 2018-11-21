import { List } from 'immutable';
import { Form } from '../../models';

export const types = {
  FETCH_FORMS: '@kd/catalog/FETCH_FORMS',
  SET_FORMS: '@kd/catalog/SET_FORMS',
  SET_FORMS_ERRORS: '@kd/catalog/SET_FORMS_ERRORS',
};

export const actions = {
  fetchForms: () => ({ type: types.FETCH_FORMS }),
  setForms: forms => ({ type: types.SET_FORMS, payload: forms }),
  setFormsErrors: errors => ({ type: types.SET_FORMS_ERRORS, payload: errors }),
};

export const defaultState = {
  loading: true,
  errors: [],
  data: List(),
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.FETCH_FORMS:
      return { ...state, loading: true, errors: [] };
    case types.SET_FORMS:
      return {
        ...state,
        loading: false,
        errors: [],
        data: List(action.payload).map(Form),
      };
    case types.SET_FORMS_ERRORS:
      return { ...state, loading: false, errors: action.payload };
    default:
      return state;
  }
};
