import { List, Record } from 'immutable';
import { namespace, withPayload, noPayload } from '../../utils';
import { ColumnConfig, DatastoreForm } from '../../records';

export const DATASTORE_LIMIT = 1000;
export const SUBMISSION_INCLUDES = 'values,details';
export const FORMS_INCLUDES = 'details';
export const FORM_INCLUDES = 'details,fields,indexDefinitions,attributesMap';
export const SPACE_INCLUDES =
  'bridges,' +
  'bridgeModels,' +
  'bridgeModels.mappings,' +
  'bridgeModels.mappings.attributes,' +
  'bridgeModels.mappings.qualifications' +
  'bridgeModels.attributes,' +
  'bridgeModels.qualifications,' +
  'bridgeModels.qualifications.parameters';

export const SUBMISSION_SYSTEM_PROPS = [
  ColumnConfig({
    label: 'Handle',
    name: 'handle',
    type: 'system',
    visible: true,
    filterable: true,
  }),
  ColumnConfig({
    label: 'Label',
    name: 'label',
    type: 'system',
    visible: true,
    filterable: true,
  }),
  ColumnConfig({ label: 'Created At', name: 'createdAt', type: 'system' }),
  ColumnConfig({ label: 'Created By', name: 'createdBy', type: 'system' }),
  ColumnConfig({ label: 'Updated At', name: 'updatedAt', type: 'system' }),
  ColumnConfig({ label: 'Updated By', name: 'updatedBy', type: 'system' }),
  ColumnConfig({ label: 'Id', name: 'id', type: 'system' }),
];

export const types = {
  FETCH_FORMS: namespace('datastore', 'FETCH_FORMS'),
  SET_FORMS: namespace('datastore', 'SET_FORMS'),
  SET_FORMS_ERRORS: namespace('datastore', 'SET_FORMS_ERRORS'),
  FETCH_FORM: namespace('datastore', 'FETCH_FORM'),
  SET_FORM: namespace('datastore', 'SET_FORM'),
  UPDATE_FORM: namespace('datastore', 'UPDATE_FORM'),
  FETCH_SUBMISSIONS_ADVANCED: namespace(
    'datastore',
    'FETCH_SUBMISSIONS_ADVANCED',
  ),
  FETCH_SUBMISSIONS_SIMPLE: namespace('datastore', 'FETCH_SUBMISSIONS_SIMPLE'),
  SET_SUBMISSIONS: namespace('datastore', 'SET_SUBMISSIONS'),
  FETCH_SUBMISSION: namespace('datastore', 'FETCH_SUBMISSION'),
  SET_SUBMISSION: namespace('datastore', 'SET_SUBMISSION'),
  RESET_SUBMISSION: namespace('datastore', 'RESET_SUBMISSION'),
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
  TOGGLE_SIMPLE_SEARCH: namespace('datastore', 'TOGGLE_SIMPLE_SEARCH'),
  SET_SIMPLE_SEARCH_PARAM: namespace('datastore', 'SET_SIMPLE_SEARCH_PARAM'),
  SET_SIMPLE_SEARCH_NEXT_PAGE_INDEX: namespace(
    'datastore',
    'SET_SIMPLE_SEARCH_NEXT_PAGE_INDEX',
  ),
  CLONE_SUBMISSION: namespace('datastore', 'CLONE_SUBMISSION'),
  CLONE_SUBMISSION_SUCCESS: namespace('datastore', 'CLONE_SUBMISSION_SUCCESS'),
  CLONE_SUBMISSION_ERROR: namespace('datastore', 'CLONE_SUBMISSION_ERROR'),
  DELETE_SUBMISSION: namespace('datastore', 'DELETE_SUBMISSION'),
  DELETE_SUBMISSION_SUCCESS: namespace(
    'datastore',
    'DELETE_SUBMISSION_SUCCESS',
  ),
  DELETE_SUBMISSION_ERROR: namespace('datastore', 'DELETE_SUBMISSION_ERROR'),
  SET_FORM_CHANGES: namespace('datastore', 'SET_FORM_CHANGES'),
};

export const actions = {
  fetchForms: noPayload(types.FETCH_FORMS),
  setForms: withPayload(types.SET_FORMS),
  setFormsErrors: withPayload(types.SET_FORMS_ERRORS),
  fetchForm: withPayload(types.FETCH_FORM),
  setForm: withPayload(types.SET_FORM),
  updateForm: withPayload(types.UPDATE_FORM),
  fetchSubmissionsAdvanced: noPayload(types.FETCH_SUBMISSIONS_ADVANCED),
  fetchSubmissionsSimple: noPayload(types.FETCH_SUBMISSIONS_SIMPLE),
  setSubmissions: withPayload(types.SET_SUBMISSIONS),
  fetchSubmission: withPayload(types.FETCH_SUBMISSION),
  resetSubmission: noPayload(types.RESET_SUBMISSION),
  setSubmission: withPayload(types.SET_SUBMISSION),
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
  toggleSimpleSearch: noPayload(types.TOGGLE_SIMPLE_SEARCH),
  setSimpleSearchParam: withPayload(types.SET_SIMPLE_SEARCH_PARAM),
  setSimpleSearchNextPageIndex: withPayload(
    types.SET_SIMPLE_SEARCH_NEXT_PAGE_INDEX,
  ),
  cloneSubmission: withPayload(types.CLONE_SUBMISSION),
  cloneSubmissionSuccess: noPayload(types.CLONE_SUBMISSION_SUCCESS),
  cloneSubmissionErrors: withPayload(types.CLONE_SUBMISSION_ERROR),
  deleteSubmission: withPayload(types.DELETE_SUBMISSION),
  deleteSubmissionSuccess: noPayload(types.DELETE_SUBMISSION_SUCCESS),
  deleteSubmissionErrors: withPayload(types.DELETE_SUBMISSION_ERROR),
  setFormChanges: withPayload(types.SET_FORM_CHANGES),
};

export const selectCanManage = (state, formSlug) =>
  state.datastore.manageableForms.find(form => form === formSlug);

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
  pageLimit: 50,
  pageOffset: 0,
  loading: true,
  errors: [],
  forms: [],
  bridges: [],
  manageableForms: [],
  currentForm: DatastoreForm(),
  currentFormChanges: DatastoreForm(),
  currentFormLoading: true,
  submissions: List(),
  searchParams: SearchParams(),
  // Represents the pages navigated.
  pageTokens: List(),
  // Represents the next page.
  nextPageToken: null,
  // Simple or Advanced Search
  simpleSearchActive: true,
  simpleSearchParam: '',
  simpleSearchNextPageIndex: null,
  // Submission List Actions
  submissionActionErrors: [],
  cloning: false,
  deleting: false,
  // Single Submission
  submission: null,
  submissionLoading: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_FORMS:
      return state.set('loading', true).set('errors', []);
    case types.SET_FORMS:
      return state
        .set('loading', false)
        .set('errors', [])
        .set('forms', List(payload.displayableForms))
        .set('manageableForms', List(payload.manageableForms));
    case types.SET_FORMS_ERRORS:
      return state.set('loading', false).set('errors', payload);
    case types.FETCH_FORM:
      return state.set('currentFormLoading', true);
    case types.SET_FORM:
      return state
        .set('currentFormLoading', false)
        .set('currentForm', DatastoreForm(payload))
        .set('currentFormChanges', DatastoreForm(payload))
        .set('bridges', payload.bridges)
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
      return state
        .set('searchParams', SearchParams())
        .set('simpleSearchParam', '')
        .set('simpleSearchNextPageIndex', null)
        .set('nextPageToken', null)
        .set('pageTokens', List())
        .set('submissions', List());
    case types.PUSH_PAGE_TOKEN:
      return state.update('pageTokens', pageTokens => pageTokens.push(payload));
    case types.POP_PAGE_TOKEN:
      return state.update('pageTokens', pageTokens => pageTokens.pop());
    case types.SET_NEXT_PAGE_TOKEN:
      return state.set('nextPageToken', payload);
    case types.SET_PAGE_OFFSET:
      return state.set('pageOffset', payload);
    case types.TOGGLE_SIMPLE_SEARCH:
      return state
        .set('simpleSearchActive', !state.simpleSearchActive)
        .set('searchParams', SearchParams())
        .set('simpleSearchParam', '')
        .set('simpleSearchNextPageIndex', null)
        .set('nextPageToken', null)
        .set('pageTokens', List())
        .set('submissions', List());
    case types.SET_SIMPLE_SEARCH_NEXT_PAGE_INDEX:
      return state.set('simpleSearchNextPageIndex', payload);
    case types.SET_SIMPLE_SEARCH_PARAM:
      return state.set('simpleSearchParam', payload);
    case types.CLONE_SUBMISSION:
      return state.set('cloning', true);
    case types.CLONE_SUBMISSION_SUCCESS:
      return state.set('cloning', false);
    case types.CLONE_SUBMISSION_ERROR:
      return state.set('cloning', false).set('submissionActionErrors', payload);
    case types.DELETE_SUBMISSION:
      return state.set('deleting', true);
    case types.DELETE_SUBMISSION_SUCCESS:
      return state.set('deleting', false);
    case types.DELETE_SUBMISSION_ERROR:
      return state
        .set('deleting', false)
        .set('submissionActionErrors', payload);
    case types.FETCH_SUBMISSION:
      return state.set('submissionLoading', true);
    case types.SET_SUBMISSION:
      return state.set('submissionLoading', false).set('submission', payload);
    case types.RESET_SUBMISSION:
      return state.set('submissionLoading', true).set('submission', null);
    case types.SET_FORM_CHANGES:
      return payload.type === 'column'
        ? state.updateIn(['currentFormChanges', 'columns'], columns =>
            columns.set(
              columns.findIndex(c => c === payload.original),
              payload.updated,
            ),
          )
        : state.setIn(['currentFormChanges', payload.type], payload.value);
    default:
      return state;
  }
};
