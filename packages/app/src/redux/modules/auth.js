import { Record } from 'immutable';
import * as Utils from 'common/src/utils';
const { namespace, noPayload } = Utils;

export const types = {
  TIMED_OUT: namespace('loading', 'TIMED_OUT'),
  MODAL_LOGIN_SUCCESS: namespace('auth', 'MODAL_LOGIN_SUCCESS'),
  MODAL_LOGIN_CANCELLED: namespace('auth', 'MODAL_LOGIN_CANCELLED'),
  SET_DESTINATION_ROUTE: namespace('auth', 'SET_DESTINATION_ROUTE'),
};

export const actions = {
  timedOut: noPayload(types.TIMED_OUT),
  modalLoginSuccess: noPayload(types.MODAL_LOGIN_SUCCESS),
  modalLoginCancelled: noPayload(types.MODAL_LOGIN_CANCELLED),
  setDestinationRoute: Utils.withPayload(types.SET_DESTINATION_ROUTE),
};

export const selectors = {
  authenticatedSelector: state => !state.app.auth.timedOut,
  cancelledSelector: state => !state.app.auth.modalLogin,
};

const State = Record({
  timedOut: false,
  modalLogin: false,
  destinationRoute: null,
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
    default:
      return state;
  }
};
