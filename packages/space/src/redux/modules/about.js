import { Record } from 'immutable';
import { namespace, withPayload, noPayload } from '../../utils';

export const types = {
  FETCH_ABOUT: namespace('about', 'FETCH_ABOUT'),
  SET_ABOUT: namespace('about', 'SET_SPACE_ADMINS'),
};

export const actions = {
  fetchAbout: noPayload(types.FETCH_ABOUT),
  setAbout: withPayload(types.SET_ABOUT),
};

export const State = Record({
  loading: true,
  data: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_ABOUT:
      return state.set('loading', true);
    case types.SET_ABOUT:
      return state.set('data', payload).set('loading', false);
    default:
      return state;
  }
};
