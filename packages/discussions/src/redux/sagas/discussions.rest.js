import { all, call, select, put, takeEvery } from 'redux-saga/effects';
import {
  types as listTypes,
  actions as listActions,
} from '../modules/discussionsList';
import { types as detailsTypes } from '../modules/discussionsDetails';
import { types } from '../modules/discussions';
import { DiscussionAPI, createDiscussionList } from 'discussions-lib';

export function* fetchRelatedDiscussionsTask(action) {
  const { type, key, loadCallback } = action.payload;
  const data = {
    relatedItem: {
      type: type,
      key: key,
    },
  };

  const [discussions, archivedDiscussions] = yield all([
    call(DiscussionAPI.fetchDiscussions, data),
    call(DiscussionAPI.fetchDiscussions, { ...data, isArchived: true }),
  ]);

  const combinedDiscussions = []
    .concat(
      discussions && discussions.discussions ? discussions.discussions : [],
    )
    .concat(
      archivedDiscussions && archivedDiscussions.discussions
        ? archivedDiscussions.discussions
        : [],
    );

  const discussionsList = createDiscussionList(combinedDiscussions);
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

export function* saveDiscussionTask(action) {
  const id = action.payload.id;
  const { discussion, error } = yield call(
    DiscussionAPI.updateDiscussion,
    id,
    action.payload.discussion,
  );

  if (error) {
    yield put({
      type: detailsTypes.SAVE_ERROR,
      payload: {
        id,
        message: error.response.status === 400 && error.response.data.message,
      },
    });
  }
  if (discussion) {
    yield put({ type: detailsTypes.SAVE_SUCCESS, payload: { id } });
  }
}

export function* inviteTask(action) {
  const id = action.payload.id;
  const results = yield call(
    DiscussionAPI.sendInvites,
    action.payload.discussion,
    action.payload.values,
  );
  const failedInvites = results
    .filter(result => result.error)
    .map(result => result.error.config.data)
    .map(JSON.parse)
    .map(invite => (invite.user ? invite.user.username : invite.email));
  if (failedInvites.length === 0) {
    yield put({ type: detailsTypes.INVITE_SUCCESS, payload: { id } });
  } else {
    yield put({
      type: detailsTypes.INVITE_ERROR,
      payload: { id, message: failedInvites },
    });
  }
}

export function* reinviteTask(action) {
  const id = action.payload.id;
  const invitation = action.payload.invitation;

  const { error } = yield call(DiscussionAPI.resendInvite, {
    discussionId: id,
    username: invitation.user && invitation.user.username,
    email: invitation.email,
  });

  yield put({
    type: error ? detailsTypes.REINVITE_ERROR : detailsTypes.REINVITE_SUCCESS,
    payload: { id, invitation },
  });
}

export function* leaveTask(action) {
  const { id, username, onLeave } = action.payload;
  const { error } = yield call(DiscussionAPI.removeParticipant, id, username);
  if (error) {
    yield put({ type: detailsTypes.LEAVE_ERROR, payload: { id } });
  } else {
    if (typeof onLeave === 'function') {
      onLeave();
    }
  }
}

export function* muteTask(action) {
  const { id, username, isMuted } = action.payload;
  const { error } = yield call(DiscussionAPI.updateParticipant, id, username, {
    isMuted,
  });
  if (error) {
    yield put({ type: detailsTypes.MUTE_ERROR, payload: { id } });
  } else {
    yield put({ type: detailsTypes.MUTE_SUCCESS, payload: { id, isMuted } });
  }
}

export function* watchDiscussionRest() {
  yield all([
    takeEvery(types.CREATE_DISCUSSION, createDiscussionTask),
    takeEvery(listTypes.FETCH_RELATED_DISCUSSIONS, fetchRelatedDiscussionsTask),
    takeEvery(detailsTypes.SAVE, saveDiscussionTask),
    takeEvery(detailsTypes.INVITE, inviteTask),
    takeEvery(detailsTypes.REINVITE, reinviteTask),
    takeEvery(detailsTypes.LEAVE_CONFIRM, leaveTask),
    takeEvery(detailsTypes.MUTE, muteTask),
  ]);
}
