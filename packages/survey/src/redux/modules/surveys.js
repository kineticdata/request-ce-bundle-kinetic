import { List, Map, Record } from 'immutable';
import { Utils } from 'common';
import isobject from 'isobject';
const { namespace, noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('survey/surveys');

export const FORMS_INCLUDES = 'details,attributes';
export const FORM_INCLUDES = 'details,fields,attributesMap,categorizations';
export const FORM_FULL_INCLUDES =
  'details,fields,customHeadContent,pages,securityPolicies,attributesMap,categorizations';
export const SUBMISSION_INCLUDES =
  'details,values,form,form.kapp,form.fields,activities,activities.details';

// Used to define form configurations
export const FormConfig = Record({
  // columns config
  columns: List(),
});

// Used to define a single table column
export const ColumnConfig = Record({
  // name of the column
  name: '',
  // label of the column displayed in table
  label: '',
  // Valid types are: system, value.
  type: '',
  // if the column is displayable in the table
  visible: false,
});

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

export const parseFormConfigurationJson = json => {
  try {
    const parsed = JSON.parse(json);
    if (isobject(parsed)) {
      return FormConfig(parsed).update('columns', c => List(c));
    } else {
      return FormConfig();
    }
  } catch (e) {
    return FormConfig();
  }
};

export const buildFormConfigurationObject = form => {
  // Parse Form Attribute for Configuration Values
  const parsedConfig = parseFormConfigurationJson(
    form.attributesMap['Form Configuration'] &&
      form.attributesMap['Form Configuration'][0],
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

export const types = {
  FETCH_FORM_SUBMISSIONS: namespace('surveys', 'FETCH_FORM_SUBMISSIONS'),
  SET_FORM_SUBMISSIONS: namespace('surveys', 'SET_FORM_SUBMISSIONS'),
  FETCH_ALL_SUBMISSIONS: namespace('surveys', 'FETCH_ALL_SUBMISSIONS'),
  SET_EXPORT_SUBMISSIONS: namespace('surveys', 'SET_EXPORT_SUBMISSIONS'),
  SET_EXPORT_COUNT: namespace('surveys', 'SET_EXPORT_COUNT'),
  OPEN_MODAL: namespace('surveys', 'OPEN_MODAL'),
  CLOSE_MODAL: namespace('surveys', 'CLOSE_MODAL'),
  SET_DOWNLOADED: namespace('surveys', 'SET_DOWNLOADED'),
  SET_CLIENT_SORT_INFO: namespace('surveys', 'SET_CLIENT_SORT_INFO'),

  FETCH_FORM_REQUEST: ns('FETCH_FORM_REQUEST'),
  FETCH_FORM_SUCCESS: ns('FETCH_FORM_SUCCESS'),
  FETCH_FORM_FAILURE: ns('FETCH_FORM_FAILURE'),
  FETCH_SUBMISSION_REQUEST: ns('FETCH_SUBMISSION_REQUEST'),
  FETCH_SUBMISSION_SUCCESS: ns('FETCH_SUBMISSION_SUCCESS'),
  FETCH_SUBMISSION_FAILURE: ns('FETCH_SUBMISSION_FAILURE'),
  DELETE_FORM_REQUEST: ns('DELETE_FORM_REQUEST'),
  DELETE_FORM_COMPLETE: ns('DELETE_FORM_COMPLETE'),
  CLONE_FORM_REQUEST: ns('CLONE_FORM_REQUEST'),
  CLONE_FORM_COMPLETE: ns('CLONE_FORM_COMPLETE'),

  FETCH_SURVEY_TEMPLATES: ns('FETCH_SURVEY_TEMPLATES'),
  FETCH_SURVEY_TEMPLATES_COMPLETE: ns('FETCH_SURVEY_TEMPLATES_COMPLETE'),
  CREATE_FORM_REQUEST: ns('CREATE_FORM_REQUEST'),
  CREATE_FORM_SUCCESS: ns('CREATE_FORM_SUCCESS'),
  CREATE_FORM_FAILURE: ns('CREATE_FORM_FAILURE'),
};

export const actions = {
  fetchFormSubmissions: withPayload(types.FETCH_FORM_SUBMISSIONS),
  setFormSubmissions: withPayload(types.SET_FORM_SUBMISSIONS),
  fetchAllSubmissions: withPayload(types.FETCH_ALL_SUBMISSIONS),
  setClientSortInfo: withPayload(types.SET_CLIENT_SORT_INFO),
  setDownloaded: withPayload(types.SET_DOWNLOADED),
  openModal: withPayload(types.OPEN_MODAL),
  closeModal: noPayload(types.CLOSE_MODAL),
  setExportSubmissions: withPayload(types.SET_EXPORT_SUBMISSIONS),
  setExportCount: withPayload(types.SET_EXPORT_COUNT),

  fetchFormRequest: withPayload(types.FETCH_FORM_REQUEST),
  fetchFormSuccess: withPayload(types.FETCH_FORM_SUCCESS),
  fetchFormFailure: withPayload(types.FETCH_FORM_FAILURE),
  fetchSubmissionRequest: withPayload(types.FETCH_SUBMISSION_REQUEST),
  fetchSubmissionSuccess: withPayload(types.FETCH_SUBMISSION_SUCCESS),
  fetchSubmissionFailure: withPayload(types.FETCH_SUBMISSION_FAILURE),
  deleteFormRequest: withPayload(types.DELETE_FORM_REQUEST),
  deleteFormComplete: withPayload(types.DELETE_FORM_COMPLETE),
  cloneFormRequest: withPayload(types.CLONE_FORM_REQUEST),
  cloneFormComplete: withPayload(types.CLONE_FORM_COMPLETE),

  fetchSurveyTemplates: withPayload(types.FETCH_SURVEY_TEMPLATES),
  fetchSurveyTemplatesComplete: withPayload(
    types.FETCH_SURVEY_TEMPLATES_COMPLETE,
  ),
  createFormRequest: withPayload(types.CREATE_FORM_REQUEST),
  createFormSuccess: withPayload(types.CREATE_FORM_SUCCESS),
  createFormFailure: withPayload(types.CREATE_FORM_FAILURE),
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

export const State = Record({
  loading: true,
  errors: [],
  currentFormSubmissions: null,
  nextPageToken: null,
  submissionsLoading: true,
  // Client Side Sorting
  clientSortInfo: null,
  modalIsOpen: false,
  modalName: '',
  exportSubmissions: [],
  exportCount: 0,
  downloaded: false,
  fetchingAll: false,
  processing: Map(),
  form: null,
  error: null,
  submission: null,
  submissionError: null,
  templates: [],
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_FORM_SUBMISSIONS:
      return state.set('submissionsLoading', true);
    case types.SET_FORM_SUBMISSIONS:
      return state
        .set('submissionsLoading', false)
        .set(
          'currentFormSubmissions',
          sortSubmissions(List(payload.submissions), state.clientSortInfo),
        )
        .set('nextPageToken', payload.nextPageToken);
    case types.SET_CLIENT_SORT_INFO:
      return state
        .set('clientSortInfo', payload)
        .set(
          'currentFormSubmissions',
          sortSubmissions(state.currentFormSubmissions, payload),
        );
    case types.SET_FORMS_ERROR:
      return state.set('loading', false).set('errors', payload);
    case types.FETCH_ALL_SUBMISSIONS:
      return state
        .set('exportSubmissions', [])
        .set('exportCount', 0)
        .set('fetchingAll', true);
    case types.SET_EXPORT_SUBMISSIONS:
      return state.set('exportSubmissions', payload).set('fetchingAll', false);
    case types.SET_EXPORT_COUNT:
      return state.set('exportCount', payload);
    case types.OPEN_MODAL:
      return state.set('modalIsOpen', true).set('modalName', payload);
    case types.CLOSE_MODAL:
      return state.set('modalIsOpen', false).set('modalName', '');
    case types.SET_DOWNLOADED:
      return state.set('downloaded', payload);

    case types.FETCH_FORM_REQUEST:
      return state
        .update(
          'form',
          form => (form && form.slug === payload.formSlug ? form : null),
        )
        .set('error', null);
    case types.FETCH_FORM_SUCCESS:
      return state.set('form', payload);
    case types.FETCH_FORM_FAILURE:
      return state.set('error', payload);
    case types.FETCH_SUBMISSION_REQUEST:
      return state
        .update(
          'submission',
          submission =>
            submission && submission.id === payload.id ? submission : null,
        )
        .set('submissionError', null);
    case types.FETCH_SUBMISSION_SUCCESS:
      return state.set('submission', payload);
    case types.FETCH_SUBMISSION_FAILURE:
      return state.set('submissionError', payload);
    case types.DELETE_FORM_REQUEST:
      return state.setIn(['processing', payload.formSlug], true);
    case types.DELETE_FORM_COMPLETE:
      return state.deleteIn(['processing', payload.formSlug]);
    case types.CLONE_FORM_REQUEST:
      return state.setIn(['processing', payload.cloneFormSlug], true);
    case types.CLONE_FORM_COMPLETE:
      return state.deleteIn(['processing', payload.cloneFormSlug]);

    case types.CREATE_FORM_REQUEST:
      return state.setIn(['processing', payload.form.slug], true);
    case types.CREATE_FORM_SUCCESS:
      return state.set('form', payload);
    case types.CREATE_FORM_FAILURE:
      return state.set('error', payload);
    case types.FETCH_SURVEY_TEMPLATES_COMPLETE:
      return state.set('templates', payload.templates);

    default:
      return state;
  }
};

export default reducer;
