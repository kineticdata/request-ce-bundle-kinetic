import { call, put, takeEvery, select } from 'redux-saga/effects';
import { fetchForms } from '@kineticdata/react';
import { actions, types } from '../modules/forms';
import * as constants from '../../constants';

const buildQuery = (options = {}) => {
  let q = '';
  if (options.status) {
    if (Array.isArray(options.status)) {
      q += `status IN (${options.status.map(o => `"${o}"`).join(',')})`;
    } else {
      q += `status = "${options.status}"`;
    }
  } else {
    q += `status = "${constants.SUBMISSION_FORM_STATUS}"`;
  }
  q += ' AND ';
  if (options.type) {
    if (Array.isArray(options.type)) {
      q += `type IN (${options.type.map(o => `"${o}"`).join(',')})`;
    } else {
      q += `type = "${options.type}"`;
    }
  } else {
    q += `type = "${constants.SUBMISSION_FORM_TYPE}"`;
  }
  if (options.category) {
    q += ' AND ';
    if (Array.isArray(options.category)) {
      q += `category IN (${options.category.map(o => `"${o}"`).join(',')})`;
    } else {
      q += `category = "${options.category}"`;
    }
  }
  if (options.name) {
    q += ' AND ';
    if (Array.isArray(options.name)) {
      q += `name IN (${options.name.map(o => `"${o}"`).join(',')})`;
    } else {
      q += `name = "${options.name}"`;
    }
  } else if (options.query) {
    q += ` AND name =* "${options.query}"`;
  }
  return q;
};

export function* fetchFormsRequestSaga({ payload }) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const { limit, pageToken } = yield select(state => state.forms);
  const { forms, nextPageToken, error } = yield call(fetchForms, {
    kappSlug,
    include: 'details,categorizations,attributes,kapp',
    q: buildQuery(payload),
    limit,
    pageToken,
  });

  if (error) {
    yield put(actions.fetchFormsFailure(error));
  } else {
    yield put(actions.fetchFormsSuccess({ forms, nextPageToken }));
  }

  // TODO add recording of search history
}

export function* watchForms() {
  yield takeEvery(
    [
      types.FETCH_FORMS_REQUEST,
      types.FETCH_FORMS_NEXT,
      types.FETCH_FORMS_PREVIOUS,
    ],
    fetchFormsRequestSaga,
  );
}
