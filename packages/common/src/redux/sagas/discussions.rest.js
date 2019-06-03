import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
  types as panelTypes,
  actions as panelActions,
} from '../modules/discussionsPanel';
import { types as detailsTypes } from '../modules/discussionsDetails';
import { types } from '../modules/discussions';
import {
  fetchDiscussions,
  createDiscussion,
  sendInvites,
  updateDiscussion,
  resendInvite,
  removeInvite,
  removeParticipant,
  updateParticipant,
  createDiscussionList,
  createRelatedItem,
  sortByLastMessageAt,
} from '@kineticdata/react';

export function* fetchRelatedDiscussionsRequestTask(action) {
  const { type, key, loadCallback } = action.payload;
  const data = {
    relatedItem: {
      type: type,
      key: key,
    },
    limit: 1000,
  };

  const [discussions, archivedDiscussions] = yield all([
    call(fetchDiscussions, data),
    call(fetchDiscussions, {
      ...data,
      isArchived: true,
    }),
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

  const discussionsList = createDiscussionList(combinedDiscussions).sort(
    sortByLastMessageAt,
  );

  yield put(panelActions.fetchRelatedDiscussionsSuccess(discussionsList));

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
  const { discussion, error } = yield call(createDiscussion, {
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
      const result = yield call(createRelatedItem, discussion.id, relatedItem);

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
    updateDiscussion,
    id,
    action.payload.discussion,
  );

  if (error) {
    yield put({
      type: detailsTypes.SAVE_ERROR,
      payload: {
        id,
        message: error.response.status === 400 && error.response.data.error,
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
    sendInvites,
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

  const { error } = yield call(resendInvite, {
    discussionId: id,
    username: invitation.user && invitation.user.username,
    email: invitation.email,
  });

  yield put({
    type: error ? detailsTypes.REINVITE_ERROR : detailsTypes.REINVITE_SUCCESS,
    payload: { id, invitation },
  });
}

export function* uninviteTask(action) {
  const id = action.payload.id;
  const invitation = action.payload.invitation;

  const { error } = yield call(removeInvite, {
    discussionId: id,
    username: invitation.user && invitation.user.username,
    email: invitation.email,
  });

  yield put({
    type: error ? detailsTypes.UNINVITE_ERROR : detailsTypes.UNINVITE_SUCCESS,
    payload: { id, invitation },
  });
}

export function* removeTask(action) {
  const { id, participant } = action.payload;
  const { error } = yield call(removeParticipant, id, participant.username);
  yield put({
    type: error ? detailsTypes.REMOVE_ERROR : detailsTypes.REMOVE_SUCCESS,
    payload: { id, participant },
  });
}

export function* leaveTask(action) {
  const { id, username, onLeave } = action.payload;
  const { error } = yield call(removeParticipant, id, username);
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
  const { error } = yield call(updateParticipant, id, username, {
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
    takeEvery(
      panelTypes.FETCH_RELATED_DISCUSSIONS_REQUEST,
      fetchRelatedDiscussionsRequestTask,
    ),
    takeEvery(detailsTypes.SAVE, saveDiscussionTask),
    takeEvery(detailsTypes.INVITE, inviteTask),
    takeEvery(detailsTypes.REINVITE, reinviteTask),
    takeEvery(detailsTypes.UNINVITE_CONFIRM, uninviteTask),
    takeEvery(detailsTypes.REMOVE_CONFIRM, removeTask),
    takeEvery(detailsTypes.LEAVE_CONFIRM, leaveTask),
    takeEvery(detailsTypes.MUTE, muteTask),
  ]);
}
