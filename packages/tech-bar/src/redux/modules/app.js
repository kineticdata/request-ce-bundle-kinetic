import { List, Record } from 'immutable';
import { Utils } from 'common';

const { namespace, noPayload, withPayload } = Utils;

export const types = {
  LOAD_TECH_BAR: namespace('techBar', 'LOAD_TECH_BAR'),
};

export const actions = {
  loadTechBar: noPayload(types.LOAD_TECH_BAR),
};

export const State = Record({
  loading: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.LOAD_TECH_BAR:
      return state.set('loading', false);
    default:
      return state;
  }
};
