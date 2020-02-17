import { List, Record } from 'immutable';
import { Utils } from 'common';

const { namespace, noPayload, withPayload } = Utils;

export const ROBOT_DEFINITIONS_FORM_SLUG = 'robot-definitions';
export const ROBOT_FORM_SLUG = 'robot-definitions';

export const types = {
  FETCH_ROBOTS: namespace('robots', 'FETCH_ROBOTS'),
  SET_ROBOTS: namespace('robots', 'SET_ROBOTS'),
  SET_FETCH_ROBOT_ERROR: namespace('robots', 'SET_FETCH_ROBOT_ERROR'),
};

export const actions = {
  fetchRobots: noPayload(types.FETCH_ROBOTS),
  setRobots: withPayload(types.SET_ROBOTS),
  setFetchRobotsError: withPayload(types.SET_FETCH_ROBOT_ERROR),
};

export const State = Record({
  robots: new List(),
  robotsLoading: false,
  robotsLoaded: false,
  robotsErrors: [],
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_ROBOTS:
      return state.set('robotsLoading', true).set('robotsErrors', []);
    case types.SET_ROBOTS:
      return state
        .set('robotsLoading', false)
        .set('robotsLoaded', true)
        .set('robotsErrors', [])
        .set('robots', List(payload));
    case types.SET_FETCH_ROBOT_ERROR:
      return state.set('robotsLoading', false).set('robotsErrors', payload);
    default:
      return state;
  }
};

export default reducer;
