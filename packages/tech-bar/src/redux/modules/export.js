import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const FEEDBACK_FORM_SLUG = 'feedback';
export const GENERAL_FEEDBACK_FORM_SLUG = 'general-feedback';

export const types = {
  EXPORT_SUBMISSIONS: namespace('techBarMetricsExport', 'EXPORT_SUBMISSIONS'),
  SET_SUBMISSIONS: namespace('techBarMetricsExport', 'SET_SUBMISSIONS'),
  SET_SUBMISSIONS_ERROR: namespace(
    'techBarMetricsExport',
    'SET_SUBMISSIONS_ERROR',
  ),
  COMPLETE_EXPORT: namespace('techBarMetricsExport', 'COMPLETE_EXPORT'),
};

export const actions = {
  exportSubmissions: withPayload(types.EXPORT_SUBMISSIONS),
  setSubmissions: withPayload(types.SET_SUBMISSIONS),
  setSubmissionsError: withPayload(types.SET_SUBMISSIONS_ERROR),
  completeExport: noPayload(types.COMPLETE_EXPORT),
};

export const State = Record({
  exporting: false,
  submissions: List(),
  error: false,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.EXPORT_SUBMISSIONS:
      return state
        .set('submissions', List())
        .set('error', false)
        .set('exporting', true);
    case types.SET_SUBMISSIONS:
      return state.update('submissions', submissions =>
        submissions.push(...payload),
      );
    case types.SET_SUBMISSIONS_ERROR:
      return state.set('error', payload).set('exporting', false);
    case types.COMPLETE_EXPORT:
      return state.set('exporting', false);
    default:
      return state;
  }
};
