import { Map, List } from 'immutable/dist/immutable';
import { actionTypes, withPayload } from './helpers';
import { createDiscussion, Discussion } from './models';
import { types } from '../../../discussions/src/index';

// prettier-ignore
export const {
  JOIN_DISCUSSION, ADD_DISCUSSION, LEAVE_DISCUSSION, UPDATE_DISCUSSION, ADD_INVITATION,
  REMOVE_INVITATION, UPDATE_INVITATION, FETCH_MORE_MESSAGES, SET_MORE_MESSAGES,
  ADD_PARTICIPANT, REMOVE_PARTICIPANT, UPDATE_PARTICIPANT, ADD_MESSAGE, REMOVE_MESSAGE,
  MESSAGE_UPDATE, SEND_MESSAGE, SEND_MESSAGE_UPDATE, SET_TOPIC_STATUS, UPDATE_PRESENCE,
} = actionTypes('');

export const actions = {
  setTopicStatus: withPayload(SET_TOPIC_STATUS, 'id', 'status'),
  updatePresence: withPayload(UPDATE_PRESENCE, 'id', 'presences'),
  updateDiscussion: withPayload(UPDATE_DISCUSSION),
  addMessage: withPayload(ADD_MESSAGE, 'id', 'message'),
  updateMessage: withPayload(MESSAGE_UPDATE, 'id', 'message'),
  removeMessage: withPayload(REMOVE_MESSAGE, 'id', 'message'),
  addParticipant: withPayload(ADD_PARTICIPANT, 'id', 'participant'),
  removeParticipant: withPayload(REMOVE_PARTICIPANT, 'id', 'participant'),
  updateParticipant: withPayload(UPDATE_PARTICIPANT, 'id', 'participant'),
  addInvitation: withPayload(ADD_INVITATION, 'id', 'invitation'),
  removeInvitation: withPayload(REMOVE_INVITATION, 'id', 'invitation'),
  updateInvitation: withPayload(UPDATE_INVITATION, 'id', 'invitation'),
  setMoreMessages: withPayload(
    SET_MORE_MESSAGES,
    'id',
    'messages',
    'nextPageToken',
  ),
  sendMessage: withPayload(
    SEND_MESSAGE,
    'id',
    'message',
    'attachment',
    'parentId',
  ),
  sendMessageUpdate: withPayload(
    SEND_MESSAGE_UPDATE,
    'discussionId',
    'id',
    'message',
    'attachment',
  ),
};

const invitationsMatch = (i1, i2) =>
  (i1.user && i2.user && i1.user.username === i2.user.username) ||
  (i1.email && i2.email && i1.email === i2.email);

export default function(state = Map(), { type, payload }) {
  switch (type) {
    case JOIN_DISCUSSION:
      return state.hasIn(['discussions', payload.id])
        ? state
        : state.setIn(['discussions', payload.id], Discussion());
    case ADD_DISCUSSION:
    case UPDATE_DISCUSSION:
      return state.updateIn(['discussions', payload.id], discussion =>
        discussion.mergeWith(
          (prev, next, key) =>
            ['topic', 'presences'].includes(key) ||
            (type === UPDATE_DISCUSSION &&
              (key === 'messages' || key === 'nextPageToken'))
              ? prev
              : next,
          createDiscussion(payload),
        ),
      );
    case LEAVE_DISCUSSION:
      return state.update('discussions', map => map.delete(payload));
    case FETCH_MORE_MESSAGES:
      return state.setIn(['discussions', payload, 'loadingMoreMessages'], true);
    case SET_MORE_MESSAGES:
      return state.updateIn(['discussions', payload.id], discussion =>
        discussion
          .set('messagesLoading', false)
          .set('loadingMoreMessages', false)
          .update('messages', messages =>
            messages.concat(List(payload.messages)),
          )
          .set('nextPageToken', payload.nextPageToken),
      );

    case ADD_PARTICIPANT:
      return state.updateIn(
        ['discussions', payload.id, 'participants'],
        participants => participants.push(payload.participant),
      );
    case REMOVE_PARTICIPANT:
      return state.updateIn(
        ['discussions', payload.id, 'participants'],
        participants =>
          participants.filter(
            participant =>
              participant.user.username !== payload.participant.user.username,
          ),
      );
    case UPDATE_PARTICIPANT:
      return state.updateIn(
        ['discussions', payload.id, 'participants'],
        participants =>
          participants.map(
            participant =>
              participant.user.username === payload.participant.user.username
                ? payload.participant
                : participant,
          ),
      );
    case ADD_INVITATION:
      return state.updateIn(
        ['discussions', payload.id, 'invitations'],
        invitations => invitations.push(payload.invitation),
      );
    case REMOVE_INVITATION:
      return state.updateIn(
        ['discussions', payload.id, 'invitations'],
        invitations =>
          invitations.delete(
            invitations.findIndex(i => invitationsMatch(i, payload.invitation)),
          ),
      );
    case UPDATE_INVITATION:
      return state.updateIn(
        ['discussions', payload.id, 'invitations'],
        invitations =>
          invitations.map(
            invitation =>
              invitationsMatch(invitation, payload.invitation)
                ? payload.invitation
                : invitation,
          ),
      );
    case MESSAGE_UPDATE:
      return state.updateIn(['discussions', payload.id, 'messages'], messages =>
        // If the update is for a message we have, update it.
        messages
          .map(
            message =>
              message.id === payload.message.id ? payload.message : message,
          )
          // If the update is for a parent of a message we have, update the parent.
          .map(message => {
            if (message.parent && message.parent.id === payload.message.id) {
              message.parent = payload.message;
            }
            return message;
          }),
      );
    case REMOVE_MESSAGE:
      return state.updateIn(['discussions', payload.id, 'messages'], messages =>
        messages.filter(message => message.id !== payload.message.id),
      );
    case ADD_MESSAGE:
      return state.updateIn(['discussions', payload.id, 'messages'], messages =>
        messages.unshift(payload.message),
      );

    // NEW STUFF
    case UPDATE_PRESENCE:
      return state.updateIn(['discussions', payload.id, 'presences'], () =>
        List(payload.presences),
      );
    case SET_TOPIC_STATUS:
      return state.updateIn(['discussions', payload.id], discussion =>
        discussion.setIn(['topic', 'topicStatus'], payload.status),
      );
    default:
      return state;
  }
}
