import * as Utils from 'common/src/utils';
const { namespace, withPayload } = Utils;

export const types = {
  LOAD_APP: namespace('loading', 'LOAD_APP'),
  SET_LOADING: namespace('loading', 'SET_LOADING'),
};

export const actions = {
  loadApp: withPayload(types.LOAD_APP),
  setLoading: withPayload(types.SET_LOADING),
};

export const reducer = (state = true, { type, payload }) => {
  switch (type) {
    case types.SET_LOADING:
      return payload;
    default:
      return state;
  }
};
