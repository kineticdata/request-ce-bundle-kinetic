import { List } from 'immutable';
import * as Utils from 'common/src/utils';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_KAPPS: namespace('kapps', 'FETCH_KAPPS'),
  SET_KAPPS: namespace('kapps', 'SET_KAPPS'),
};

export const actions = {
  fetchKapps: noPayload(types.FETCH_KAPPS),
  setKapps: withPayload(types.SET_KAPPS),
};

export const reducer = (state = List(), { type, payload }) => {
  switch (type) {
    case types.SET_KAPPS:
      return payload;
    default:
      return state;
  }
};
