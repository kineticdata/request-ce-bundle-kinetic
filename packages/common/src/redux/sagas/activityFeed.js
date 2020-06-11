import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../modules/activityFeed';

export function* initActivityFeedSaga({ payload: { feedKey } }) {
  yield put(actions.fetchDataRequest({ feedKey }));
}

function* fetchDataSaga({ payload: { feedKey } }) {
  console.log('FETCH DATA');
  const dataSources = yield select(state =>
    state.activityFeed.getIn([feedKey, 'dataSources']),
  );

  // For each dataSource that needs more data, fetch data for that dataSource
  yield all(
    dataSources
      .map((source, sourceName) => {
        if (source.fn && !source.completed && source.shouldFetch) {
          return put(
            actions.fetchDataSourceRequest({
              feedKey,
              sourceName,
            }),
          );
        } else {
          return null;
        }
      })
      .filter(s => s)
      .toJS(),
  );
}

export function* fetchDataSourceSaga({ payload: { feedKey, sourceName } }) {
  console.log('FETCH DATA SOURCE', sourceName);
  const source = yield select(state =>
    state.activityFeed.getIn([feedKey, 'dataSources', sourceName]),
  );

  if (source.completed || !source.params) {
    console.log('FETCH DATA SOURCE - COMPLETED', sourceName);
    actions.fetchDataSourceSuccess({
      feedKey,
      sourceName,
      result: { data: [] },
    });
  } else {
    const { error, ...result } = yield call(source.fn, source.params);

    if (error) {
      console.log('FETCH DATA SOURCE - FAILURE', sourceName);
      yield put(actions.fetchDataSourceFailure({ feedKey, sourceName, error }));
    } else {
      try {
        const transformedResult = source.transform(result);
        if (transformedResult.data) {
          console.log(
            'FETCH DATA SOURCE - SUCCESS',
            sourceName,
            transformedResult.data.length,
          );
          yield put(
            actions.fetchDataSourceSuccess({
              feedKey,
              sourceName,
              result: transformedResult,
            }),
          );
        } else {
          console.log(
            'FETCH DATA SOURCE - SUCCESS ERROR',
            sourceName,
            "Transofrm didn't yield data",
          );
          yield put(
            actions.fetchDataSourceFailure({
              feedKey,
              sourceName,
              error: {
                message: `Transform failed to return an object with a data property.`,
              },
            }),
          );
        }
      } catch (e) {
        console.log('FETCH DATA SOURCE - SUCCESS ERROR', sourceName, e.message);
        yield put(
          actions.fetchDataSourceFailure({
            feedKey,
            sourceName,
            error: {
              message: `Failed to transform results. ${e.message}`,
            },
          }),
        );
      }
    }
  }
}

/**
 * Check if additional data needs to be fetched to have enough records for the
 * currently requested page. If yes, call action to fetch data.
 */
export function* verifySufficientDataSaga({ payload: { feedKey } }) {
  const feed = yield select(state => state.activityFeed.get(feedKey));

  // If any sources are still loading, don't do anything
  if (feed.dataSources.some(s => s.loading)) {
    return feed;
  }

  // If there isn't enough data and some sources are still not completed,
  // fetch additional data.
  if (
    (!feed.pageStaging || feed.pageStaging.length < feed.pageSize) &&
    feed.dataSources.some(s => !s.completed || s.data.size)
  ) {
    console.log('MORE DATA REQUIRED');
    yield put(actions.fetchDataRequest({ feedKey }));
  } else {
    console.log('DATA AVAILABLE');
  }
}

export function* watchActivityFeed() {
  yield takeEvery(types.INIT_ACTIVITY_FEED, initActivityFeedSaga);
  yield takeEvery(types.FETCH_DATA_REQUEST, fetchDataSaga);
  yield takeEvery(types.FETCH_DATA_SOURCE_REQUEST, fetchDataSourceSaga);
  yield takeEvery(
    [
      types.FETCH_DATA_SOURCE_SUCCESS,
      types.FETCH_DATA_SOURCE_FAILURE,
      types.NEXT_PAGE,
    ],
    verifySufficientDataSaga,
  );
}
