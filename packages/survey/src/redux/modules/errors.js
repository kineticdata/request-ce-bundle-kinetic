import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  SET_SYSTEM_ERROR: namespace('errors', 'SET_SYSTEM_ERROR'),
  CLEAR_SYSTEM_ERROR: namespace('errors', 'CLEAR_SYSTEM_ERROR'),
};

export const actions = {
  setSystemError: withPayload(types.SET_SYSTEM_ERROR),
  clearSystemError: noPayload(types.CLEAR_SYSTEM_ERROR),
};

export const State = Record({
  system: {},
  notifications: List(),
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_SYSTEM_ERROR:
      return state.set('system', payload);
    case types.CLEAR_SYSTEM_ERROR:
      return state.set('system', {});
    default:
      return state;
  }
};
