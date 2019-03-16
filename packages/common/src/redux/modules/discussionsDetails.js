import { List, Map } from 'immutable';
import { namespace } from '../../utils';

const invitationType = invitation => (invitation.user ? 'user' : 'email');
const invitationKey = invitation =>
  invitation.user ? invitation.user.username : invitation.email;

export const types = {
  OPEN: namespace('discussionsDetails', 'OPEN'),
  CLOSE: namespace('discussionsDetails', 'CLOSE'),
  SHOW: namespace('discussionsDetails', 'SHOW'),
  OPEN_HISTORY: namespace('discussionsDetails', 'OPEN_HISTORY'),
  LEAVE: namespace('discussionsDetails', 'LEAVE'),
  LEAVE_CONFIRM: namespace('discussionsDetails', 'LEAVE_CONFIRM'),
  LEAVE_CANCEL: namespace('discussionsDetails', 'LEAVE_CANCEL'),
  LEAVE_SUCCESS: namespace('discussionsDetails', 'LEAVE_SUCCESS'),
  LEAVE_ERROR: namespace('discussionsDetails', 'LEAVE_ERROR'),
  MUTE: namespace('discussionsDetails', 'MUTE'),
  MUTE_SUCCESS: namespace('discussionsDetails', 'MUTE_SUCCESS'),
  MUTE_ERROR: namespace('discussionsDetails', 'MUTE_ERROR'),
  INVITE: namespace('discussionsDetails', 'INVITE'),
  INVITE_SUCCESS: namespace('discussionsDetails', 'INVITE_SUCCESS'),
  INVITE_ERROR: namespace('discussionsDetails', 'INVITE_ERROR'),
  REINVITE: namespace('discussionsDetails', 'REINVITE'),
  REINVITE_SUCCESS: namespace('discussionsDetails', 'REINVITE_SUCCESS'),
  REINVITE_ERROR: namespace('discussionsDetails', 'REINVITE_ERROR'),
  UNINVITE: namespace('discussionDetails', 'UNINVITE'),
  UNINVITE_CONFIRM: namespace('discussionDetails', 'UNINVITE_CONFIRM'),
  UNINVITE_CANCEL: namespace('discussionDetails', 'UNINVITE_CANCEL'),
  UNINVITE_SUCCESS: namespace('discussionDetails', 'UNINVITE_SUCCESS'),
  UNINVITE_ERROR: namespace('discussionDetails', 'UNINVITE_ERROR'),
  REMOVE: namespace('discussionDetails', 'REMOVE'),
  REMOVE_CONFIRM: namespace('discussionDetails', 'REMOVE_CONFIRM'),
  REMOVE_CANCEL: namespace('discussionDetails', 'REMOVE_CANCEL'),
  REMOVE_SUCCESS: namespace('discussionDetails', 'REMOVE_SUCCESS'),
  REMOVE_ERROR: namespace('discussionDetails', 'REMOVE_ERROR'),
  SAVE: namespace('discussionsDetails', 'SAVE'),
  SAVE_SUCCESS: namespace('discussionsDetails', 'SAVE_SUCCESS'),
  SAVE_ERROR: namespace('discussionsDetails', 'SAVE_ERROR'),
  CLEAR_SUCCESS: namespace('discussionsDetails', 'CLEAR_SUCCESS'),
};

// All state controlled by this reducer is scoped by the id of the discussion.
// Therefore, every action payload should contain the id of the discussion on
// which it operates.
// The id being present in the root map indicates the details should be open for
// that discussion, the close action deletes the entry for that id entirely (a
// good way to cleanup state).
export const reducer = (state = Map(), { type, payload }) => {
  switch (type) {
    case types.OPEN:
      return state.set(payload.id, Map({ view: payload.view || 'root' }));
    case types.CLOSE:
      return state.delete(payload.id);
    case types.SHOW:
      return state.mergeIn([payload.id], {
        view: payload.view,
        successMessage: null,
        errorMessage: null,
      });
    case types.OPEN_HISTORY:
      return state.setIn([payload.id, 'messageHistory'], payload.message);
    case types.MUTE:
      return state.setIn([payload.id, 'muting'], true);
    case types.MUTE_SUCCESS:
      return state
        .deleteIn([payload.id, 'muting'])
        .setIn([payload.id, 'muted'], payload.isMuted);
    case types.MUTE_ERROR:
      return state
        .deleteIn([payload.id, 'muting'])
        .setIn([payload.id, 'muteError'], true);
    case types.LEAVE:
      return state.setIn([payload.id, 'leaveConfirmation'], true);
    case types.LEAVE_CONFIRM:
      return state
        .setIn([payload.id, 'leaveConfirmation'], false)
        .setIn([payload.id, 'leaving'], true);
    case types.LEAVE_CANCEL:
      return state.setIn([payload.id, 'leaveConfirmation'], false);
    case types.LEAVE_SUCCESS:
      return state.setIn([payload.id, 'leaving'], false);
    case types.LEAVE_ERROR:
      return state.setIn([payload.id, 'leaveError'], true);
    case types.INVITE:
      return state.setIn([payload.id, 'sending'], true);
    case types.INVITE_SUCCESS:
      return state.mergeIn([payload.id], {
        view: 'root',
        sending: false,
        successMessage: 'Successfully sent invitation(s)',
      });
    case types.INVITE_ERROR:
      return state.mergeIn([payload.id], {
        sending: false,
        errorMessage: payload.message,
      });
    case types.REINVITE:
    case types.REINVITE_SUCCESS:
    case types.REINVITE_ERROR:
      return state.setIn(
        [
          payload.id,
          'reinvites',
          invitationType(payload.invitation),
          invitationKey(payload.invitation),
        ],
        type === types.REINVITE
          ? 'sending'
          : type === types.REINVITE_SUCCESS
            ? 'success'
            : 'error',
      );
    case types.UNINVITE:
    case types.UNINVITE_CONFIRM:
    case types.UNINVITE_ERROR:
      return state.setIn(
        [
          payload.id,
          'uninvites',
          invitationType(payload.invitation),
          invitationKey(payload.invitation),
        ],
        type === types.UNINVITE
          ? 'confirming'
          : type === types.UNINVITE_CONFIRM
            ? 'removing'
            : 'error',
      );
    case types.UNINVITE_CANCEL:
    case types.UNINVITE_SUCCESS:
      return state.deleteIn([
        payload.id,
        'uninvites',
        invitationType(payload.invitation),
        invitationKey(payload.invitation),
      ]);
    case types.REMOVE:
    case types.REMOVE_CONFIRM:
    case types.REMOVE_ERROR:
      return state.setIn(
        [payload.id, 'removals', payload.participant.username],
        type === types.REMOVE
          ? 'confirming'
          : type === types.REMOVE_CONFIRM
            ? 'removing'
            : 'error',
      );
    case types.REMOVE_CANCEL:
    case types.REMOVE_SUCCESS:
      return state.deleteIn([
        payload.id,
        'removals',
        payload.participant.username,
      ]);
    case types.SAVE:
      return state.setIn([payload.id, 'saving'], true);
    case types.SAVE_SUCCESS:
      return state.mergeIn([payload.id], {
        view: 'root',
        saving: false,
        successMessage: 'Successfully updated discussion',
      });
    case types.SAVE_ERROR:
      const message =
        payload.message || 'There was an error saving the discussion';
      return state.mergeIn([payload.id], {
        saving: false,
        errorMessage: `Error updating discussion: ${message}`,
      });
    case types.CLEAR_SUCCESS:
      return state.deleteIn([payload.id, 'successMessage']);
    default:
      return state;
  }
};
