import { call, put, takeEvery } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from '@kineticdata/react';
import { actions as systemErrorActions } from '../modules/errors';
import { actions, types, ROBOT_FORM_SLUG } from '../modules/robots';

export function* fetchRobotsSaga(action) {
  const query = new SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');

  const { submissions, errors, serverError } = yield call(searchSubmissions, {
    search: query.build(),
    datastore: true,
    form: ROBOT_FORM_SLUG,
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setFetchRobotsError(errors));
  } else {
    const filteredSubmissions = submissions.filter(
      s => s.values.Category === 'Survey Poller',
    );
    yield put(actions.setRobots(filteredSubmissions));
  }
}

export function* watchRobots() {
  yield takeEvery(types.FETCH_ROBOTS, fetchRobotsSaga);
}
