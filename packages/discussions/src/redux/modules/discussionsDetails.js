import { List, Map } from 'immutable';
import { namespace } from 'common/src/utils';

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
      const mode = payload.invitation.user ? 'user' : 'email';
      const key = payload.invitation.user
        ? payload.invitation.user.username
        : payload.invitation.email;
      const status =
        type === types.REINVITE
          ? 'sending'
          : type === types.REINVITE_SUCCESS
          ? 'success'
          : 'error';
      return state.setIn([payload.id, 'reinvites', mode, key], status);
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
