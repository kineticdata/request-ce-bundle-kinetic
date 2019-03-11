import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  actions,
  types,
  SEARCH_HISTORY_FORM_SLUG,
} from '../modules/searchHistory';
import { createSubmission, fetchForm } from 'react-kinetic-lib';

export function* recordSearchHistorySaga({ payload }) {
  const searchHistoryExists = yield select(
    state => state.common.searchHistory.searchHistoryExists,
  );
  // If searchHistoryExists is undefined, check if Search History form exists
  if (typeof searchHistoryExists === 'undefined') {
    console.log('fetch search history form');
    const { form } = yield call(fetchForm, {
      datastore: true,
      formSlug: SEARCH_HISTORY_FORM_SLUG,
    });
    // Set searchHistoryExists so this only has to be done once
    yield put(actions.searchHistoryExists(!!form));
    // Call self to record history if enabled
    yield* recordSearchHistorySaga({ payload });
  }
  // If searchHistoryExists is true, and searchTerm is not empty, record search
  else if (searchHistoryExists && payload.searchTerm) {
    const searchHistoryEnabled = yield select(
      state => state.common.searchHistory.searchHistoryEnabled,
    );
    if (
      searchHistoryEnabled[payload.kappSlug] === 'All' ||
      (searchHistoryEnabled[payload.kappSlug] === 'None' &&
        parseInt(payload.resultsCount, 10) === 0)
    ) {
      console.log('record search', {
        'Kapp Slug': payload.kappSlug,
        'Search Term': payload.searchTerm,
        'Number of Results Found': payload.resultsCount,
      });
      yield call(createSubmission, {
        datastore: true,
        formSlug: SEARCH_HISTORY_FORM_SLUG,
        values: {
          'Kapp Slug': payload.kappSlug,
          'Search Term': payload.searchTerm,
          'Number of Results Found': payload.resultsCount,
        },
      });
    } else {
      console.log('record search disabled');
    }
  } else {
    console.log("search form doesn't exist or search query is empty");
  }
}

export function* watchSearchHistory() {
  yield takeEvery(types.RECORD_SEARCH_HISTORY, recordSearchHistorySaga);
}
