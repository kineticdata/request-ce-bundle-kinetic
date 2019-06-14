import { Record } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('app/about');

export const types = {
  FETCH_ABOUT_REQUEST: ns('FETCH_ABOUT_REQUEST'),
  FETCH_ABOUT_COMPLETE: ns('FETCH_ABOUT_COMPLETE'),
};

export const actions = {
  fetchAboutRequest: noPayload(types.FETCH_ABOUT_REQUEST),
  fetchAboutComplete: withPayload(types.FETCH_ABOUT_COMPLETE),
};

export const State = Record({
  loading: false,
  teams: null,
  users: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_ABOUT_REQUEST:
      return state.set('loading', true);
    case types.FETCH_ABOUT_COMPLETE:
      return state
        .set('teams', payload.teams)
        .set('users', payload.users)
        .set('loading', false);
    default:
      return state;
  }
};
