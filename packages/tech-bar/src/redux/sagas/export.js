import { takeEvery, all, put, call, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { actions, types } from '../modules/export';

export function* fetchSubmissionsSaga({
  payload: { formSlug, queryBuilder, schedulerIds },
}) {
  const kappSlug = yield select(state => state.app.config.kappSlug);

  yield call(fetchSubmissions, {
    kappSlug,
    formSlug,
    searchers: schedulerIds.map(schedulerId => {
      const searcher = new CoreAPI.SubmissionSearch();
      searcher.include('details,values,form.fields');
      searcher.limit(1000);
      searcher.eq('values[Scheduler Id]', schedulerId);
      if (typeof queryBuilder === 'function') {
        queryBuilder(searcher);
      }
      return searcher;
    }),
  });
}

function* fetchSubmissions({ kappSlug, formSlug, searchers }) {
  const results = yield all(
    searchers.map(searcher =>
      call(CoreAPI.searchSubmissions, {
        search: searcher.build(),
        kapp: kappSlug,
        form: formSlug,
      }),
    ),
  );

  const { submissions, error, nextSearchers } = results.reduce(
    (
      data,
      { submissions, nextPageToken = null, error, serverError },
      index,
    ) => {
      if (!data.error) {
        if (serverError) {
          data.error = serverError.error || serverError.statusText;
        } else if (error) {
          data.error = error;
        } else {
          data.submissions.push(...submissions);
          if (nextPageToken) {
            const searcher = searchers[index];
            searcher.pageToken(nextPageToken);
            data.nextSearchers.push(searcher);
          }
        }
      }
      return data;
    },
    {
      submissions: [],
      error: null,
      nextSearchers: [],
    },
  );

  if (error) {
    yield put(actions.setSubmissionsError(error));
  } else {
    yield put(actions.setSubmissions(submissions));
  }

  if (nextSearchers.length > 0) {
    yield call(fetchSubmissions, {
      kappSlug,
      formSlug,
      searchers: nextSearchers,
    });
  } else {
    yield put(actions.completeExport());
  }
}

export function* watchExport() {
  yield takeEvery(types.EXPORT_SUBMISSIONS, fetchSubmissionsSaga);
}
