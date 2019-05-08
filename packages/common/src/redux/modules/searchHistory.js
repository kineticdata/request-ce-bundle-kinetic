import { Record } from 'immutable';
import { namespace, withPayload } from '../../utils';
import { store } from '../store';

export const SEARCH_HISTORY_FORM_SLUG = 'search-history';

export const types = {
  SEARCH_HISTORY_EXISTS: namespace('searchHistory', 'SEARCH_HISTORY_EXISTS'),
  ENABLE_SEARCH_HISTORY: namespace('searchHistory', 'ENABLE_SEARCH_HISTORY'),
  RECORD_SEARCH_HISTORY: namespace('searchHistory', 'RECORD_SEARCH_HISTORY'),
};

export const actions = {
  searchHistoryExists: withPayload(types.SEARCH_HISTORY_EXISTS),
  enableSearchHistory: withPayload(types.ENABLE_SEARCH_HISTORY),
  recordSearchHistory: withPayload(types.RECORD_SEARCH_HISTORY),
};

export const State = Record({
  searchHistoryExists: undefined,
  searchHistoryEnabled: {},
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SEARCH_HISTORY_EXISTS:
      return state.set('searchHistoryExists', payload);
    case types.ENABLE_SEARCH_HISTORY: {
      if (payload.kappSlug) {
        return state.setIn(
          ['searchHistoryEnabled', payload.kappSlug],
          payload.value,
        );
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};

export const enableSearchHistory = payload =>
  store.dispatch(actions.enableSearchHistory(payload));
export const recordSearchHistory = payload =>
  store.dispatch(actions.recordSearchHistory(payload));
