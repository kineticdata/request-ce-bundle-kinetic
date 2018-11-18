import { all, call, select, put, takeEvery } from 'redux-saga/effects';
import {
  types as listTypes,
  actions as listActions,
} from '../modules/discussionsList';
import { types } from '../modules/discussions';
import { DiscussionAPI, createDiscussionList } from 'discussions-lib';

export function* fetchRelatedDiscussionsTask(action) {
  const isArchived = yield select(
    state => state.discussions.discussionsList.searchArchived,
  );
  const { type, key, loadCallback } = action.payload;

  const { discussions } = yield call(DiscussionAPI.fetchDiscussions, {
    relatedItem: {
      type: type,
      key: key,
    },
    isArchived,
  });

  const discussionsList = createDiscussionList(discussions);
  yield put(listActions.setRelatedDiscussions(discussionsList));

  if (typeof loadCallback === 'function') {
    yield call(loadCallback, discussionsList);
  }
}

export function* createDiscussionTask({ payload }) {
  const {
    title,
    description,
    isPrivate,
    relatedItem,
    owningUsers,
    owningTeams,
    onSuccess,
  } = payload;
  const { discussion, error } = yield call(DiscussionAPI.createDiscussion, {
    title,
    description,
    isPrivate,
    owningUsers,
    owningTeams,
  });

  if (error) {
    // yield a toast
  } else {
    let error;
    let createdRealtedItem;
    // In a successful scenario we should toast a success, join the discussion
    // and if a submission was passed we should update its "Discussion Id" value.
    if (relatedItem) {
      const result = yield call(
        DiscussionAPI.createRelatedItem,
        discussion.id,
        relatedItem,
      );

      createdRealtedItem = result.relatedItem;
    }

    if (!error && typeof onSuccess === 'function') {
      onSuccess(discussion, createdRealtedItem);
    }
  }
}

export function* watchDiscussionRest() {
  yield all([
    takeEvery(types.CREATE_DISCUSSION, createDiscussionTask),
    takeEvery(listTypes.FETCH_RELATED_DISCUSSIONS, fetchRelatedDiscussionsTask),
  ]);
}
