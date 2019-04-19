import { Record } from 'immutable';
import * as Utils from 'common/src/utils';

const { namespace, noPayload, withPayload } = Utils;
const MODULE_NAME = 'auth';

export const types = {
  TIMED_OUT: namespace(MODULE_NAME, 'TIMED_OUT'),
  MODAL_LOGIN_SUCCESS: namespace(MODULE_NAME, 'MODAL_LOGIN_SUCCESS'),
  MODAL_LOGIN_CANCELLED: namespace(MODULE_NAME, 'MODAL_LOGIN_CANCELLED'),
  SET_DESTINATION_ROUTE: namespace(MODULE_NAME, 'SET_DESTINATION_ROUTE'),
  SET_TOKEN: namespace(MODULE_NAME, 'SET_TOKEN'),
};

export const actions = {
  timedOut: noPayload(types.TIMED_OUT),
  modalLoginSuccess: noPayload(types.MODAL_LOGIN_SUCCESS),
  modalLoginCancelled: noPayload(types.MODAL_LOGIN_CANCELLED),
  setDestinationRoute: withPayload(types.SET_DESTINATION_ROUTE),
  setToken: withPayload(types.SET_TOKEN),
};

export const selectors = {
  authenticatedSelector: state => !state.app.auth.timedOut,
  cancelledSelector: state => !state.app.auth.modalLogin,
};

const State = Record({
  timedOut: false,
  modalLogin: false,
  destinationRoute: null,
  token: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.TIMED_OUT:
      return state.set('timedOut', true).set('modalLogin', true);
    case types.MODAL_LOGIN_SUCCESS:
      return State();
    case types.MODAL_LOGIN_CANCELLED:
      return state.set('modalLogin', false);
    case types.SET_DESTINATION_ROUTE:
      return state.set('destinationRoute', payload);
    case types.SET_TOKEN:
      return state.set('token', payload);
    default:
      return state;
  }
};
