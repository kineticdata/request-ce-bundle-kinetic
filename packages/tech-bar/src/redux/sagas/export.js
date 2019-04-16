import { takeEvery, put, call, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { actions, types } from '../modules/export';

export function* fetchSubmissionsSaga({ payload }) {
  const { formSlug, queryBuilder, pageToken } = payload;
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const searcher = new CoreAPI.SubmissionSearch();
  searcher.include('details,values,form.fields');
  searcher.limit(1000);
  if (pageToken) {
    searcher.pageToken(pageToken);
  }
  if (typeof queryBuilder === 'function') {
    queryBuilder(searcher);
  }
  const { submissions, nextPageToken = null, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: searcher.build(),
      kapp: kappSlug,
      form: formSlug,
    },
  );

  if (nextPageToken) {
    yield put(actions.setSubmissions({ submissions }));
    yield call(fetchSubmissionsSaga, { payload, pageToken: nextPageToken });
  } else {
    if (serverError) {
      yield put(actions.setSubmissionsError(serverError));
    } else {
      yield put(actions.setSubmissions({ submissions, completed: true }));
    }
  }
}

export function* watchExport() {
  yield takeEvery(types.EXPORT_SUBMISSIONS, fetchSubmissionsSaga);
}
