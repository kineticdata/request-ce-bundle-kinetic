import { Record, List } from 'immutable';
import * as Utils from '../../utils';
import { store } from '../store';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('common/submissions');

export const types = {
  FETCH_EXPORT_FORM_REQUEST: ns('FETCH_EXPORT_FORM_REQUEST'),
  FETCH_EXPORT_FORM_SUCCESS: ns('FETCH_EXPORT_FORM_SUCCESS'),
  FETCH_EXPORT_FORM_FAILURE: ns('FETCH_EXPORT_FORM_FAILURE'),
};

export const actions = {
  fetchExportFormRequest: withPayload('fetchExportFormRequest'),
  fetchExportFormSuccess: withPayload('fetchExportFormSuccess'),
  fetchExportFormFailure: withPayload('fetchExportFormFailure'),
};

export const State = Record({
  exportForm: null,
  exportError: null,
  exportSubmissions: List(),
  exporting: false,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_EXPORT_FORM_REQUEST:
      return state.set('exportError', null);
    case types.FETCH_EXPORT_FORM_SUCCESS:
      return state.set('exportForm', payload);
    case types.FETCH_EXPORT_FORM_FAILURE:
      return state.set('exportError', payload);
    default:
      return state;
  }
};

export const openModalForm = payload =>
  store.dispatch(actions.openForm(payload));
