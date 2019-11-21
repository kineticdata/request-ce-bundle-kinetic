import { List, Map, Record } from 'immutable';
import { Utils } from 'common';
import isobject from 'isobject';

const { namespace, noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/settings/forms');

export const FORMS_INCLUDES = 'details,attributes';
export const FORM_INCLUDES = 'details,fields,attributesMap,categorizations';
export const FORM_FULL_INCLUDES =
  'details,fields,bridgedResources,customHeadContent,pages,securityPolicies,attributesMap,categorizations';
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

export const types = {
  CREATE_FORM: namespace('settingsForms', 'CREATE_FORM'),
  FETCH_ALL_SUBMISSIONS: namespace('settingsForms', 'FETCH_ALL_SUBMISSIONS'),
  SET_EXPORT_SUBMISSIONS: namespace('settingsForms', 'SET_EXPORT_SUBMISSIONS'),
  SET_EXPORT_COUNT: namespace('settingsForms', 'SET_EXPORT_COUNT'),
  OPEN_MODAL: namespace('settingsForms', 'OPEN_MODAL'),
  CLOSE_MODAL: namespace('settingsForms', 'CLOSE_MODAL'),
  SET_DOWNLOADED: namespace('settingsForms', 'SET_DOWNLOADED'),

  FETCH_FORM_REQUEST: ns('FETCH_FORM_REQUEST'),
  FETCH_FORM_SUCCESS: ns('FETCH_FORM_SUCCESS'),
  FETCH_FORM_FAILURE: ns('FETCH_FORM_FAILURE'),
  FETCH_SUBMISSION_REQUEST: ns('FETCH_SUBMISSION_REQUEST'),
  FETCH_SUBMISSION_SUCCESS: ns('FETCH_SUBMISSION_SUCCESS'),
  FETCH_SUBMISSION_FAILURE: ns('FETCH_SUBMISSION_FAILURE'),
  DELETE_FORM_REQUEST: ns('DELETE_FORM_REQUEST'),
  DELETE_FORM_COMPLETE: ns('DELETE_FORM_COMPLETE'),
};

export const actions = {
  createForm: withPayload(types.CREATE_FORM),
  setFormsError: withPayload(types.SET_FORMS_ERROR),

  fetchAllSubmissions: withPayload(types.FETCH_ALL_SUBMISSIONS),
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
};

export const State = Record({
  loading: true,
  errors: [],
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
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_FORMS_ERROR:
      return state.set('loading', false).set('errors', payload);
    case types.FETCH_ALL_SUBMISSIONS:
      return state.set('fetchingAll', true);
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
    default:
      return state;
  }
};

export default reducer;
