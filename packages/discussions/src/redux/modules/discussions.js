import { Record, List, Map } from 'immutable';
import moment from 'moment';
import { commonTypes, Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  // API-based actions.
  JOIN_DISCUSSION: namespace('discussions', 'JOIN_DISCUSSION'),
  ADD_DISCUSSION: namespace('discussions', 'ADD_DISCUSSION'),
  LEAVE_DISCUSSION: namespace('discussions', 'LEAVE_DISCUSSION'),
  SET_ISSUE: namespace('discussions', 'SET_ISSUE'),
  CREATE_ISSUE: namespace('discussion', 'CREATE_ISSUE'),
  CREATE_INVITE: namespace('discussions', 'CREATE_INVITE'),
  CREATE_INVITE_DONE: namespace('discussions', 'CREATE_INVITE_DONE'),
  CREATE_INVITE_ERROR: namespace('discussions', 'CREATE_INVITE_ERROR'),
  ADD_INVITATION: namespace('discussions', 'ADD_INVITATION'),
  SET_INVITES: namespace('discussions', 'SET_INVITES'),
  REMOVE_INVITATION: namespace('discussions', 'REMOVE_INVITATION'),
  RESEND_INVITE: namespace('discussions', 'RESEND_INVITE'),
  FETCH_MORE_MESSAGES: namespace('discussions', 'FETCH_MORE_MESSAGES'),
  SET_MESSAGES: namespace('discussions', 'SET_MESSAGES'),
  SET_MORE_MESSAGES: namespace('discussions', 'SET_MORE_MESSAGES'),
  // SET_HAS_MORE_MESSAGES: namespace('discussions', 'SET_HAS_MORE_MESSAGES'),
  SET_JOIN_ERROR: namespace('discussions', 'SET_JOIN_ERROR'),
  SET_PARTICIPANTS: namespace('discussions', 'SET_PARTICIPANTS'),
  ADD_PRESENCE: namespace('discissons', 'ADD_PRESENCE'),
  REMOVE_PRESENCE: namespace('discissons', 'REMOVE_PRESENCE'),
  ADD_PARTICIPANT: namespace('discussions', 'ADD_PARTICIPANT'),
  REMOVE_PARTICIPANT: namespace('discussions', 'REMOVE_PARTICIPANT'),

  APPLY_UPLOAD: namespace('discussions', 'APPLY_UPLOAD'),
  QUEUE_UPLOADS: namespace('discussions', 'QUEUE_UPLOAD'),

  // Socket-based actions.
  ADD_TOPIC: namespace('discussions', 'ADD_TOPIC'),
  SET_TOPIC_STATUS: namespace('discussions', 'SET_TOPIC_STATUS'),
  UPDATE_PRESENCE: namespace('discussions', 'UPDATE_PRESENCE'),

  ADD_MESSAGE: namespace('discussions', 'ADD_MESSAGE'),
  MESSAGE_UPDATE: namespace('discussions', 'MESSAGE_UPDATE'),
  MESSAGE_DELETE: namespace('discussions', 'MESSAGE_DELETE'),
  SEND_MESSAGE: namespace('discussions', 'SEND_MESSAGE'),
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
  addDiscussion: withPayload(types.ADD_DISCUSSION),

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
  setMessages: withPayload(types.SET_MESSAGES, 'id', 'messages'),
  setMoreMessages: withPayload(
    types.SET_MORE_MESSAGES,
    'id',
    'messages',
    'pageToken',
  ),
  setJoinError: withPayload(types.SET_JOIN_ERROR, 'guid', 'joinError'),
  setParticipants: withPayload(types.SET_PARTICIPANTS, 'id', 'participants'),
  addPresence: withPayload(types.ADD_PRESENCE, 'guid', 'participantGuid'),
  removePresence: withPayload(types.REMOVE_PRESENCE, 'guid', 'participantGuid'),
  addParticipant: withPayload(types.ADD_PARTICIPANT, 'id', 'participant'),
  removeParticipant: withPayload(types.REMOVE_PARTICIPANT, 'id', 'participant'),

  // Invitation API calls
  createInvite: withPayload(
    types.CREATE_INVITE,
    'discussionId',
    'type',
    'value',
  ),
  createInviteDone: noPayload(types.CREATE_INVITE_DONE),
  createInviteError: withPayload(types.CREATE_INVITE_ERROR),

  // Invitation data management.
  setInvites: withPayload(types.SET_INVITES, 'guid', 'invites'),
  addInvitation: withPayload(types.ADD_INVITATION, 'id', 'invitation'),
  removeInvitation: withPayload(types.REMOVE_INVITATION, 'id', 'invitation'),

  applyUpload: withPayload(types.APPLY_UPLOAD, 'guid', 'messageGuid', 'upload'),
  queueUploads: withPayload(types.QUEUE_UPLOADS, 'guid', 'uploads'),

  // Socket-based actions.
  updatePresence: withPayload(types.UPDATE_PRESENCE, 'id', 'presences'),
  addTopic: withPayload(types.ADD_TOPIC),
  setTopicStatus: withPayload(types.SET_TOPIC_STATUS, 'id', 'status'),

  addMessage: withPayload(types.ADD_MESSAGE, 'id', 'message'),
  updateMessage: withPayload(types.MESSAGE_UPDATE, 'id', 'message'),
  deleteMessage: withPayload(types.MESSAGE_DELETE, 'id', 'message'),
  receiveBadMessage: withPayload(types.MESSAGE_BAD_RX, 'guid', 'badMessage'),
  sendMessage: withPayload(types.SEND_MESSAGE, 'id', 'message', 'attachment'),

  // Modal dialog state.
  openModal: withPayload(types.OPEN_MODAL, 'guid', 'modalType'),
  closeModal: withPayload(types.CLOSE_MODAL),
  setInvitationField: withPayload(types.SET_INVITATION_FIELD, 'field', 'value'),

  // Discussion Visibility
  setDiscussionVisibility: withPayload(types.SET_DISCUSSION_VISIBILITY),
  setPageTitleInterval: withPayload(types.SET_PAGE_TITLE_INTERVAL),
};

const Topic = Record({
  topicId: null,
  topicStatus: 'closed',
});

const Messages = Record({
  empty: false,
  items: List(),
  pageToken: null,
  milestone: 0,
});

const newDiscussion = discussion =>
  Discussion({
    ...discussion,
    messages: Messages({
      ...discussion.messages,
      items: List(discussion.messages.items),
    }),
    owningTeams: List(discussion.owningTeams),
    owningUsers: List(discussion.owningUsers),
    participants: List(discussion.participants),
    invitations: List(discussion.invitations),
    relatedItems: List(discussion.relatedItems),
  });

// const KEEP_KEYS = ['topic', 'presences'];
export const Discussion = Record({
  // NEW STUFF
  topic: Topic(),
  presences: List(),
  archived: false,
  createdAt: new Date(),
  createdBy: {},
  description: '',
  id: '',
  invitations: List(),
  isPrivate: false,
  messages: Messages(),
  milestone: 0,
  owningTeams: List(),
  owningUsers: List(),
  participants: List(),
  relatedItems: List(),
  title: '',
  updatedAt: new Date(),
  updateBy: {},
  versionId: '',

  // OLD STUFF
  issue: null,
  // messages: List(),
  badMessages: List(),
  processingUploads: List(),
  messagesLoading: true,
  lastReceived: '2014-01-01',
  loadingMoreMessages: false,
  joinError: '',
  // participants: Map(), this changed from a Map to a List
  invites: List(), // This is changing to 'invitations'
});

export const State = Record({
  discussions: Map(),
  activeDiscussion: null,
  currentOpenModals: List(),
  invitationFields: Map({
    type: 'username',
    value: '',
  }),
  invitationPending: false,
  invitationError: null,
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
  moment(message.createdAt).format('YYYY-MM-DD');
const differentDate = (m1, m2) => getMessageDate(m1) !== getMessageDate(m2);
const differentAuthor = (m1, m2) =>
  m1.createdBy.username !== m2.createdBy.username || m1.type !== m2.type;

const invitationsMatch = (i1, i2) =>
  (i1.user && i2.user && i1.user.username === i2.user.username) ||
  (i1.email && i2.email && i1.email === i2.email);

export const formatMessages = messages =>
  partitionListBy(
    differentDate,
    messages.reverse().filterNot(isSystemMessage),
  ).map(dateList => partitionListBy(differentAuthor, dateList));

// export const selectToken = state => state.discussions.discussions.token;

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.JOIN_DISCUSSION:
      return state.hasIn(['discussions', payload])
        ? state
        : state.setIn(['discussions', payload], Discussion());
    case types.ADD_DISCUSSION:
      return state.updateIn(['discussions', payload.id], discussion =>
        discussion.mergeWith(
          (prev, next, key) =>
            ['topic', 'presences'].includes(key) ? prev : next,
          newDiscussion(payload),
        ),
      );
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
      return state.updateIn(['discussions', payload.id], discussion =>
        discussion
          .set('messagesLoading', false)
          .set('loadingMoreMessages', false)
          .updateIn(['messages', 'items'], items =>
            items.concat(List(payload.messages)),
          )
          .setIn(['messages', 'pageToken'], payload.pageToken),
      );
    case types.SET_JOIN_ERROR:
      return state.setIn(
        ['discussions', payload.guid, 'joinError'],
        payload.joinError,
      );
    case types.SET_PARTICIPANTS:
      return state.setIn(
        ['discussions', payload.id, 'participants'],
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
      return state.updateIn(
        ['discussions', payload.id, 'participants'],
        participants => participants.push(payload.participant),
      );
    case types.REMOVE_PARTICIPANT:
      return state.updateIn(
        ['discussions', payload.id, 'participants'],
        participants =>
          participants.filter(
            participant =>
              participant.user.username !== payload.participant.user.username,
          ),
      );
    case types.SET_INVITES:
      return state.setIn(
        ['discussions', payload.guid, 'invites'],
        List(payload.invites),
      );
    case types.ADD_INVITATION:
      return state.updateIn(
        ['discussions', payload.id, 'invitations'],
        invitations => invitations.push(payload.invitation),
      );
    case types.REMOVE_INVITATION:
      return state.updateIn(
        ['discussions', payload.id, 'invitations'],
        invitations =>
          invitations.delete(
            invitations.findIndex(i => invitationsMatch(i, payload.invitation)),
          ),
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
      return state.updateIn(
        ['discussions', payload.id, 'messages', 'items'],
        items =>
          items.map(
            message =>
              message.id === payload.message.id ? payload.message : message,
          ),
      );
    case types.MESSAGE_DELETE:
      return state.updateIn(
        ['discussions', payload.id, 'messages', 'items'],
        items => items.filter(message => message.id !== payload.message.id),
      );
    case types.ADD_MESSAGE:
      return state.updateIn(
        ['discussions', payload.id, 'messages', 'items'],
        items => items.unshift(payload.message),
      );
    case types.MESSAGE_BAD_RX:
      return state.updateIn(['discussions', payload.guid, 'badMessages'], m =>
        m.push(payload.badMessage),
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
      return state.set('invitationPending', false).set('invitationError', null);
    case types.CREATE_INVITE_ERROR:
      return state
        .set('invitationPending', false)
        .set('invitationError', payload);
    case types.SET_INVITATION_FIELD:
      return state.setIn(['invitationFields', payload.field], payload.value);
    case commonTypes.SET_SIZE:
      return state.delete('currentOpenModals');
    case types.SET_DISCUSSION_VISIBILITY:
      return state.set('isVisible', payload === 'visible' ? true : false);
    case types.SET_PAGE_TITLE_INTERVAL:
      return state.set('pageTitleInterval', payload);

    // NEW STUFF
    case types.UPDATE_PRESENCE:
      return state.updateIn(['discussions', payload.id, 'presences'], () =>
        List(payload.presences),
      );
    case types.SET_TOPIC_STATUS:
      return state.updateIn(['discussions', payload.id], discussion =>
        discussion.setIn(['topic', 'topicStatus'], payload.status),
      );
    default:
      return state;
  }
};
