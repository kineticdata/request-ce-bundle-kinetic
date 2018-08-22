import { List, Record } from 'immutable';
import { Utils } from 'common';
import isobject from 'isobject';

const { namespace, noPayload, withPayload } = Utils;

export const FORMS_INCLUDES = 'details,attributes';
export const FORM_INCLUDES = 'details,fields,attributesMap,categorizations';
export const FORM_FULL_INCLUDES =
  'details,fields,bridgedResources,customHeadContent,pages,securityPolicies,attributesMap,categorizations';
export const SUBMISSION_INCLUDES =
  'details,values,form,form.fields,activities,activities.details';

// Used to define form configurations
export const FormConfig = Record({
  // columns config
  columns: List(),
});

// Used to define a single table column
export const ColumnConfig = Record({
  // name of the column
  name: '',
  // lable of the column displayed in table
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
  FETCH_FORM: namespace('settingsForms', 'FETCH_FORM'),
  SET_FORM: namespace('settingsForms', 'SET_FORM'),
  UPDATE_FORM: namespace('settingsForms', 'UPDATE_FORM'),
  CREATE_FORM: namespace('settingsForms', 'CREATE_FORM'),
  FETCH_FORM_SUBMISSIONS: namespace('settingsForms', 'FETCH_FORM_SUBMISSIONS'),
  SET_FORM_SUBMISSIONS: namespace('settingsForms', 'SET_FORM_SUBMISSIONS'),
  FETCH_FORM_SUBMISSION: namespace('settingsForms', 'FETCH_FORM_SUBMISSION'),
  SET_FORM_SUBMISSION: namespace('settingsForms', 'SET_FORM_SUBMISSION'),
  FETCH_KAPP: namespace('settingsForms', 'FETCH_KAPP'),
  SET_KAPP: namespace('settingsForms', 'SET_KAPP'),
  SET_FORMS_ERROR: namespace('settingsForms', 'SET_FORMS_ERROR'),
  FETCH_NOTIFICATIONS: namespace('settingsForms', 'FETCH_NOTIFICATIONS'),
  SET_NOTIFICATIONS: namespace('settingsForms', 'SET_NOTIFICATIONS'),
  SET_CLIENT_SORT_INFO: namespace('settingsForms', 'SET_CLIENT_SORT_INFO'),
};

export const actions = {
  fetchForm: withPayload(types.FETCH_FORM),
  setForm: withPayload(types.SET_FORM),
  updateForm: withPayload(types.UPDATE_FORM),
  createForm: withPayload(types.CREATE_FORM),
  fetchFormSubmissions: withPayload(types.FETCH_FORM_SUBMISSIONS),
  setFormSubmissions: withPayload(types.SET_FORM_SUBMISSIONS),
  fetchFormSubmission: withPayload(types.FETCH_FORM_SUBMISSION),
  setFormSubmission: withPayload(types.SET_FORM_SUBMISSION),
  fetchKapp: withPayload(types.FETCH_KAPP),
  setKapp: withPayload(types.SET_KAPP),
  setFormsError: withPayload(types.SET_FORMS_ERROR),
  fetchNotifications: withPayload(types.FETCH_NOTIFICATIONS),
  setNotifications: withPayload(types.SET_NOTIFICATIONS),
  setClientSortInfo: withPayload(types.SET_CLIENT_SORT_INFO),
};

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

export const selectCurrentForm = state =>
  state.services.settingsForms.currentForm;
export const selectCurrentFormChanges = state =>
  state.services.settingsForms.currentFormChanges;
export const selectFormBySlug = (state, formSlug) =>
  state.services.forms.find(form => form.slug === formSlug);

export const State = Record({
  loading: true,
  errors: [],
  currentForm: null,
  currentFormChanges: null,
  servicesKapp: null,
  kappLoading: true,
  notificationsLoading: true,
  notifications: null,
  currentFormSubmissions: null,
  nextPageToken: null,
  submissionsLoading: true,
  submissionLoading: true,
  formSubmission: null,
  // Columns form configuration data
  submissionColumns: new List(),
  // Client Side Sorting
  clientSortInfo: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_FORM:
      return state.set('loading', true);
    case types.SET_FORM:
      const config = buildFormConfigurationObject(payload);
      const newForm =
        state.currentForm && state.currentForm.slug !== payload.slug;
      return state
        .set('loading', false)
        .set('currentForm', payload)
        .set('submissionColumns', config.columns)
        .set('clientSortInfo', newForm ? null : state.clientSortInfo);
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
    case types.FETCH_FORM_SUBMISSION:
      return state.set('submissionLoading', true);
    case types.SET_FORM_SUBMISSION:
      return state
        .set('submissionLoading', false)
        .set('formSubmission', payload);
    case types.FETCH_KAPP:
      return state.set('kappLoading', true);
    case types.SET_KAPP:
      return state.set('kappLoading', false).set('servicesKapp', payload);
    case types.FETCH_NOTIFICATIONS:
      return state.set('notificationsLoading', true);
    case types.SET_NOTIFICATIONS:
      return state
        .set('notificationsLoading', false)
        .set('notifications', payload);
    case types.SET_FORMS_ERROR:
      return state.set('loading', false).set('errors', payload);
    case types.SET_CLIENT_SORT_INFO:
      return state
        .set('clientSortInfo', payload)
        .set(
          'currentFormSubmissions',
          sortSubmissions(state.currentFormSubmissions, payload),
        );
    default:
      return state;
  }
};

export default reducer;
