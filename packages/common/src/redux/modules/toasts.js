import { List } from 'immutable';
import * as Utils from '../../utils';

const { namespace, withPayload } = Utils;

export const NOTICE_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  NORMAL: 'normal',
};

export const types = {
  ADD_TOAST: namespace('toasts', 'ADD_TOAST'),
  REMOVE_TOAST: namespace('toasts', 'REMOVE_TOAST'),
};

export const actions = {
  addSuccess: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: { id: Date.now(), type: NOTICE_TYPES.SUCCESS, title, msg },
  }),
  addInfo: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: { id: Date.now(), type: NOTICE_TYPES.INFO, title, msg },
  }),
  addWarn: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: { id: Date.now(), type: NOTICE_TYPES.WARN, title, msg },
  }),
  addError: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: { id: Date.now(), type: NOTICE_TYPES.ERROR, title, msg },
  }),
  addNormal: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: { id: Date.now(), type: NOTICE_TYPES.NORMAL, title, msg },
  }),
  removeToast: withPayload(types.REMOVE_TOAST),
};

export const reducer = (state = List(), { type, payload }) => {
  switch (type) {
    case types.ADD_TOAST:
      return state.push(payload);
    case types.REMOVE_TOAST:
      return state.filterNot(n => n.id === payload);
    default:
      return state;
  }
};
