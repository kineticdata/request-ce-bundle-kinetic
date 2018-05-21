import { Record } from 'immutable';
import * as Utils from 'common/src/utils';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_SPACE: namespace('space', 'FETCH_SPACE'),
  SET_SPACE: namespace('space', 'SET_SPACE'),
};

export const actions = {
  fetchSpace: noPayload(types.FETCH_SPACE),
  setSpace: withPayload(types.SET_SPACE),
};

export const reducer = (state = Record(), { type, payload }) => {
  switch (type) {
    case types.SET_SPACE:
      return payload
    default:
      return state;
  }
};
