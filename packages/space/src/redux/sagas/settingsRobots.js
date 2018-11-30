import { call, put, select, takeEvery } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { actions as systemErrorActions } from '../modules/errors';
import {
  actions,
  types,
  ROBOT_FORM_SLUG,
  ROBOT_EXECUTIONS_FORM_SLUG,
  ROBOT_EXECUTIONS_PAGE_SIZE,
} from '../modules/settingsRobots';

export function* fetchRobotsSaga(action) {
  const query = new CoreAPI.SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');

  const { submissions, errors, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: query.build(),
      datastore: true,
      form: ROBOT_FORM_SLUG,
    },
  );

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setFetchRobotsError(errors));
  } else {
    yield put(actions.setRobots(submissions));
  }
}

export function* fetchRobotSaga(action) {
  const include = 'details,values';
  const { submission, errors, serverError } = yield call(
    CoreAPI.fetchSubmission,
    {
      id: action.payload,
      include,
      datastore: true,
    },
  );

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setRobotError(errors));
  } else {
    yield put(actions.setRobot(submission));
  }
}

export function* deleteRobotSaga(action) {
  const { errors, serverError } = yield call(CoreAPI.deleteSubmission, {
    id: action.payload.id,
    datastore: true,
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setDeleteError(errors));
  } else {
    yield put(actions.setDeleteSuccess());
    if (typeof action.payload.callback === 'function') {
      action.payload.callback();
    }
  }
}

export function* fetchRobotExecutionsSaga({ payload: { scheduleId } }) {
  const pageToken = yield select(
    state => state.space.settingsRobots.robotExecutionsCurrentPageToken,
  );
  const query = new CoreAPI.SubmissionSearch(true);
  if (pageToken) {
    query.pageToken(pageToken);
  }
  query.include('details,values');
  query.limit(ROBOT_EXECUTIONS_PAGE_SIZE);
  query.sortDirection('DESC');
  query.eq('values[Robot ID]', scheduleId);
  query.index('values[Robot ID],values[Start]');

  const { submissions, nextPageToken, errors, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: query.build(),
      datastore: true,
      form: ROBOT_EXECUTIONS_FORM_SLUG,
    },
  );

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setFetchRobotExecutionsError(errors));
  } else {
    yield put(actions.setRobotExecutions({ submissions, nextPageToken }));
  }
}

export function* fetchRobotExecutionSaga(action) {
  const include = 'details,values';
  const { submission, errors, serverError } = yield call(
    CoreAPI.fetchSubmission,
    {
      id: action.payload,
      include,
      datastore: true,
    },
  );

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setRobotExecutionError(errors));
  } else {
    yield put(actions.setRobotExecution(submission));
  }
}

export function* fetchNextExecutionsSaga(action) {
  const query = new CoreAPI.SubmissionSearch(true);

  query.include('details,values');
  query.limit('1000');

  const { submissions, errors, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: query.build(),
      datastore: true,
      form: 'robot-next-execution',
    },
  );

  if (serverError) {
  } else if (errors) {
  } else {
    yield put(actions.setNextExecutions(submissions));
  }
}

export function* watchSettingsRobots() {
  yield takeEvery(types.FETCH_ROBOTS, fetchRobotsSaga);
  yield takeEvery(types.FETCH_ROBOT, fetchRobotSaga);
  yield takeEvery(types.DELETE_ROBOT, deleteRobotSaga);
  yield takeEvery(
    [
      types.FETCH_ROBOT_EXECUTIONS,
      types.FETCH_ROBOT_EXECUTIONS_NEXT_PAGE,
      types.FETCH_ROBOT_EXECUTIONS_PREVIOUS_PAGE,
    ],
    fetchRobotExecutionsSaga,
  );
  yield takeEvery(types.FETCH_ROBOT_EXECUTION, fetchRobotExecutionSaga);
  yield takeEvery(types.FETCH_NEXT_EXECUTIONS, fetchNextExecutionsSaga);
}
