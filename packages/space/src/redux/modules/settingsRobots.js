import { List, Record } from 'immutable';
import { Utils } from 'common';
import { CoreAPI } from 'react-kinetic-core';

const { namespace, noPayload, withPayload } = Utils;

export const ROBOT_DEFINITIONS_FORM_SLUG = 'robot-definitions';
export const ROBOT_SCHEDULES_FORM_SLUG = 'robot-definitions';
export const ROBOT_EXECUTIONS_FORM_SLUG = 'robot-executions';
export const ROBOT_EXECUTIONS_PAGE_SIZE = 25;

export const types = {
  FETCH_ROBOTS: namespace('settingsRobots', 'FETCH_ROBOTS'),
  SET_ROBOTS: namespace('settingsRobots', 'SET_ROBOTS'),
  SET_FETCH_ROBOTS_ERROR: namespace('settingsRobots', 'SET_FETCH_ROBOTS_ERROR'),
  FETCH_ROBOT: namespace('settingsRobots', 'FETCH_ROBOT'),
  SET_ROBOT: namespace('settingsRobots', 'SET_ROBOT'),
  SET_ROBOT_ERROR: namespace('settingsRobots', 'SET_ROBOT_ERROR'),
  RESET_ROBOT: namespace('settingsRobots', 'RESET_ROBOT'),
  DELETE_ROBOT: namespace('settingsRobots', 'DELETE_ROBOT'),
  SET_DELETE_SUCCESS: namespace('settingsRobots', 'SET_DELETE_SUCCESS'),
  SET_DELETE_ERROR: namespace('settingsRobots', 'SET_DELETE_ERROR'),

  FETCH_ROBOT_SCHEDULES: namespace('settingsRobots', 'FETCH_ROBOT_SCHEDULES'),
  SET_ROBOT_SCHEDULES: namespace('settingsRobots', 'SET_ROBOT_SCHEDULES'),
  SET_FETCH_ROBOT_SCHEDULES_ERROR: namespace(
    'settingsRobots',
    'SET_FETCH_ROBOT_SCHEDULES_ERROR',
  ),
  FETCH_ROBOT_SCHEDULE: namespace('settingsRobots', 'FETCH_ROBOT_SCHEDULE'),
  SET_ROBOT_SCHEDULE: namespace('settingsRobots', 'SET_ROBOT_SCHEDULE'),
  SET_ROBOT_SCHEDULE_ERROR: namespace(
    'settingsRobots',
    'SET_ROBOT_SCHEDULE_ERROR',
  ),
  DELETE_ROBOT_SCHEDULE: namespace('settingsRobots', 'DELETE_ROBOT_SCHEDULE'),
  SET_DELETE_SCHEDULE_SUCCESS: namespace(
    'settingsRobots',
    'SET_DELETE_SCHEDULE_SUCCESS',
  ),
  SET_DELETE_SCHEDULE_ERROR: namespace(
    'settingsRobots',
    'SET_DELETE_SCHEDULE_ERROR',
  ),
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
  setFetchRobotsError: withPayload(types.SET_FETCH_ROBOTS_ERROR),
  // Robot
  fetchRobot: withPayload(types.FETCH_ROBOT),
  setRobot: withPayload(types.SET_ROBOT),
  setRobotError: withPayload(types.SET_ROBOT_ERROR),
  resetRobot: noPayload(types.RESET_ROBOT),
  deleteRobot: withPayload(types.DELETE_ROBOT),
  setDeleteSuccess: noPayload(types.SET_DELETE_SUCCESS),
  setDeleteError: withPayload(types.SET_DELETE_ERROR),
  // Robot Schedules List
  fetchRobotSchedules: noPayload(types.FETCH_ROBOT_SCHEDULES),
  setRobotSchedules: withPayload(types.SET_ROBOT_SCHEDULES),
  setFetchRobotSchedulesError: withPayload(
    types.SET_FETCH_ROBOT_SCHEDULES_ERROR,
  ),
  // Robot Schedule
  fetchRobotSchedule: withPayload(types.FETCH_ROBOT_SCHEDULE),
  setRobotSchedule: withPayload(types.SET_ROBOT_SCHEDULE),
  setRobotScheduleError: withPayload(types.SET_ROBOT_SCHEDULE_ERROR),
  deleteRobotSchedule: withPayload(types.DELETE_ROBOT_SCHEDULE),
  setDeleteScheduleSuccess: noPayload(types.SET_DELETE_SCHEDULE_SUCCESS),
  setDeleteScheduleError: withPayload(types.SET_DELETE_SCHEDULE_ERROR),
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

export function hasRobotSchedules(id, callback) {
  const query = new CoreAPI.SubmissionSearch(true);
  query.include('details,values');
  query.limit('1');
  query.index('values[Robot ID],values[Schedule Name]:UNIQUE');
  query.eq('values[Robot ID]', id);

  CoreAPI.searchSubmissions({
    search: query.build(),
    datastore: true,
    form: ROBOT_SCHEDULES_FORM_SLUG,
  }).then(response => callback(response));
}

export const State = Record({
  // Robots List
  loading: true,
  errors: [],
  robots: new List(),
  // Robot
  robot: null,
  robotLoading: true,
  robotDeleting: false,
  robotErrors: [],
  // Robot Schedules List
  robotSchedules: new List(),
  robotSchedulesLoading: false,
  robotSchedulesErrors: [],
  // Robot Schedule
  robotSchedule: null,
  robotScheduleLoading: true,
  robotScheduleDeleting: false,
  robotScheduleErrors: [],
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
    case types.FETCH_ROBOTS:
      return state.set('loading', true).set('errors', []);
    case types.SET_ROBOTS:
      return state
        .set('loading', false)
        .set('errors', [])
        .set('robots', List(payload));
    case types.SET_FETCH_ROBOTS_ERROR:
      return state.set('loading', false).set('errors', payload);

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
      return state.set('robotDeleting', false).set('robotErrors', payload);
    case types.RESET_ROBOT:
      return state.delete('robot');

    case types.FETCH_ROBOT_SCHEDULES:
      return state
        .set('robotSchedulesLoading', true)
        .set('robotSchedulesErrors', []);
    case types.SET_ROBOT_SCHEDULES:
      return state
        .set('robotSchedulesLoading', false)
        .set('robotSchedulesErrors', [])
        .set('robotSchedules', List(payload));
    case types.SET_FETCH_ROBOT_SCHEDULES_ERROR:
      return state
        .set('robotSchedulesLoading', false)
        .set('robotSchedulesErrors', payload);

    case types.FETCH_ROBOT_SCHEDULE:
      return state.set('robotScheduleLoading', true);
    case types.SET_ROBOT_SCHEDULE:
      return state
        .set('robotScheduleLoading', false)
        .set('robotSchedule', payload);
    case types.SET_ROBOT_SCHEDULE_ERROR:
      return state
        .set('robotScheduleLoading', false)
        .set('robotScheduleErrors', payload)
        .set('robotSchedule', null);
    case types.DELETE_ROBOT_SCHEDULE:
      return state.set('robotScheduleDeleting', true);
    case types.SET_DELETE_SCHEDULE_SUCCESS:
      return state.set('robotScheduleDeleting', false);
    case types.SET_DELETE_SCHEDULE_ERROR:
      return state
        .set('robotScheduleDeleting', false)
        .set('robotScheduleErrors', payload);

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
