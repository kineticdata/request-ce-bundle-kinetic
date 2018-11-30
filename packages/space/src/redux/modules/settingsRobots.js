import { List, Record } from 'immutable';
import { Utils } from 'common';
import { CoreAPI } from 'react-kinetic-core';

const { namespace, noPayload, withPayload } = Utils;

export const ROBOT_DEFINITIONS_FORM_SLUG = 'robot-definitions';
export const ROBOT_FORM_SLUG = 'robot-definitions';
export const ROBOT_EXECUTIONS_FORM_SLUG = 'robot-executions';
export const ROBOT_EXECUTIONS_PAGE_SIZE = 25;

export const types = {
  FETCH_ROBOTS: namespace('settingsRobots', 'FETCH_ROBOTS'),
  SET_ROBOTS: namespace('settingsRobots', 'SET_ROBOTS'),
  SET_FETCH_ROBOT_ERROR: namespace('settingsRobots', 'SET_FETCH_ROBOT_ERROR'),
  FETCH_ROBOT: namespace('settingsRobots', 'FETCH_ROBOT'),
  SET_ROBOT: namespace('settingsRobots', 'SET_ROBOT'),
  SET_ROBOT_ERROR: namespace('settingsRobots', 'SET_ROBOT_ERROR'),
  DELETE_ROBOT: namespace('settingsRobots', 'DELETE_ROBOT'),
  SET_DELETE_SUCCESS: namespace('settingsRobots', 'SET_DELETE_SUCCESS'),
  SET_DELETE_ERROR: namespace('settingsRobots', 'SET_DELETE_ERROR'),
  FETCH_ROBOT_EXECUTIONS: namespace('settingsRobots', 'FETCH_ROBOT_EXECUTIONS'),
  FETCH_ROBOT_EXECUTIONS_NEXT_PAGE: namespace(
    'settingsRobots',
    'FETCH_ROBOT_EXECUTIONS_NEXT_PAGE',
  ),
  FETCH_ROBOT_EXECUTIONS_PREVIOUS_PAGE: namespace(
    'settingsRobots',
    'FETCH_ROBOT_EXECUTIONS_PREVIOUS_PAGE',
  ),
  SET_ROBOT_EXECUTIONS: namespace('settingsRobots', 'SET_ROBOT_EXECUTIONS'),
  SET_FETCH_ROBOT_EXECUTIONS_ERROR: namespace(
    'settingsRobots',
    'SET_FETCH_ROBOT_EXECUTIONS_ERROR',
  ),
  FETCH_ROBOT_EXECUTION: namespace('settingsRobots', 'FETCH_ROBOT_EXECUTION'),
  SET_ROBOT_EXECUTION: namespace('settingsRobots', 'SET_ROBOT_EXECUTION'),
  SET_ROBOT_EXECUTION_ERROR: namespace(
    'settingsRobots',
    'SET_ROBOT_EXECUTION_ERROR',
  ),
  FETCH_NEXT_EXECUTIONS: namespace('settingsRobots', 'FETCH_NEXT_EXECUTIONS'),
  SET_NEXT_EXECUTIONS: namespace('settingsRobots', 'SET_NEXT_EXECUTIONS'),
};

export const actions = {
  // Robots List
  fetchRobots: noPayload(types.FETCH_ROBOTS),
  setRobots: withPayload(types.SET_ROBOTS),
  setFetchRobotsError: withPayload(types.SET_FETCH_ROBOT_ERROR),
  // Robot
  fetchRobot: withPayload(types.FETCH_ROBOT),
  setRobot: withPayload(types.SET_ROBOT),
  setRobotError: withPayload(types.SET_ROBOT_ERROR),
  deleteRobot: withPayload(types.DELETE_ROBOT),
  setDeleteSuccess: noPayload(types.SET_DELETE_SUCCESS),
  setDeleteError: withPayload(types.SET_DELETE_ERROR),
  // Robot Executions List
  fetchRobotExecutions: withPayload(types.FETCH_ROBOT_EXECUTIONS, 'scheduleId'),
  fetchRobotExecutionsNextPage: withPayload(
    types.FETCH_ROBOT_EXECUTIONS_NEXT_PAGE,
    'scheduleId',
  ),
  fetchRobotExecutionsPreviousPage: withPayload(
    types.FETCH_ROBOT_EXECUTIONS_PREVIOUS_PAGE,
    'scheduleId',
  ),
  setRobotExecutions: withPayload(types.SET_ROBOT_EXECUTIONS),
  setFetchRobotExecutionsError: withPayload(
    types.SET_FETCH_ROBOT_EXECUTIONS_ERROR,
  ),
  // Robot Execution
  fetchRobotExecution: withPayload(types.FETCH_ROBOT_EXECUTION),
  setRobotExecution: withPayload(types.SET_ROBOT_EXECUTION),
  setRobotExecutionError: withPayload(types.SET_ROBOT_EXECUTION_ERROR),
  fetchNextExecutions: withPayload(types.FETCH_NEXT_EXECUTIONS),
  setNextExecutions: withPayload(types.SET_NEXT_EXECUTIONS),
};

export const State = Record({
  // Robots List
  robots: new List(),
  robotsLoading: false,
  robotsErrors: [],
  // Robot
  robot: null,
  robotLoading: true,
  robotDeleting: false,
  robotErrors: [],
  // Robot Executions List
  robotExecutions: new List(),
  robotExecutionsLoading: false,
  robotExecutionsErrors: [],
  robotExecutionsNextPageToken: null,
  robotExecutionsCurrentPageToken: null,
  robotExecutionsPreviousPageTokens: List(),
  // Robot Execution
  robotExecution: null,
  robotExecutionLoading: true,
  robotExecutionErrors: [],
  // Next Executions
  nextExecutions: null,
  nextExecutionsLoading: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.RESET_ROBOT:
      return state.delete('robot');

    case types.FETCH_ROBOTS:
      return state.set('robotsLoading', true).set('robotsErrors', []);
    case types.SET_ROBOTS:
      return state
        .set('robotsLoading', false)
        .set('robotsErrors', [])
        .set('robots', List(payload));
    case types.SET_FETCH_ROBOT_ERROR:
      return state.set('robotsLoading', false).set('robotsErrors', payload);

    case types.FETCH_ROBOT:
      return state.set('robotLoading', true);
    case types.SET_ROBOT:
      return state.set('robotLoading', false).set('robot', payload);
    case types.SET_ROBOT_ERROR:
      return state
        .set('robotLoading', false)
        .set('robotErrors', payload)
        .set('robot', null);
    case types.DELETE_ROBOT:
      return state.set('robotDeleting', true);
    case types.SET_DELETE_SUCCESS:
      return state.set('robotDeleting', false);
    case types.SET_DELETE_ERROR:
      return state
        .set('robotDeleting', false)
        .set('robotErrors', payload);

    case types.FETCH_ROBOT_EXECUTIONS:
      return state
        .set('robotExecutionsLoading', true)
        .set('robotExecutionsPreviousPageTokens', List())
        .set('robotExecutionsCurrentPageToken', null)
        .set('robotExecutionsErrors', []);
    case types.FETCH_ROBOT_EXECUTIONS_NEXT_PAGE:
      return state
        .set('robotExecutionsLoading', true)
        .update('robotExecutionsPreviousPageTokens', pageTokens =>
          pageTokens.push(state.get('robotExecutionsCurrentPageToken')),
        )
        .set(
          'robotExecutionsCurrentPageToken',
          state.get('robotExecutionsNextPageToken'),
        );
    case types.FETCH_ROBOT_EXECUTIONS_PREVIOUS_PAGE:
      return state
        .set('robotExecutionsLoading', true)
        .update('robotExecutionsPreviousPageTokens', pageTokens =>
          pageTokens.pop(),
        )
        .set(
          'robotExecutionsCurrentPageToken',
          state.get('robotExecutionsPreviousPageTokens').last(),
        );
    case types.SET_ROBOT_EXECUTIONS:
      return state
        .set('robotExecutionsLoading', false)
        .set('robotExecutionsErrors', [])
        .set('robotExecutions', List(payload.submissions))
        .set('robotExecutionsNextPageToken', payload.nextPageToken);
    case types.SET_FETCH_ROBOT_EXECUTIONS_ERROR:
      return state
        .set('robotExecutionsLoading', false)
        .set('robotExecutionsErrors', payload);

    case types.FETCH_ROBOT_EXECUTION:
      return state.set('robotExecutionLoading', true);
    case types.SET_ROBOT_EXECUTION:
      return state
        .set('robotExecutionLoading', false)
        .set('robotExecution', payload);
    case types.SET_ROBOT_EXECUTION_ERROR:
      return state
        .set('robotExecutionLoading', false)
        .set('robotExecutionErrors', payload)
        .set('robotExecution', null);

    case types.FETCH_NEXT_EXECUTIONS:
      return state.set('nextExecutionsLoading', true);
    case types.SET_NEXT_EXECUTIONS:
      return state
        .set('nextExecutionsLoading', false)
        .set('nextExecutions', payload);

    default:
      return state;
  }
};
