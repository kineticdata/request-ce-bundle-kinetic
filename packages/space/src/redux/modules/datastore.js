import { List, Record } from 'immutable';
import { namespace, withPayload, noPayload } from '../../utils';

export const DATASTORE_LIMIT = 1000;

export const types = {
  FETCH_FORMS: namespace('datastore', 'FETCH_FORMS'),
  SET_FORMS: namespace('datastore', 'SET_FORMS'),
  SET_FORMS_ERRORS: namespace('datastore', 'SET_FORMS_ERRORS'),
  FETCH_FORM: namespace('datastore', 'FETCH_FORM'),
  SET_FORM: namespace('datastore', 'SET_FORM'),
  FETCH_SUBMISSIONS: namespace('datastore', 'FETCH_SUBMISSIONS'),
  SET_SUBMISSIONS: namespace('datastore', 'SET_SUBMISSIONS'),
  SET_INDEX: namespace('datastore', 'SET_INDEX'),
  SET_INDEX_PARTS: namespace('datastore', 'SET_INDEX_PARTS'),
  SET_INDEX_PART_CRITERIA: namespace('datastore', 'SET_INDEX_PART_CRITERIA'),
  SET_INDEX_PART_INPUT: namespace('datastore', 'SET_INDEX_PART_INPUT'),
  SET_INDEX_PART_BETWEEN: namespace('datastore', 'SET_INDEX_PART_BETWEEN'),
  ADD_INDEX_PART_INPUT: namespace('datastore', 'ADD_INDEX_PART_INPUT'),
  RESET_SEARCH_PARAMS: namespace('datastore', 'RESET_SEARCH_PARAMS'),
  PUSH_PAGE_TOKEN: namespace('datastore', 'PUSH_PAGE_TOKEN'),
  POP_PAGE_TOKEN: namespace('datastore', 'POP_PAGE_TOKEN'),
  SET_NEXT_PAGE_TOKEN: namespace('datastore', 'SET_NEXT_PAGE_TOKEN'),
  SET_PAGE_OFFSET: namespace('datastore', 'SET_PAGE_OFFSET'),
};

export const actions = {
  fetchForms: noPayload(types.FETCH_FORMS),
  setForms: withPayload(types.SET_FORMS),
  setFormsErrors: withPayload(types.SET_FORMS_ERRORS),
  fetchForm: withPayload(types.FETCH_FORM),
  setForm: withPayload(types.SET_FORM),
  fetchSubmissions: noPayload(types.FETCH_SUBMISSIONS),
  setSubmissions: withPayload(types.SET_SUBMISSIONS),
  setIndex: withPayload(types.SET_INDEX),
  setIndexParts: withPayload(types.SET_INDEX_PARTS),
  setIndexPartCriteria: (part, criteria) => ({
    type: types.SET_INDEX_PART_CRITERIA,
    payload: { part, criteria },
  }),
  setIndexPartInput: (part, input) => ({
    type: types.SET_INDEX_PART_INPUT,
    payload: { part, input },
  }),
  setIndexPartBetween: (part, field, value) => ({
    type: types.SET_INDEX_PART_BETWEEN,
    payload: { part, field, value },
  }),
  addIndexPartInput: withPayload(types.ADD_INDEX_PART_INPUT),
  resetSearchParams: noPayload(types.RESET_SEARCH_PARAMS),
  pushPageToken: withPayload(types.PUSH_PAGE_TOKEN),
  popPageToken: noPayload(types.POP_PAGE_TOKEN),
  setNextPageToken: withPayload(types.SET_NEXT_PAGE_TOKEN),
  setPageOffset: withPayload(types.SET_PAGE_OFFSET),
};

export const selectFormBySlug = (state, formSlug) =>
  state.datastore.forms.find(form => form.slug === formSlug);

export const selectSubmissionPage = state => {
  const { submissions, pageLimit, pageOffset } = state.datastore;
  return submissions.slice(pageOffset, pageLimit + pageOffset);
};

export const SearchParams = Record({
  index: null,
  indexParts: List(),
});

export const IndexValues = Record({
  values: List(),
  input: '',
});

export const IndexPart = Record({
  name: '',
  criteria: 'All',
  value: IndexValues(),
});

export const State = Record({
  pageLimit: 25,
  pageOffset: 0,
  loading: true,
  errors: [],
  forms: [],
  currentForm: null,
  currentFormLoading: true,
  submissions: List(),
  searchParams: SearchParams(),
  // Represents the pages navigated.
  pageTokens: List(),
  // Represents the next page.
  nextPageToken: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_FORMS:
      return state.set('loading', true).set('errors', []);
    case types.SET_FORMS:
      return state
        .set('loading', false)
        .set('errors', [])
        .set('forms', List(payload));
    case types.SET_FORMS_ERRORS:
      return state.set('loading', false).set('errors', payload);
    case types.FETCH_FORM:
      return state.set('currentFormLoading', true);
    case types.SET_FORM:
      return state
        .set('currentFormLoading', false)
        .set('currentForm', payload)
        .setIn(['searchParams', 'index'], payload.indexDefinitions[0]);
    case types.SET_SUBMISSIONS:
      return state.set('submissions', List(payload));
    case types.SET_INDEX:
      const index = state.currentForm.indexDefinitions.find(
        indexDef => indexDef.name === payload,
      );
      return state.setIn(['searchParams', 'index'], index);
    case types.SET_INDEX_PARTS:
      return state.setIn(['searchParams', 'indexParts'], payload);
    case types.SET_INDEX_PART_CRITERIA: {
      const { part, criteria } = payload;
      return state.updateIn(['searchParams', 'indexParts'], indexParts =>
        indexParts.update(indexParts.findIndex(p => part.name === p.name), p =>
          p.set('criteria', criteria).set(
            'value',
            IndexValues({
              values: criteria === 'Between' ? List(['', '']) : List(),
            }),
          ),
        ),
      );
    }
    case types.SET_INDEX_PART_INPUT: {
      const { part, input } = payload;

      return state.updateIn(['searchParams', 'indexParts'], indexParts =>
        indexParts.update(indexParts.findIndex(p => part.name === p.name), p =>
          p.updateIn(['value', 'input'], () => input),
        ),
      );
    }

    case types.SET_INDEX_PART_BETWEEN: {
      const { part, field, value } = payload;
      return state.updateIn(['searchParams', 'indexParts'], indexParts =>
        indexParts.update(indexParts.findIndex(p => part.name === p.name), p =>
          p.updateIn(['value', 'values'], values => values.set(field, value)),
        ),
      );
    }

    case types.ADD_INDEX_PART_INPUT:
      return state.updateIn(['searchParams', 'indexParts'], indexParts =>
        indexParts.update(
          indexParts.findIndex(p => payload.name === p.name),
          p =>
            p
              .updateIn(['value', 'values'], values =>
                values.push(p.value.input),
              )
              .setIn(['value', 'input'], ''),
        ),
      );
    case types.RESET_SEARCH_PARAMS:
      return state.set('searchParams', SearchParams());
    case types.PUSH_PAGE_TOKEN:
      return state.update('pageTokens', pageTokens => pageTokens.push(payload));
    case types.POP_PAGE_TOKEN:
      return state.update('pageTokens', pageTokens => pageTokens.pop());
    case types.SET_NEXT_PAGE_TOKEN:
      return state.set('nextPageToken', payload);
    case types.SET_PAGE_OFFSET:
      return state.set('pageOffset', payload);
    default:
      return state;
  }
};
