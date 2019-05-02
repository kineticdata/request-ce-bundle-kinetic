import { takeEvery, all, put, call, select } from 'redux-saga/effects';
import { SubmissionSearch, searchSubmissions } from '@kineticdata/react';
import { actions, types } from '../modules/export';
import isarray from 'isarray';

export function* fetchSubmissionsSaga({
  payload: {
    formSlug,
    queryBuilder,
    schedulerIds,
    eventType,
    dates,
    dateFieldName = 'Event Date',
  },
}) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const dateParts = [];
  if (dates && dates.length > 8) {
    for (let i = 0; i <= dates.length; i += 8) {
      dateParts.push(dates.slice(i, i + 8));
    }
  }

  yield call(fetchSubmissions, {
    kappSlug,
    formSlug,
    searchers: schedulerIds
      .map(schedulerId => {
        if (dateParts.length > 0) {
          return dateParts.map(datePart =>
            buildSearcher({
              queryBuilder,
              schedulerId,
              eventType,
              dates: datePart,
              dateFieldName,
            }),
          );
        } else {
          return buildSearcher({
            queryBuilder,
            schedulerId,
            eventType,
            dates,
            dateFieldName,
          });
        }
      })
      .reduce((searchers, query) => {
        if (isarray(query)) {
          return [...searchers, ...query];
        } else {
          return [...searchers, query];
        }
      }, []),
  });
}

const buildSearcher = ({
  queryBuilder,
  schedulerId,
  eventType,
  dates,
  dateFieldName,
}) => {
  const searcher = new SubmissionSearch();
  searcher.include('details,values,form.fields');
  searcher.limit(1000);
  if (typeof queryBuilder === 'function') {
    queryBuilder(searcher);
  }
  if (dates && dates.length > 1) {
    searcher.or();
    dates.forEach(date => {
      searcher.and();
      searcher.eq('values[Scheduler Id]', schedulerId);
      if (eventType) {
        searcher.eq('values[Event Type]', eventType);
      }
      searcher.eq(`values[${dateFieldName}]`, date);
      searcher.end();
    });
    searcher.end();
  } else {
    searcher.eq('values[Scheduler Id]', schedulerId);
    if (eventType) {
      searcher.eq('values[Event Type]', eventType);
    }
    if (dates && dates.length === 1) {
      searcher.eq(`values[${dateFieldName}]`, dates[0]);
    }
  }
  return searcher;
};

function* fetchSubmissions({ kappSlug, formSlug, searchers }) {
  const results = yield all(
    searchers.map(searcher =>
      call(searchSubmissions, {
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
