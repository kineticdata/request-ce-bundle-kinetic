import { List, Record } from 'immutable';
import { Utils } from 'common';
import isarray from 'isarray';
import isobject from 'isobject';
import {
  ColumnConfig,
  DatastoreConfig,
  DatastoreForm,
  SearchParams,
  IndexValues,
  BridgeModel,
  BridgeModelMapping,
} from '../../records';

const { namespace, noPayload, withPayload } = Utils;

export const DATASTORE_LIMIT = 500;
export const SUBMISSION_INCLUDES = 'values,details';
export const FORMS_INCLUDES = 'details,attributes';
export const FORM_INCLUDES = 'details,fields,indexDefinitions,attributesMap';
export const SPACE_INCLUDES = 'bridges';
export const BRIDGE_MODEL_INCLUDES =
  'attributes, ' +
  'qualifications,qualifications.parameters,' +
  'mappings,mappings.attributes,mappings.qualifications';

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
  CLEAR_FORM: namespace('datastore', 'CLEAR_FORM'),
  UPDATE_FORM: namespace('datastore', 'UPDATE_FORM'),
  RESET_FORM: namespace('datastore', 'RESET_FORM'),
  CREATE_FORM: namespace('datastore', 'CREATE_FORM'),
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
  SET_INDEX_PART_OPERATION: namespace('datastore', 'SET_INDEX_PART_OPERATION'),
  SET_INDEX_PART_INPUT: namespace('datastore', 'SET_INDEX_PART_INPUT'),
  SET_INDEX_PART_BETWEEN: namespace('datastore', 'SET_INDEX_PART_BETWEEN'),
  ADD_INDEX_PART_INPUT: namespace('datastore', 'ADD_INDEX_PART_INPUT'),
  REMOVE_INDEX_PART_INPUT: namespace('datastore', 'REMOVE_INDEX_PART_INPUT'),
  RESET_SEARCH_PARAMS: namespace('datastore', 'RESET_SEARCH_PARAMS'),
  PUSH_PAGE_TOKEN: namespace('datastore', 'PUSH_PAGE_TOKEN'),
  POP_PAGE_TOKEN: namespace('datastore', 'POP_PAGE_TOKEN'),
  CLEAR_PAGE_TOKENS: namespace('datastore', 'CLEAR_PAGE_TOKENS'),
  SET_NEXT_PAGE_TOKEN: namespace('datastore', 'SET_NEXT_PAGE_TOKEN'),
  SET_PAGE_OFFSET: namespace('datastore', 'SET_PAGE_OFFSET'),
  TOGGLE_SIMPLE_SEARCH: namespace('datastore', 'TOGGLE_SIMPLE_SEARCH'),
  SET_SIMPLE_SEARCH: namespace('datastore', 'SET_SIMPLE_SEARCH'),
  SET_ADVANCED_SEARCH_OPEN: namespace('datastore', 'SET_ADVANCED_SEARCH_OPEN'),
  SET_SIMPLE_SEARCH_PARAM: namespace('datastore', 'SET_SIMPLE_SEARCH_PARAM'),
  SET_SIMPLE_SEARCH_NEXT_PAGE_INDEX: namespace(
    'datastore',
    'SET_SIMPLE_SEARCH_NEXT_PAGE_INDEX',
  ),
  SET_SORT_DIRECTION: namespace('datastore', 'SET_SORT_DIRECTION'),
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
  OPEN_MODAL: namespace('datastore', 'OPEN_MODAL'),
  CLOSE_MODAL: namespace('datastore', 'CLOSE_MODAL'),
  FETCH_ALL_SUBMISSIONS: namespace('datastore', 'FETCH_ALL_SUBMISSIONS'),
  SET_EXPORT_SUBMISSIONS: namespace('datastore', 'SET_EXPORT_SUBMISSIONS'),
  SET_EXPORT_COUNT: namespace('datastore', 'SET_EXPORT_COUNT'),
  SET_CLIENT_SORT_INFO: namespace('datastore', 'SET_CLIENT_SORT_INFO'),
  DELETE_ALL_SUBMISSIONS: namespace('datastore', 'DELETE_ALL_SUBMISSIONS'),
  EXECUTE_IMPORT: namespace('datastore', 'EXECUTE_IMPORT'),
  SET_IMPORT_PERCENT_COMPLETE: namespace(
    'datastore',
    'SET_IMPORT_PERCENT_COMPLETE',
  ),
  DEBOUNCE_PERCENT_COMPLETE: namespace(
    'datastore',
    'DEBOUNCE_PERCENT_COMPLETE',
  ),
  SET_IMPORT_FAILED_CALL: namespace('datastore', 'SET_IMPORT_FAILED_CALL'),
  SET_IMPORT_COMPLETE: namespace('datastore', 'SET_IMPORT_COMPLETE'),
  RESET_IMPORT_FAILED_CALL: namespace('datastore', 'RESET_IMPORT_FAILED_CALL'),
};

export const actions = {
  fetchForms: noPayload(types.FETCH_FORMS),
  setForms: withPayload(types.SET_FORMS),
  setFormsErrors: withPayload(types.SET_FORMS_ERRORS),
  fetchForm: withPayload(types.FETCH_FORM),
  setForm: withPayload(types.SET_FORM),
  clearForm: withPayload(types.CLEAR_FORM),
  updateForm: withPayload(types.UPDATE_FORM),
  resetForm: noPayload(types.RESET_FORM),
  createForm: withPayload(types.CREATE_FORM),
  fetchSubmissionsAdvanced: noPayload(types.FETCH_SUBMISSIONS_ADVANCED),
  fetchSubmissionsSimple: noPayload(types.FETCH_SUBMISSIONS_SIMPLE),
  setSubmissions: withPayload(types.SET_SUBMISSIONS),
  fetchSubmission: withPayload(types.FETCH_SUBMISSION),
  resetSubmission: noPayload(types.RESET_SUBMISSION),
  setSubmission: withPayload(types.SET_SUBMISSION),
  setIndex: withPayload(types.SET_INDEX),
  setIndexParts: withPayload(types.SET_INDEX_PARTS),
  setIndexPartOperation: (part, operation) => ({
    type: types.SET_INDEX_PART_OPERATION,
    payload: { part, operation },
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
  removeIndexPartInput: withPayload(types.REMOVE_INDEX_PART_INPUT),
  resetSearchParams: noPayload(types.RESET_SEARCH_PARAMS),
  pushPageToken: withPayload(types.PUSH_PAGE_TOKEN),
  popPageToken: noPayload(types.POP_PAGE_TOKEN),
  clearPageTokens: noPayload(types.CLEAR_PAGE_TOKENS),
  setNextPageToken: withPayload(types.SET_NEXT_PAGE_TOKEN),
  toggleSimpleSearch: noPayload(types.TOGGLE_SIMPLE_SEARCH),
  setSimpleSearch: withPayload(types.SET_SIMPLE_SEARCH),
  setAdvancedSearchOpen: withPayload(types.SET_ADVANCED_SEARCH_OPEN),
  setSimpleSearchParam: withPayload(types.SET_SIMPLE_SEARCH_PARAM),
  setSimpleSearchNextPageIndex: withPayload(
    types.SET_SIMPLE_SEARCH_NEXT_PAGE_INDEX,
  ),
  setSortDirection: withPayload(types.SET_SORT_DIRECTION),
  cloneSubmission: withPayload(types.CLONE_SUBMISSION),
  cloneSubmissionSuccess: noPayload(types.CLONE_SUBMISSION_SUCCESS),
  cloneSubmissionErrors: withPayload(types.CLONE_SUBMISSION_ERROR),
  deleteSubmission: withPayload(types.DELETE_SUBMISSION),
  deleteSubmissionSuccess: noPayload(types.DELETE_SUBMISSION_SUCCESS),
  deleteSubmissionErrors: withPayload(types.DELETE_SUBMISSION_ERROR),
  setFormChanges: withPayload(types.SET_FORM_CHANGES),
  openModal: withPayload(types.OPEN_MODAL),
  closeModal: noPayload(types.CLOSE_MODAL),
  fetchAllSubmissions: withPayload(types.FETCH_ALL_SUBMISSIONS),
  setExportSubmissions: withPayload(types.SET_EXPORT_SUBMISSIONS),
  setExportCount: withPayload(types.SET_EXPORT_COUNT),
  setClientSortInfo: withPayload(types.SET_CLIENT_SORT_INFO),
  deleteAllSubmissions: noPayload(types.DELETE_ALL_SUBMISSIONS),
  executeImport: withPayload(types.EXECUTE_IMPORT),
  setImportPercentComplete: withPayload(types.SET_IMPORT_PERCENT_COMPLETE),
  debouncePercentComplete: withPayload(types.DEBOUNCE_PERCENT_COMPLETE),
  setImportFailedCall: withPayload(types.SET_IMPORT_FAILED_CALL),
  setImportComplete: noPayload(types.SET_IMPORT_COMPLETE),
  resetImportFailedCall: noPayload(types.RESET_IMPORT_FAILED_CALL),
};

const parseConfigJson = json => {
  try {
    const parsed = JSON.parse(json);
    if (isobject(parsed)) {
      return DatastoreConfig(parsed).update('columns', c => List(c));
    } else if (isarray(parsed)) {
      return DatastoreConfig({ columns: List(parsed) });
    } else {
      return DatastoreConfig();
    }
  } catch (e) {
    return DatastoreConfig();
  }
};

export const buildConfig = form => {
  // Parse Form Attribute for Configuration Values
  const parsedConfig = parseConfigJson(
    form.attributesMap['Datastore Configuration'] &&
      form.attributesMap['Datastore Configuration'][0],
  );
  // Build a list of all current column properties
  let defaultColumnConfig = List(
    form.fields
      .map(f => ColumnConfig({ name: f.name, label: f.name, type: 'value' }))
      .concat(SUBMISSION_SYSTEM_PROPS),
  ).sort((a, b) => {
    var indexA = parsedConfig.columns.findIndex(
      sc => sc.name === a.name && sc.type === a.type,
    );
    var indexB = parsedConfig.columns.findIndex(
      sc => sc.name === b.name && sc.type === b.type,
    );
    if (indexA === indexB) {
      return 0;
    } else if (indexA >= 0 && (indexA < indexB || indexB === -1)) {
      return -1;
    } else {
      return 1;
    }
  });
  // If there are saved column configs, apply them
  if (parsedConfig.columns.size > 0) {
    return parsedConfig.merge({
      columns: List(
        defaultColumnConfig.map(dc => {
          const saved = parsedConfig.columns.find(
            sc => sc.name === dc.name && sc.type === dc.type,
          );
          if (saved) {
            return ColumnConfig({
              ...saved,
              name: dc.name,
              type: dc.type,
              label: dc.label,
            });
          } else {
            return dc;
          }
        }),
      ),
    });
  } else {
    return parsedConfig.merge({
      columns: List(defaultColumnConfig),
    });
  }
};

const sortSubmissions = (submissions, sortInfo) => {
  if (sortInfo) {
    return submissions.sortBy(
      submission =>
        (sortInfo.type === 'value'
          ? submission.values[sortInfo.name]
          : submission[sortInfo.name]) || '',
      (a, b) => a.localeCompare(b) * (sortInfo.direction === 'DESC' ? -1 : 1),
    );
  } else {
    return submissions;
  }
};

export const selectPrevAndNext = state => {
  const submissions = state.space.settingsDatastore.submissions || List();
  const submission = state.space.settingsDatastore.submission;
  if (submission !== null) {
    const currentItemIndex = submissions.findIndex(
      item => item.id === submission.id,
    );
    const prevItem =
      currentItemIndex > 0 ? submissions.get(currentItemIndex - 1).id : null;
    const nextItem =
      currentItemIndex < submissions.size - 1
        ? submissions.get(currentItemIndex + 1).id
        : null;
    return {
      prev:
        prevItem && `/settings/datastore/${submission.form.slug}/${prevItem}`,
      next:
        nextItem && `/settings/datastore/${submission.form.slug}/${nextItem}`,
    };
  }
};

export const selectBridgeNameByModel = model => {
  if (model && model.activeMappingName) {
    const activeMappingName = model.activeMappingName || '';
    const activeMapping = model.mappings
      ? model.mappings.find(m => m.name === activeMappingName)
      : '';
    return activeMapping ? activeMapping.bridgeName : '';
  } else {
    return '';
  }
};
export const selectUpdatedFormActiveBridge = state =>
  state.space.settingsDatastore.currentFormChanges.bridgeModelMapping
    .bridgeName;
export const selectCurrentForm = state =>
  state.space.settingsDatastore.currentForm;
export const selectCurrentFormChanges = state =>
  state.space.settingsDatastore.currentFormChanges;
export const selectFormBySlug = (state, formSlug) =>
  state.space.settingsDatastore.forms.find(form => form.slug === formSlug);

export const State = Record({
  loading: true,
  errors: [],
  forms: List(),
  bridges: List(),
  currentForm: DatastoreForm(),
  currentFormChanges: DatastoreForm(),
  currentFormLoading: true,
  hasStartedSearching: false,
  searching: false,
  submissions: List(),
  searchParams: SearchParams(),
  // Represents the pages navigated.
  pageTokens: List(),
  // Represents the next page.
  nextPageToken: null,
  // Simple or Advanced Search
  simpleSearchActive: true,
  advancedSearchOpen: false,
  simpleSearchParam: '',
  simpleSearchNextPageIndex: null,
  sortDirection: 'ASC',
  // Submission List Actions
  submissionActionErrors: [],
  cloning: false,
  deleting: false,
  // Single Submission
  submission: null,
  submissionLoading: true,
  // Client Side Sorting
  clientSortInfo: null,
  modalIsOpen: false,
  modalName: '',
  fetchingAll: false,
  exportSubmissions: [],
  exportCount: 0,
  importProcessing: false,
  importPercentComplete: 0,
  importFailedCalls: List(),
  importComplete: false,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_FORMS:
      return state.set('loading', true).set('errors', []);
    case types.SET_FORMS:
      const forms = List(
        payload.displayableForms.map(form => {
          const hiddenAttr = Utils.getAttributeValue(
            form,
            'Datastore Hidden',
            'false',
          ).toLowerCase();
          const isHidden = hiddenAttr === 'true' || hiddenAttr === 'yes';
          const canManage = payload.manageableForms.includes(form.slug);
          return DatastoreForm({ ...form, canManage, isHidden });
        }),
      );
      const bridges = payload.bridges.map(b => b.name);
      return state
        .set('loading', false)
        .set('errors', [])
        .set('forms', forms)
        .set('bridges', bridges);
    case types.SET_FORMS_ERRORS:
      return state.set('loading', false).set('errors', payload);
    case types.FETCH_FORM:
      return state.set('currentFormLoading', true);
    case types.SET_FORM:
      const { form } = payload;
      const bridgeModel = BridgeModel(
        payload.bridgeModels.find(m => m.name === `Datastore - ${form.name}`),
      )
        .update('attributes', a => List(a))
        .update('qualifications', a => List(a));
      const bridgeModelMapping = BridgeModelMapping(
        bridgeModel.mappings.find(m => m.name === `Datastore - ${form.name}`),
      )
        .update('attributes', a => List(a))
        .update('qualifications', a => List(a));
      const canManage = state.forms.find(f => f.slug === form.slug).canManage;
      const savedConfig = buildConfig(form);
      const columns = savedConfig.columns;
      const defaultSearchIndex = savedConfig.defaultSearchIndex;
      const dsForm = DatastoreForm({
        ...form,
        canManage,
        columns,
        defaultSearchIndex,
        bridgeName: bridgeModelMapping.bridgeName,
        bridgeModel,
        bridgeModelMapping,
      });
      return state
        .set('currentFormLoading', false)
        .set('currentForm', dsForm)
        .set('currentFormChanges', dsForm);
    case types.CLEAR_FORM:
      return state
        .set('currentForm', DatastoreForm())
        .set('currentFormChanges', DatastoreForm());
    case types.RESET_FORM:
      return state.set('currentFormChanges', state.get('currentForm'));
    case types.FETCH_SUBMISSIONS_ADVANCED:
      return state.set('searching', true);
    case types.FETCH_SUBMISSIONS_SIMPLE:
      return state.set('searching', true);
    case types.SET_SUBMISSIONS:
      return state
        .set('searching', false)
        .set(
          'submissions',
          sortSubmissions(List(payload), state.clientSortInfo),
        )
        .set('hasStartedSearching', true);
    case types.SET_INDEX:
      return state.setIn(['searchParams', 'index'], payload);
    case types.SET_INDEX_PARTS:
      return state.setIn(['searchParams', 'indexParts'], payload);
    case types.SET_INDEX_PART_OPERATION: {
      const { part, operation } = payload;
      const partIndex = state.searchParams.indexParts.findIndex(
        p => part.name === p.name,
      );
      return state.updateIn(['searchParams', 'indexParts'], indexParts =>
        indexParts
          .update(partIndex, p =>
            p.set('operation', operation).set(
              'value',
              IndexValues({
                values: operation === 'Between' ? List(['', '']) : List(),
              }),
            ),
          )
          .map(
            (part, index) =>
              index > partIndex && operation !== 'Is Equal To'
                ? part
                    .set('operation', 'All')
                    .set('value', IndexValues({ values: List() }))
                : part,
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
    case types.REMOVE_INDEX_PART_INPUT:
      return state.updateIn(['searchParams', 'indexParts'], indexParts =>
        indexParts.update(
          indexParts.findIndex(p => payload.part.name === p.name),
          p =>
            p.updateIn(['value', 'values'], values =>
              values.delete(values.findIndex(v => v === payload.value)),
            ),
        ),
      );
    case types.RESET_SEARCH_PARAMS:
      return state
        .set('simpleSearchActive', true)
        .set('searchParams', SearchParams())
        .set('simpleSearchParam', '')
        .set('simpleSearchNextPageIndex', null)
        .set('sortDirection', 'ASC')
        .set('nextPageToken', null)
        .set('pageTokens', List())
        .set('submissions', List())
        .set('hasStartedSearching', false)
        .set('clientSortInfo', null);
    case types.PUSH_PAGE_TOKEN:
      return state.update('pageTokens', pageTokens => pageTokens.push(payload));
    case types.POP_PAGE_TOKEN:
      return state
        .set('nextPageToken', state.pageTokens.get(-2))
        .update('pageTokens', pageTokens => pageTokens.pop().pop());
    case types.CLEAR_PAGE_TOKENS:
      return state.set('pageTokens', List()).set('nextPageToken', null);
    case types.SET_NEXT_PAGE_TOKEN:
      return state.set('nextPageToken', payload);
    case types.SET_ADVANCED_SEARCH_OPEN:
      return state.set('advancedSearchOpen', payload);
    case types.SET_SIMPLE_SEARCH:
      return state.set('simpleSearchActive', payload);
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
    case types.SET_SORT_DIRECTION:
      return state.set('sortDirection', payload === 'DESC' ? payload : 'ASC');
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
      return state.setIn(['currentFormChanges', payload.type], payload.value);
    case types.OPEN_MODAL:
      return state.set('modalIsOpen', true).set('modalName', payload);
    case types.CLOSE_MODAL:
      return state.set('modalIsOpen', false).set('modalName', '');
    case types.FETCH_ALL_SUBMISSIONS:
      return state.set('fetchingAll', true);
    case types.SET_EXPORT_SUBMISSIONS:
      return state.set('exportSubmissions', payload).set('fetchingAll', false);
    case types.SET_EXPORT_COUNT:
      return state.set('exportCount', payload);
    case types.SET_CLIENT_SORT_INFO:
      return state
        .set('clientSortInfo', payload)
        .set('submissions', sortSubmissions(state.submissions, payload));
    case types.EXECUTE_IMPORT:
      return state.set('importProcessing', true).set('importComplete', false);
    case types.SET_IMPORT_PERCENT_COMPLETE:
      return state.set('importPercentComplete', payload);
    case types.SET_IMPORT_FAILED_CALL:
      return state.update('importFailedCalls', acc => acc.push(payload));
    case types.SET_IMPORT_COMPLETE:
      return state
        .set('importProcessing', false)
        .set('importPercentComplete', 0)
        .set('importComplete', true);
    case types.RESET_IMPORT_FAILED_CALL:
      return state.set('importFailedCalls', List());
    default:
      return state;
  }
};
