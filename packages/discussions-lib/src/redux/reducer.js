import { Map, List } from 'immutable/dist/immutable';
import { actionTypes, withPayload } from './helpers';
import { createDiscussion, Discussion } from './models';
import { types } from '../../../discussions/src/index';

// prettier-ignore
export const JOIN_DISCUSSION = 'JOIN_DISCUSSION'
export const ADD_DISCUSSION = 'ADD_DISCUSSION';
export const LEAVE_DISCUSSION = 'LEAVE_DISCUSSION';
export const UPDATE_DISCUSSION = 'UPDATE_DISCUSSION';
export const ADD_INVITATION = 'ADD_INVITATION';
export const REMOVE_INVITATION = 'REMOVE_INVITATION';
export const UPDATE_INVITATION = 'UPDATE_INVITATION';
export const FETCH_MORE_MESSAGES = 'FETCH_MORE_MESSAGES';
export const SET_MORE_MESSAGES = 'SET_MORE_MESSAGES';
export const ADD_PARTICIPANT = 'ADD_PARTICIPANT';
export const REMOVE_PARTICIPANT = 'REMOVE_PARTICIPANT';
export const UPDATE_PARTICIPANT = 'UPDATE_PARTICIPANT';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const MESSAGE_UPDATE = 'MESSAGE_UPDATE';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_UPDATE = 'SEND_MESSAGE_UPDATE';
export const SET_TOPIC_STATUS = 'SET_TOPIC_STATUS';
export const UPDATE_PRESENCE = 'UPDATE_PRESENCE';
export const SET_DISCUSSION_ERROR = 'SET_DISCUSSION_ERROR';
export const UNSUBSCRIBED = 'UNSUBSCRIBED';

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
  unsubscribed: withPayload(UNSUBSCRIBED, 'id'),
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
    case SET_DISCUSSION_ERROR:
      return state.setIn(['discussions', payload.id, 'error'], payload.error);
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
    case UNSUBSCRIBED:
      return state.setIn(['discussions', payload.id, 'error'], 'Unsubscribed');
    default:
      return state;
  }
}
