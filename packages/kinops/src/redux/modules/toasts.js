import { Record, List } from 'immutable';
import * as Utils from 'common/src/utils';
const { namespace, withPayload } = Utils;

export const types = {
  ADD_NOTIFICATION: namespace('toasts', 'ADD_NOTIFICATION'),
  REMOVE_NOTIFICATION: namespace('toasts', 'REMOVE_NOTIFICATION'),
};

export const NOTICE_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  NORMAL: 'normal',
};

export const actions = {
  addSuccess: (msg, title) => ({
    type: types.ADD_NOTIFICATION,
    payload: { id: Date.now(), type: NOTICE_TYPES.SUCCESS, title, msg },
  }),
  addInfo: (msg, title) => ({
    type: types.ADD_NOTIFICATION,
    payload: { id: Date.now(), type: NOTICE_TYPES.INFO, title, msg },
  }),
  addWarn: (msg, title) => ({
    type: types.ADD_NOTIFICATION,
    payload: { id: Date.now(), type: NOTICE_TYPES.WARN, title, msg },
  }),
  addError: (msg, title) => ({
    type: types.ADD_NOTIFICATION,
    payload: { id: Date.now(), type: NOTICE_TYPES.ERROR, title, msg },
  }),
  addNormal: (msg, title) => ({
    type: types.ADD_NOTIFICATION,
    payload: { id: Date.now(), type: NOTICE_TYPES.NORMAL, title, msg },
  }),
  removeNotification: withPayload(types.REMOVE_NOTIFICATION),
};

export const State = Record({
  notifications: List(),
});

export const reducer = (state = State(), action) => {
  switch (action.type) {
    case types.ADD_NOTIFICATION:
      return state.update('notifications', ns => ns.push(action.payload));
    case types.REMOVE_NOTIFICATION:
      return state.update('notifications', ns =>
        ns.filterNot(n => n.id === action.payload),
      );
    default:
      return state;
  }
};
