import { Record } from 'immutable';
import * as Utils from 'common/src/utils';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_PROFILE: namespace('profile', 'FETCH_PROFILE'),
  SET_PROFILE: namespace('profile', 'SET_PROFILE'),
};

export const actions = {
  fetchProfile: noPayload(types.FETCH_PROFILE),
  setProfile: withPayload(types.SET_PROFILE),
};

export const reducer = (state = Record(), { type, payload }) => {
  switch (type) {
    case types.SET_PROFILE:
      return payload
    default:
      return state;
  }
};
