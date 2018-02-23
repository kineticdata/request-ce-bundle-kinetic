import { Record } from 'immutable';
import { namespace, noPayload, withPayload } from 'common/utils';

export const types = {
  SET_SIZE: namespace('layout', 'SET_SIZE'),
};

export const actions = {
  setSize: withPayload(types.SET_SIZE),
};

export const State = Record({
  size: 'small',
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_SIZE:
      return state.set('size', payload);
    default:
      return state;
  }
};
