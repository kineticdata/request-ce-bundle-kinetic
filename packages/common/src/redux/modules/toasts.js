import { List, Record } from 'immutable';
import * as Utils from '../../utils';
import { store } from '../store';
import isarray from 'isarray';

const { namespace, noPayload, withPayload } = Utils;

/*
  TODO: Clean up unused code once all references are updated
  to use addToast and addToastAlert
*/

export const NOTICE_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARN: 'warning',
  ERROR: 'danger',
  NORMAL: 'normal',
};

export const types = {
  ADD_TOAST: namespace('toasts', 'ADD_TOAST'),
  REMOVE_TOAST: namespace('toasts', 'REMOVE_TOAST'),
  ADD_TOAST_ALERT: namespace('toasts', 'ADD_TOAST_ALERT'),
  REMOVE_TOAST_ALERT: namespace('toasts', 'REMOVE_TOAST_ALERT'),
  CLEAR_TOAST_ALERTS: namespace('toasts', 'CLEAR_TOAST_ALERTS'),
  SET_TOAST_DURATION: namespace('toasts', 'SET_TOAST_DURATION'),
};

export const actions = {
  addToast: payload => ({
    type: types.ADD_TOAST,
    payload: {
      id: Date.now(),
      ...(typeof payload === 'object' ? payload : { message: payload }),
    },
  }),
  removeToast: withPayload(types.REMOVE_TOAST),
  addToastAlert: payload => ({
    type: types.ADD_TOAST_ALERT,
    payload: {
      id: Date.now(),
      ...(typeof payload === 'object' ? payload : { message: payload }),
    },
  }),
  removeToastAlert: withPayload(types.REMOVE_TOAST_ALERT),
  clearToastAlerts: noPayload(types.CLEAR_TOAST_ALERTS),
  setToastDuration: withPayload(types.SET_TOAST_DURATION),

  addSuccess: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: {
      id: Date.now(),
      severity: NOTICE_TYPES.SUCCESS,
      message: `${title}: ${msg}`,
    },
  }),
  addInfo: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: {
      id: Date.now(),
      severity: NOTICE_TYPES.INFO,
      message: `${title}: ${msg}`,
    },
  }),
  addWarn: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: {
      id: Date.now(),
      severity: NOTICE_TYPES.WARN,
      message: `${title}: ${msg}`,
    },
  }),
  addError: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: {
      id: Date.now(),
      severity: NOTICE_TYPES.ERROR,
      message: `${title}: ${msg}`,
    },
  }),
  addNormal: (msg, title) => ({
    type: types.ADD_TOAST,
    payload: {
      id: Date.now(),
      severity: NOTICE_TYPES.NORMAL,
      message: `${title}: ${msg}`,
    },
  }),
};

export const State = Record({
  list: List(),
  alerts: List(),
  duration: 3000,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.ADD_TOAST:
      return state.update('list', list =>
        list.push({
          ...payload,
          // Validate severity as one of possible 5 options
          severity: ['success', 'info', 'warning', 'danger', 'normal'].includes(
            payload.severity,
          )
            ? payload.severity
            : 'success',
        }),
      );
    case types.REMOVE_TOAST:
      return state.update('list', l => l.filterNot(n => n.id === payload));
    case types.ADD_TOAST_ALERT:
      return state.update('alerts', alerts =>
        alerts.push({
          ...payload,
          // Validate severity as one of possible 5 options
          severity: ['success', 'info', 'warning', 'danger', 'normal'].includes(
            payload.severity,
          )
            ? payload.severity
            : 'danger',
          // Validate actions is array of objects that contain label and onClick
          actions: isarray(payload.actions)
            ? payload.actions.filter(a => a.label && a.onClick)
            : undefined,
          // Validate duration is a number between 1000 and 30000 if passed in
          duration: payload.duration
            ? Math.min(
                Math.max(parseInt(payload.duration, 10), 1000) || 3000,
                30000,
              )
            : undefined,
        }),
      );
    case types.REMOVE_TOAST_ALERT:
      return state.update('alerts', a => a.filterNot(n => n.id === payload));
    case types.CLEAR_TOAST_ALERTS:
      return state.set('alerts', List());
    case types.SET_TOAST_DURATION:
      return state.set('duration', payload);
    default:
      return state;
  }
};

export const addSuccess = (...args) =>
  store.dispatch(actions.addSuccess(...args));
export const addInfo = (...args) => store.dispatch(actions.addInfo(...args));
export const addWarn = (...args) => store.dispatch(actions.addWarn(...args));
export const addError = (...args) => store.dispatch(actions.addError(...args));
export const addNormal = (...args) =>
  store.dispatch(actions.addNormal(...args));

export const addToast = (...args) => store.dispatch(actions.addToast(...args));
export const addToastAlert = (...args) =>
  store.dispatch(actions.addToastAlert(...args));

window.addToast = addToast;
window.addToastAlert = addToastAlert;
