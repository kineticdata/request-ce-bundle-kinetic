import { Record } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/submission');

export const types = {
  FETCH_SUBMISSION_REQUEST: ns('FETCH_SUBMISSION_REQUEST'),
  FETCH_SUBMISSION_SUCCESS: ns('FETCH_SUBMISSION_SUCCESS'),
  FETCH_SUBMISSION_FAILURE: ns('FETCH_SUBMISSION_FAILURE'),
  CLEAR_SUBMISSION_REQUEST: ns('CLEAR_SUBMISSION_REQUEST'),
  CLONE_SUBMISSION_REQUEST: ns('CLONE_SUBMISSION_REQUEST'),
  DELETE_SUBMISSION_REQUEST: ns('DELETE_SUBMISSION_REQUEST'),
  START_SUBMISSION_POLLER: ns('START_SUBMISSION_POLLER'),
  STOP_SUBMISSION_POLLER: ns('STOP_SUBMISSION_POLLER'),
  FETCH_DISCUSSION_REQUEST: ns('FETCH_DISCUSSION_REQUEST'),
  FETCH_DISCUSSION_SUCCESS: ns('FETCH_DISCUSSION_SUCCESS'),
  SET_SEND_MESSAGE_MODAL_OPEN: ns('SET_SEND_MESSAGE_MODAL_OPEN'),
  SEND_MESSAGE_REQUEST: ns('SEND_MESSAGE_REQUEST'),
};

export const actions = {
  fetchSubmissionRequest: withPayload(types.FETCH_SUBMISSION_REQUEST),
  fetchSubmissionSuccess: withPayload(types.FETCH_SUBMISSION_SUCCESS),
  fetchSubmissionFailure: withPayload(types.FETCH_SUBMISSION_FAILURE),
  clearSubmissionRequest: noPayload(types.CLEAR_SUBMISSION_REQUEST),
  cloneSubmissionRequest: withPayload(types.CLONE_SUBMISSION_REQUEST),
  deleteSubmissionRequest: withPayload(types.DELETE_SUBMISSION_REQUEST),
  startSubmissionPoller: withPayload(types.START_SUBMISSION_POLLER),
  stopSubmissionPoller: noPayload(types.STOP_SUBMISSION_POLLER),
  fetchDiscussionRequest: withPayload(types.FETCH_DISCUSSION_REQUEST),
  fetchDiscussionSuccess: withPayload(types.FETCH_DISCUSSION_SUCCESS),
  setSendMessageModalOpen: withPayload(types.SET_SEND_MESSAGE_MODAL_OPEN),
  sendMessageRequest: withPayload(types.SEND_MESSAGE_REQUEST),
};

export const State = Record({
  error: null,
  data: null,
  discussion: null,
  isSendMessageModalOpen: false,
  sendMessageType: 'comment',
});

const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_SUBMISSION_REQUEST:
      return state.set('error', null);
    case types.FETCH_SUBMISSION_SUCCESS:
      return state.set('data', payload);
    case types.FETCH_SUBMISSION_FAILURE:
      return state.set('error', payload);
    case types.CLEAR_SUBMISSION_REQUEST:
      return State();
    case types.FETCH_DISCUSSION_SUCCESS:
      return state.set('discussion', payload);
    case types.SET_SEND_MESSAGE_MODAL_OPEN:
      return state
        .set('isSendMessageModalOpen', payload.isOpen)
        .set('sendMessageType', payload.type || 'comment');
    default:
      return state;
  }
};

export default reducer;
