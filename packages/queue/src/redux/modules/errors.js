import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, withPayload } = Utils;

export const types = {
  SET_SYSTEM_ERROR: '@kd/boilerplate/SET_SYSTEM_ERROR',
  CLEAR_SYSTEM_ERROR: '@kd/boilerplate/CLEAR_SYSTEM_ERROR',
  ADD_NOTIFICATION: namespace('errors', 'ADD_NOTIFICATION'),
  REMOVE_NOTIFICATION: namespace('errors', 'REMOVE_NOTIFICATION'),
};

export const NOTICE_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  NORMAL: 'normal',
};

export const actions = {
  setSystemError: error => ({ type: types.SET_SYSTEM_ERROR, payload: error }),
  clearSystemError: () => ({ type: types.CLEAR_SYSTEM_ERROR }),
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
  system: {},
  notifications: List(),
});

const reducer = (state = State(), action) => {
  switch (action.type) {
    case types.SET_SYSTEM_ERROR:
      return state.set('system', action.payload);
    case types.CLEAR_SYSTEM_ERROR:
      return state.set('system', {});
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

export default reducer;
