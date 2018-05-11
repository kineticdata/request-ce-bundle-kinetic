import { Record, List } from 'immutable';
import { actions as alertsActions } from 'app/src/redux/modules/alerts';
import { types as layoutTypes } from 'app/src/redux/modules/layout';
import * as Utils from '../../utils';

const { namespace, noPayload, withPayload } = Utils;

// Discussion Server
export const selectDiscussionsEnabled = state =>
  state.app.space &&
  Utils.getAttributeValue(state.app.space, 'Discussion Server Url', null) === null
    ? false
    : true;

export const NOTICE_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  NORMAL: 'normal',
};

export const types = {
  OPEN_FORM: namespace('modalForm', 'OPEN_FORM'),
  CLOSE_FORM: namespace('modalForm', 'CLOSE_FORM'),
  COMPLETE_FORM: namespace('modalForm', 'COMPLETE_FORM'),
  ADD_NOTIFICATION: namespace('toasts', 'ADD_NOTIFICATION'),
  REMOVE_NOTIFICATION: namespace('toasts', 'REMOVE_NOTIFICATION'),
  ...layoutTypes,
};

export const actions = {
  openForm: withPayload(types.OPEN_FORM),
  closeForm: noPayload(types.CLOSE_FORM),
  completeForm: noPayload(types.COMPLETE_FORM),

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

  ...alertsActions,
};

export const State = Record({
  modalForm: null,
  modalFormIsCompleted: false,
  notifications: List(),
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.OPEN_FORM:
      return state.set('modalForm', payload);
    case types.CLOSE_FORM:
      return state.set('modalForm', null);
    case types.COMPLETE_FORM:
      return state.set('modalFormIsCompleted', true);
    case types.ADD_NOTIFICATION:
      return state.update('notifications', ns => ns.push(payload));
    case types.REMOVE_NOTIFICATION:
      return state.update('notifications', ns =>
        ns.filterNot(n => n.id === payload),
      );
    default:
      return state;
  }
};
