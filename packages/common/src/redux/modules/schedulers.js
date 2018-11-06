import { List, Record } from 'immutable';
import { namespace, noPayload, withPayload } from '../../utils';
import { DatastoreSubmission } from '../../../records';

export const SCHEDULER_FORM_SLUG = 'scheduler';
export const SCHEDULER_CONFIG_FORM_SLUG = 'scheduler-config';
export const SCHEDULER_AVAILABILITY_FORM_SLUG = 'scheduler-availability';
export const SCHEDULER_OVERRIDE_FORM_SLUG = 'scheduler-override';
export const SCHEDULER_OVERRIDES_PAGE_SIZE = 10;
export const SCHEDULED_EVENT_FORM_SLUG = 'scheduled-event';
export const RESCHEDULE_EVENT_FORM_SLUG = 'reschedule-event';

export const types = {
  // Schedulers List
  FETCH_SCHEDULERS: namespace('schedulers', 'FETCH_SCHEDULERS'),
  SET_SCHEDULERS: namespace('schedulers', 'SET_SCHEDULERS'),
  SET_SCHEDULERS_ERRORS: namespace('schedulers', 'SET_SCHEDULERS_ERRORS'),
  // Scheduler
  FETCH_SCHEDULER: namespace('schedulers', 'FETCH_SCHEDULER'),
  SET_SCHEDULER: namespace('schedulers', 'SET_SCHEDULER'),
  SET_SCHEDULER_ERRORS: namespace('schedulers', 'SET_SCHEDULER_ERRORS'),
  FETCH_SCHEDULER_MANAGERS_TEAM: namespace(
    'schedulers',
    'FETCH_SCHEDULER_MANAGERS_TEAM',
  ),
  FETCH_SCHEDULER_AGENTS_TEAM: namespace(
    'schedulers',
    'FETCH_SCHEDULER_AGENTS_TEAM',
  ),
  SET_SCHEDULER_TEAMS: namespace('schedulers', 'SET_SCHEDULER_TEAMS'),
  // Scheduler Config
  FETCH_SCHEDULER_CONFIG: namespace('schedulers', 'FETCH_SCHEDULER_CONFIG'),
  SET_SCHEDULER_CONFIG: namespace('schedulers', 'SET_SCHEDULER_CONFIG'),
  SET_SCHEDULER_CONFIG_ERRORS: namespace(
    'schedulers',
    'SET_SCHEDULER_CONFIG_ERRORS',
  ),
  DELETE_SCHEDULER_CONFIG: namespace('schedulers', 'DELETE_SCHEDULER_CONFIG'),
  // Scheduler Availability
  FETCH_SCHEDULER_AVAILABILITY: namespace(
    'schedulers',
    'FETCH_SCHEDULER_AVAILABILITY',
  ),
  SET_SCHEDULER_AVAILABILITY: namespace(
    'schedulers',
    'SET_SCHEDULER_AVAILABILITY',
  ),
  SET_SCHEDULER_AVAILABILITY_ERRORS: namespace(
    'schedulers',
    'SET_SCHEDULER_AVAILABILITY_ERRORS',
  ),
  DELETE_SCHEDULER_AVAILABILITY: namespace(
    'schedulers',
    'DELETE_SCHEDULER_AVAILABILITY',
  ),
  // Scheduler Overrides
  FETCH_SCHEDULER_OVERRIDES: namespace(
    'schedulers',
    'FETCH_SCHEDULER_OVERRIDES',
  ),
  FETCH_CURRENT_SCHEDULER_OVERRIDES: namespace(
    'schedulers',
    'FETCH_CURRENT_SCHEDULER_OVERRIDES',
  ),
  FETCH_NEXT_SCHEDULER_OVERRIDES: namespace(
    'schedulers',
    'FETCH_NEXT_SCHEDULER_OVERRIDES',
  ),
  FETCH_PREVIOUS_SCHEDULER_OVERRIDES: namespace(
    'schedulers',
    'FETCH_PREVIOUS_SCHEDULER_OVERRIDES',
  ),
  SET_SCHEDULER_OVERRIDES: namespace('schedulers', 'SET_SCHEDULER_OVERRIDES'),
  SET_SCHEDULERS_ERROR_OVERRIDES: namespace(
    'schedulers',
    'SET_SCHEDULER_OVERRIDES_ERRORS',
  ),
  DELETE_SCHEDULER_OVERRIDE: namespace(
    'schedulers',
    'DELETE_SCHEDULER_OVERRIDE',
  ),
};

export const actions = {
  // Schedulers List
  fetchSchedulers: withPayload(types.FETCH_SCHEDULERS),
  setSchedulers: withPayload(types.SET_SCHEDULERS),
  setSchedulersErrors: withPayload(types.SET_SCHEDULERS_ERRORS),
  // Scheduler
  fetchScheduler: withPayload(types.FETCH_SCHEDULER),
  setScheduler: withPayload(types.SET_SCHEDULER),
  setSchedulerErrors: withPayload(types.SET_SCHEDULER_ERRORS),
  fetchSchedulerManagersTeam: withPayload(types.FETCH_SCHEDULER_MANAGERS_TEAM),
  fetchSchedulerAgentsTeam: withPayload(types.FETCH_SCHEDULER_AGENTS_TEAM),
  setSchedulerTeams: withPayload(types.SET_SCHEDULER_TEAMS),
  // Scheduler Config
  fetchSchedulerConfig: noPayload(types.FETCH_SCHEDULER_CONFIG),
  setSchedulerConfig: withPayload(types.SET_SCHEDULER_CONFIG),
  setSchedulerConfigErrors: withPayload(types.SET_SCHEDULER_CONFIG_ERRORS),
  deleteSchedulerConfig: withPayload(types.DELETE_SCHEDULER_CONFIG),
  // Scheduler Availability
  fetchSchedulerAvailability: noPayload(types.FETCH_SCHEDULER_AVAILABILITY),
  setSchedulerAvailability: withPayload(types.SET_SCHEDULER_AVAILABILITY),
  setSchedulerAvailabilityErrors: withPayload(
    types.SET_SCHEDULER_AVAILABILITY_ERRORS,
  ),
  deleteSchedulerAvailability: withPayload(types.DELETE_SCHEDULER_AVAILABILITY),
  // Scheduler Overrides
  fetchSchedulerOverrides: withPayload(types.FETCH_SCHEDULER_OVERRIDES),
  fetchCurrentSchedulerOverrides: noPayload(
    types.FETCH_CURRENT_SCHEDULER_OVERRIDES,
  ),
  fetchNextSchedulerOverrides: noPayload(types.FETCH_NEXT_SCHEDULER_OVERRIDES),
  fetchPreviousSchedulerOverrides: noPayload(
    types.FETCH_PREVIOUS_SCHEDULER_OVERRIDES,
  ),
  setSchedulerOverrides: withPayload(types.SET_SCHEDULER_OVERRIDES),
  setSchedulerOverridesErrors: withPayload(
    types.SET_SCHEDULER_OVERRIDES_ERRORS,
  ),
  deleteSchedulerOverride: withPayload(types.DELETE_SCHEDULER_OVERRIDE),
};

const listDefaultsForState = {
  loading: true,
  errors: [],
  data: new List(),
};
const pagingDefaultsForState = {
  currentPageToken: null,
  nextPageToken: null,
  previousPageTokens: new List(),
};

export const State = Record({
  list: { ...listDefaultsForState },
  scheduler: {
    loading: true,
    errors: [],
    data: new DatastoreSubmission(),
    teams: {},
    config: { ...listDefaultsForState },
    availability: { ...listDefaultsForState },
    overrides: {
      ...listDefaultsForState,
      ...pagingDefaultsForState,
    },
    includePastOverrides: false,
  },
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    // Schedulers List
    case types.FETCH_SCHEDULERS:
      return state
        .setIn(['list', 'loading'], true)
        .setIn(['list', 'errors'], []);
    case types.SET_SCHEDULERS:
      return state
        .setIn(['list', 'loading'], false)
        .setIn(['list', 'errors'], [])
        .setIn(['list', 'data'], List(payload));
    case types.SET_SCHEDULERS_ERRORS:
      return state
        .setIn(['list', 'loading'], false)
        .setIn(['list', 'errors'], payload);
    // Scheduler List
    case types.FETCH_SCHEDULER:
      return state
        .setIn(['scheduler', 'loading'], true)
        .setIn(['scheduler', 'errors'], [])
        .setIn(
          ['scheduler', 'config'],
          payload.clear ? { ...listDefaultsForState } : state.scheduler.config,
        )
        .setIn(
          ['scheduler', 'availability'],
          payload.clear
            ? { ...listDefaultsForState }
            : state.scheduler.availability,
        )
        .setIn(
          ['scheduler', 'overrides'],
          payload.clear
            ? {
                ...listDefaultsForState,
                ...pagingDefaultsForState,
              }
            : state.scheduler.overrides,
        );
    case types.SET_SCHEDULER:
      return state
        .setIn(['scheduler', 'loading'], false)
        .setIn(['scheduler', 'errors'], [])
        .setIn(['scheduler', 'data'], DatastoreSubmission(payload))
        .setIn(
          ['scheduler', 'config'],
          state.scheduler.data.id !== payload.id
            ? { ...listDefaultsForState }
            : state.scheduler.config,
        )
        .setIn(
          ['scheduler', 'availability'],
          state.scheduler.data.id !== payload.id
            ? { ...listDefaultsForState }
            : state.scheduler.availability,
        )
        .setIn(
          ['scheduler', 'overrides'],
          state.scheduler.data.id !== payload.id
            ? {
                ...listDefaultsForState,
                ...pagingDefaultsForState,
              }
            : state.scheduler.overrides,
        );
    case types.SET_SCHEDULER_ERRORS:
      return state
        .setIn(['scheduler', 'loading'], false)
        .setIn(['scheduler', 'errors'], payload);
    case types.FETCH_SCHEDULER_MANAGERS_TEAM:
      return state.setIn(['scheduler', 'loading'], true);
    case types.FETCH_SCHEDULER_AGENTS_TEAM:
      return state.setIn(['scheduler', 'loading'], true);
    case types.SET_SCHEDULER_TEAMS:
      return state
        .setIn(['scheduler', 'loading'], false)
        .updateIn(['scheduler', 'teams'], teams => ({ ...teams, ...payload }));
    // Scheduler Config
    case types.FETCH_SCHEDULER_CONFIG:
      return state
        .setIn(['scheduler', 'config', 'loading'], true)
        .setIn(['scheduler', 'config', 'errors'], []);
    case types.SET_SCHEDULER_CONFIG:
      return state
        .setIn(['scheduler', 'config', 'loading'], false)
        .setIn(['scheduler', 'config', 'errors'], [])
        .setIn(['scheduler', 'config', 'data'], List(payload));
    case types.SET_SCHEDULER_CONFIG_ERRORS:
      return state
        .setIn(['scheduler', 'config', 'loading'], false)
        .setIn(['scheduler', 'config', 'errors'], payload);
    // Scheduler Availability
    case types.FETCH_SCHEDULER_AVAILABILITY:
      return state
        .setIn(['scheduler', 'availability', 'loading'], true)
        .setIn(['scheduler', 'availability', 'errors'], []);
    case types.SET_SCHEDULER_AVAILABILITY:
      return state
        .setIn(['scheduler', 'availability', 'loading'], false)
        .setIn(['scheduler', 'availability', 'errors'], [])
        .setIn(['scheduler', 'availability', 'data'], List(payload));
    case types.SET_SCHEDULER_AVAILABILITY_ERRORS:
      return state
        .setIn(['scheduler', 'availability', 'loading'], false)
        .setIn(['scheduler', 'availability', 'errors'], payload);
    // Scheduler Overrides
    case types.FETCH_SCHEDULER_OVERRIDES:
      return state
        .setIn(['scheduler', 'overrides', 'loading'], true)
        .setIn(['scheduler', 'overrides', 'currentPageToken'], null)
        .setIn(['scheduler', 'overrides', 'nextPageToken'], null)
        .setIn(['scheduler', 'overrides', 'previousPageTokens'], new List())
        .setIn(['scheduler', 'overrides', 'errors'], [])
        .setIn(
          ['scheduler', 'includePastOverrides'],
          payload && typeof payload.past === 'boolean'
            ? payload.past
            : state.scheduler.includePastOverrides,
        );
    case types.FETCH_CURRENT_SCHEDULER_OVERRIDES:
      return state
        .setIn(['scheduler', 'overrides', 'loading'], true)
        .setIn(['scheduler', 'overrides', 'errors'], []);
    case types.FETCH_NEXT_SCHEDULER_OVERRIDES:
      return state
        .setIn(['scheduler', 'overrides', 'loading'], true)
        .updateIn(['scheduler', 'overrides', 'previousPageTokens'], prev =>
          prev.push(state.scheduler.overrides.currentPageToken),
        )
        .setIn(
          ['scheduler', 'overrides', 'currentPageToken'],
          state.scheduler.overrides.nextPageToken,
        )
        .setIn(['scheduler', 'overrides', 'nextPageToken'], null)
        .setIn(['scheduler', 'overrides', 'errors'], []);
    case types.FETCH_PREVIOUS_SCHEDULER_OVERRIDES:
      return state
        .setIn(['scheduler', 'overrides', 'loading'], true)
        .setIn(
          ['scheduler', 'overrides', 'currentPageToken'],
          state.scheduler.overrides.previousPageTokens.last(),
        )
        .updateIn(['scheduler', 'overrides', 'previousPageTokens'], prev =>
          prev.pop(),
        )
        .setIn(['scheduler', 'overrides', 'nextPageToken'], null)
        .setIn(['scheduler', 'overrides', 'errors'], []);
    case types.SET_SCHEDULER_OVERRIDES:
      return state
        .setIn(['scheduler', 'overrides', 'loading'], false)
        .setIn(['scheduler', 'overrides', 'errors'], [])
        .setIn(
          ['scheduler', 'overrides', 'nextPageToken'],
          payload.nextPageToken,
        )
        .setIn(['scheduler', 'overrides', 'data'], List(payload.data));
    case types.SET_SCHEDULER_OVERRIDES_ERRORS:
      return state
        .setIn(['scheduler', 'overrides', 'loading'], false)
        .setIn(['scheduler', 'overrides', 'errors'], payload);
    default:
      return state;
  }
};
