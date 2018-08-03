import { Record, List, Map } from 'immutable';
import moment from 'moment';
import { commonTypes, Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  // API-based actions.
  JOIN_DISCUSSION: namespace('discussions', 'JOIN_DISCUSSION'),
  LEAVE_DISCUSSION: namespace('discussions', 'LEAVE_DISCUSSION'),
  SET_ISSUE: namespace('discussions', 'SET_ISSUE'),
  CREATE_ISSUE: namespace('discussion', 'CREATE_ISSUE'),
  CREATE_INVITE: namespace('discussions', 'CREATE_INVITE'),
  CREATE_INVITE_DONE: namespace('discussions', 'CREATE_INVITE_DONE'),
  ADD_INVITE: namespace('discussions', 'ADD_INVITE'),
  SET_INVITES: namespace('discussions', 'SET_INVITES'),
  REMOVE_INVITE: namespace('discussions', 'REMOVE_INVITE'),
  RESEND_INVITE: namespace('discussions', 'RESEND_INVITE'),
  FETCH_MORE_MESSAGES: namespace('discussions', 'FETCH_MORE_MESSAGES'),
  SET_MESSAGES: namespace('discussions', 'SET_MESSAGES'),
  SET_MORE_MESSAGES: namespace('discussions', 'SET_MORE_MESSAGES'),
  SET_HAS_MORE_MESSAGES: namespace('discussions', 'SET_HAS_MORE_MESSAGES'),
  SET_JOIN_ERROR: namespace('discussions', 'SET_JOIN_ERROR'),
  SET_PARTICIPANTS: namespace('discussions', 'SET_PARTICIPANTS'),
  ADD_PRESENCE: namespace('discissons', 'ADD_PRESENCE'),
  REMOVE_PRESENCE: namespace('discissons', 'REMOVE_PRESENCE'),
  ADD_PARTICIPANT: namespace('discussions', 'ADD_PARTICIPANT'),
  REMOVE_PARTICIPANT: namespace('discussions', 'REMOVE_PARTICIPANT'),

  APPLY_UPLOAD: namespace('discussions', 'APPLY_UPLOAD'),
  QUEUE_UPLOADS: namespace('discussions', 'QUEUE_UPLOAD'),

  // Socket-based actions.
  CONNECT: namespace('discussions', 'CONNECT'),
  DISCONNECT: namespace('discussions', 'DISCONNECT'),
  RECONNECT: namespace('discussions', 'RECONNECT'),
  SET_CONNECTED: namespace('discussions', 'SET_CONNECTED'),
  MESSAGE_RX: namespace('discussions', 'MESSAGE_RX'),
  MESSAGE_UPDATE: namespace('discussions', 'MESSAGE_UPDATE'),
  MESSAGE_TX: namespace('discussions', 'MESSAGE_TX'),
  MESSAGE_BAD_RX: namespace('discussions', 'MESSAGE_BAD_RX'),

  // Modal dialog state.
  OPEN_MODAL: namespace('discussions', 'OPEN_MODAL'),
  CLOSE_MODAL: namespace('discussions', 'CLOSE_MODAL'),
  SET_INVITATION_FIELD: namespace('discussions', 'SET_INVITATION_FIELD'),

  // Discussion Visibility
  SET_DISCUSSION_VISIBILITY: namespace(
    'discussions',
    'SET_DISCUSSION_VISIBILITY',
  ),
  SET_PAGE_TITLE_INTERVAL: namespace('discussions', 'SET_PAGE_TITLE_INTERVAL'),
};

export const actions = {
  joinDiscussion: withPayload(types.JOIN_DISCUSSION),
  leaveDiscussion: withPayload(types.LEAVE_DISCUSSION),
  // API-bsased actions.
  setIssue: withPayload(types.SET_ISSUE),
  createIssue: (
    name,
    description = '',
    submission,
    include,
    onSuccess,
    datastore = false,
  ) => ({
    type: types.CREATE_ISSUE,
    payload: { name, description, submission, include, onSuccess, datastore },
  }),
  fetchMoreMessages: withPayload(types.FETCH_MORE_MESSAGES),
  setMessages: withPayload(types.SET_MESSAGES, 'guid', 'messages'),
  setMoreMessages: withPayload(types.SET_MORE_MESSAGES, 'guid', 'messages'),
  setHasMoreMessages: withPayload(types.SET_HAS_MORE_MESSAGES, 'guid', 'more'),
  setJoinError: withPayload(types.SET_JOIN_ERROR, 'guid', 'joinError'),
  setParticipants: withPayload(types.SET_PARTICIPANTS, 'guid', 'participants'),
  addPresence: withPayload(types.ADD_PRESENCE, 'guid', 'participantGuid'),
  removePresence: withPayload(types.REMOVE_PRESENCE, 'guid', 'participantGuid'),
  addParticipant: withPayload(types.ADD_PARTICIPANT, 'guid', 'participant'),
  removeParticipant: withPayload(
    types.REMOVE_PARTICIPANT,
    'guid',
    'participant',
  ),

  // Invitation API calls
  createInvite: withPayload(types.CREATE_INVITE, 'guid', 'email', 'note'),
  createInviteDone: noPayload(types.CREATE_INVITE_DONE),

  // Invitation data management.
  setInvites: withPayload(types.SET_INVITES, 'guid', 'invites'),
  addInvite: withPayload(types.ADD_INVITE, 'guid', 'invite'),
  removeInvite: withPayload(types.REMOVE_INVITE, 'guid', 'invite'),

  applyUpload: withPayload(types.APPLY_UPLOAD, 'guid', 'messageGuid', 'upload'),
  queueUploads: withPayload(types.QUEUE_UPLOADS, 'guid', 'uploads'),

  // Socket-based actions.
  startConnection: withPayload(types.CONNECT),
  stopConnection: withPayload(types.DISCONNECT),
  reconnect: withPayload(types.RECONNECT),
  setConnected: withPayload(types.SET_CONNECTED, 'guid', 'connected'),
  receiveMessage: withPayload(types.MESSAGE_RX, 'guid', 'message'),
  updateMessage: withPayload(types.MESSAGE_UPDATE, 'guid', 'message'),
  receiveBadMessage: withPayload(types.MESSAGE_BAD_RX, 'guid', 'badMessage'),
  sendMessage: withPayload(types.MESSAGE_TX, 'guid', 'message', 'attachment'),

  // Modal dialog state.
  openModal: withPayload(types.OPEN_MODAL, 'guid', 'modalType'),
  closeModal: withPayload(types.CLOSE_MODAL),
  setInvitationField: withPayload(types.SET_INVITATION_FIELD, 'field', 'value'),

  // Discussion Visibility
  setDiscussionVisibility: withPayload(types.SET_DISCUSSION_VISIBILITY),
  setPageTitleInterval: withPayload(types.SET_PAGE_TITLE_INTERVAL),
};

export const Discussion = Record({
  issue: null,
  messages: List(),
  badMessages: List(),
  processingUploads: List(),
  messagesLoading: true,
  lastReceived: '2014-01-01',
  hasMoreMessages: true,
  loadingMoreMessages: false,
  joinError: '',
  connected: false,
  reconnecting: false,
  participants: Map(),
  invites: List(),
});

export const State = Record({
  discussions: Map(),
  activeDiscussion: null,
  currentOpenModals: List(),
  invitationFields: Map({}),
  invitationPending: false,
  isVisible: true,
  pageTitleInterval: null,
});

// Applies fn to each value in list, splitting it into a new list each time fn
// returns a different value.
export const partitionListBy = (fn, list) =>
  list.isEmpty()
    ? List()
    : list
        .rest()
        .reduce(
          (reduction, current) =>
            fn(reduction.last().last(), current)
              ? reduction.push(List([current]))
              : reduction.update(reduction.size - 1, list =>
                  list.push(current),
                ),
          List([List([list.first()])]),
        );

const isSystemMessage = message => {
  let isSystemMessage = message.type === 'SystemMessage';
  if (
    isSystemMessage &&
    message.messageable_type === 'Upload' &&
    message.messageable.status !== 'Deleted'
  ) {
    isSystemMessage = false;
  }
  return isSystemMessage;
};

const getMessageDate = message =>
  moment(message.created_at).format('YYYY-MM-DD');
const differentDate = (m1, m2) => getMessageDate(m1) !== getMessageDate(m2);
const differentAuthor = (m1, m2) => m1.user.email !== m2.user.email;

export const formatMessages = messages =>
  partitionListBy(
    differentDate,
    messages.reverse().filterNot(isSystemMessage),
  ).map(dateList => partitionListBy(differentAuthor, dateList));

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.JOIN_DISCUSSION:
      return state.setIn(['discussions', payload], Discussion());
    case types.LEAVE_DISCUSSION:
      return state.update('discussions', map => map.delete(payload));
    case types.FETCH_MORE_MESSAGES:
      return state.setIn(['discussions', payload, 'loadingMoreMessages'], true);
    case types.SET_ISSUE:
      return state.updateIn(['discussions', payload.guid], discussion =>
        discussion.set('issue', payload),
      );
    case types.SET_MESSAGES:
      return state.updateIn(['discussions', payload.guid], discussion =>
        discussion
          .set('messagesLoading', false)
          .set('messages', List(payload.messages)),
      );
    case types.SET_MORE_MESSAGES:
      return state.updateIn(['discussions', payload.guid], discussion =>
        discussion
          .set('messagesLoading', false)
          .set('loadingMoreMessages', false)
          .update('messages', list => list.concat(payload.messages)),
      );
    case types.SET_HAS_MORE_MESSAGES:
      return state.setIn(
        ['discussions', payload.guid, 'hasMoreMessages'],
        payload.more,
      );
    case types.SET_JOIN_ERROR:
      return state.setIn(
        ['discussions', payload.guid, 'joinError'],
        payload.joinError,
      );
    case types.SET_PARTICIPANTS:
      return state.setIn(
        ['discussions', payload.guid, 'participants'],
        List(payload.participants).reduce(
          (reduction, participant) =>
            reduction.set(participant.id, participant),
          Map(),
        ),
      );
    case types.ADD_PRESENCE: {
      const participant = state
        .getIn(['discussions', payload.guid, 'participants'])
        .find(p => p.guid === payload.participantGuid);
      return participant
        ? state.updateIn(
            ['discussions', payload.guid, 'participants', participant.id],
            p => ({ ...p, present: true }),
          )
        : state;
    }
    case types.REMOVE_PRESENCE: {
      const participant = state
        .getIn(['discussions', payload.guid, 'participants'])
        .find(p => p.guid === payload.participantGuid);
      return participant
        ? state.updateIn(
            ['discussions', payload.guid, 'participants', participant.id],
            p => ({ ...p, present: false }),
          )
        : state;
    }
    case types.ADD_PARTICIPANT:
      return state.setIn(
        ['discussions', payload.guid, 'participants', payload.participant.id],
        payload.participant,
      );
    case types.REMOVE_PARTICIPANT:
      return state.deleteIn([
        'discussions',
        payload.guid,
        'participants',
        payload.participant.id,
      ]);
    case types.SET_INVITES:
      return state.setIn(
        ['discussions', payload.guid, 'invites'],
        List(payload.invites),
      );
    case types.ADD_INVITE:
      return state.updateIn(['discussions', payload.guid, 'invites'], invites =>
        invites.push(payload.invite),
      );
    case types.REMOVE_INVITE:
      return state.updateIn(['discussions', payload.guid, 'invites'], invites =>
        invites.delete(invites.findIndex(i => i.id === payload.invite.id)),
      );
    case types.APPLY_UPLOAD:
      return state
        .updateIn(['discussions', payload.guid, 'processingUploads'], up =>
          up.filterNot(item => item.guid === payload.messageGuid),
        )
        .updateIn(['discussions', payload.guid, 'messages'], messages =>
          messages.update(
            messages.findIndex(message => message.guid === payload.messageGuid),
            message => ({ ...message, messageable: payload.upload }),
          ),
        );
    case types.QUEUE_UPLOADS:
      return state.updateIn(
        ['discussions', payload.guid, 'processingUploads'],
        uploads => uploads.concat(payload.uploads),
      );
    case types.MESSAGE_UPDATE:
      return state;
    case types.MESSAGE_RX:
      return state.updateIn(
        ['discussions', payload.guid, 'messages'],
        messages => messages.unshift(payload.message),
      );
    case types.MESSAGE_BAD_RX:
      return state.updateIn(['discussions', payload.guid, 'badMessages'], m =>
        m.push(payload.badMessage),
      );
    case types.RECONNECT:
      return state.updateIn(['discussions', payload], discussion =>
        discussion.set('reconnecting', true).set('connected', false),
      );
    case types.SET_CONNECTED:
      return state.setIn(
        ['discussions', payload.guid, 'connected'],
        payload.connected,
      );
    case types.OPEN_MODAL:
      return state
        .set('activeDiscussion', payload.guid)
        .update('currentOpenModals', list => list.push(payload.modalType));
    case types.CLOSE_MODAL:
      return payload
        ? state.update('currentOpenModals', list =>
            list.filter(item => item !== payload),
          )
        : state.delete('currentOpenModals');
    case types.CREATE_INVITE:
      return state.set('invitationPending', true);
    case types.CREATE_INVITE_DONE:
      return state.set('invitationPending', false);
    case types.SET_INVITATION_FIELD:
      return state.setIn(['invitationFields', payload.field], payload.value);
    case commonTypes.SET_SIZE:
      return state.delete('currentOpenModals');
    case types.SET_DISCUSSION_VISIBILITY:
      return state.set('isVisible', payload === 'visible' ? true : false);
    case types.SET_PAGE_TITLE_INTERVAL:
      return state.set('pageTitleInterval', payload);
    default:
      return state;
  }
};
