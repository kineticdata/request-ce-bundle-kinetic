import { List } from 'immutable';
import { Category, Form } from '../../models';
import { displayableFormPredicate } from '../../helpers';

export const types = {
  FETCH_CATEGORIES: '@kd/catalog/FETCH_CATEGORIES',
  SET_CATEGORIES: '@kd/catalog/SET_CATEGORIES',
  SET_CATEGORIES_ERRORS: '@kd/catalog/SET_CATEGORIES_ERRORS',
  SET_FORMS: '@kd/catalog/SET_FORMS',
};

export const actions = {
  fetchCategories: () => ({ type: types.FETCH_CATEGORIES }),
  setCategories: categories => ({
    type: types.SET_CATEGORIES,
    payload: categories,
  }),
  setCategoriesErrors: errors => ({
    type: types.SET_CATEGORIES_ERRORS,
    payload: errors,
  }),
  setForms: forms => ({ type: types.SET_FORMS, payload: forms }),
};

export const defaultState = {
  loading: true,
  errors: [],
  data: List(),
  rawCategories: null,
  rawForms: null,
};

export const processCategories = (categories, forms) => {
  const formsMap = List(forms)
    .map(Form)
    .toMap()
    .mapKeys((_, form) => form.slug);
  return List(categories)
    .map(Category)
    .filter(category => !category.hidden)
    .map(category => ({
      ...category,
      forms: category.forms
        .map(slug => formsMap.get(slug))
        .filter(displayableFormPredicate),
    }))
    .filter(category => category.forms.length > 0);
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.FETCH_CATEGORIES:
      return { ...state, loading: true, errors: [] };
    case types.SET_CATEGORIES:
      return state.rawForms === null
        ? { ...state, rawCategories: action.payload }
        : {
            ...state,
            loading: false,
            errors: [],
            data: processCategories(action.payload, state.rawForms),
          };
    case types.SET_FORMS:
      return state.rawCategories === null
        ? { ...state, rawForms: action.payload }
        : {
            ...state,
            loading: false,
            errors: [],
            data: processCategories(state.rawCategories, action.payload),
          };
    case types.SET_CATEGORIES_ERRORS:
      return { ...state, loading: false, errors: action.payload };
    default:
      return state;
  }
};

export default reducer;
