import { List, Record } from 'immutable';
import { namespaceBuilder, noPayload, withPayload } from '../../utils';
import { DatastoreSubmission } from '../../../records';
const ns = namespaceBuilder('common/schedulers');

export const SCHEDULER_FORM_SLUG = 'scheduler';
export const SCHEDULER_CONFIG_FORM_SLUG = 'scheduler-config';
export const SCHEDULER_AVAILABILITY_FORM_SLUG = 'scheduler-availability';
export const SCHEDULER_OVERRIDE_FORM_SLUG = 'scheduler-override';
export const SCHEDULER_OVERRIDES_PAGE_SIZE = 2;
export const SCHEDULED_EVENT_FORM_SLUG = 'scheduled-event';
export const SCHEDULED_EVENT_ACTION_FORM_SLUG = 'scheduled-event-action';

export const types = {
  // Schedulers List
  FETCH_SCHEDULERS_REQUEST: ns('FETCH_SCHEDULERS_REQUEST'),
  FETCH_SCHEDULERS_SUCCESS: ns('FETCH_SCHEDULERS_SUCCESS'),
  FETCH_SCHEDULERS_FAILURE: ns('FETCH_SCHEDULERS_FAILURE'),
  // Scheduler
  FETCH_SCHEDULER_REQUEST: ns('FETCH_SCHEDULER_REQUEST'),
  FETCH_SCHEDULER_SUCCESS: ns('FETCH_SCHEDULER_SUCCESS'),
  FETCH_SCHEDULER_FAILURE: ns('FETCH_SCHEDULER_FAILURE'),
  DELETE_SCHEDULER_REQUEST: ns('DELETE_SCHEDULER_REQUEST'),
  FETCH_SCHEDULER_MANAGERS_TEAM_REQUEST: ns(
    'FETCH_SCHEDULER_MANAGERS_TEAM_REQUEST',
  ),
  FETCH_SCHEDULER_AGENTS_TEAM_REQUEST: ns(
    'FETCH_SCHEDULER_AGENTS_TEAM_REQUEST',
  ),
  FETCH_SCHEDULER_TEAM_SUCCESS: ns('FETCH_SCHEDULER_TEAM_SUCCESS'),
  CREATE_SCHEDULER_MEMBERSHIP_REQUEST: ns(
    'CREATE_SCHEDULER_MEMBERSHIP_REQUEST',
  ),
  DELETE_SCHEDULER_MEMBERSHIP_REQUEST: ns(
    'DELETE_SCHEDULER_MEMBERSHIP_REQUEST',
  ),
  CREATE_USER_WITH_SCHEDULER_MEMBERSHIP_REQUEST: ns(
    'CREATE_USER_WITH_SCHEDULER_MEMBERSHIP_REQUEST',
  ),
  // Scheduler Config
  FETCH_SCHEDULER_CONFIG_REQUEST: ns('FETCH_SCHEDULER_CONFIG_REQUEST'),
  FETCH_SCHEDULER_CONFIG_SUCCESS: ns('FETCH_SCHEDULER_CONFIG_SUCCESS'),
  FETCH_SCHEDULER_CONFIG_FAILURE: ns('FETCH_SCHEDULER_CONFIG_FAILURE'),
  DELETE_SCHEDULER_CONFIG_REQUEST: ns('DELETE_SCHEDULER_CONFIG_REQUEST'),
  // Scheduler Availability
  FETCH_SCHEDULER_AVAILABILITY_REQUEST: ns(
    'FETCH_SCHEDULER_AVAILABILITY_REQUEST',
  ),
  FETCH_SCHEDULER_AVAILABILITY_SUCCESS: ns(
    'FETCH_SCHEDULER_AVAILABILITY_SUCCESS',
  ),
  FETCH_SCHEDULER_AVAILABILITY_FAILURE: ns(
    'FETCH_SCHEDULER_AVAILABILITY_FAILURE',
  ),
  DELETE_SCHEDULER_AVAILABILITY_REQUEST: ns(
    'DELETE_SCHEDULER_AVAILABILITY_REQUEST',
  ),
  // Scheduler Overrides
  FETCH_SCHEDULER_OVERRIDES_REQUEST: ns('FETCH_SCHEDULER_OVERRIDES_REQUEST'),
  FETCH_SCHEDULER_OVERRIDES_CURRENT: ns('FETCH_SCHEDULER_OVERRIDES_CURRENT'),
  FETCH_SCHEDULER_OVERRIDES_NEXT: ns('FETCH_SCHEDULER_OVERRIDES_NEXT'),
  FETCH_SCHEDULER_OVERRIDES_PREVIOUS: ns('FETCH_SCHEDULER_OVERRIDES_PREVIOUS'),
  FETCH_SCHEDULER_OVERRIDES_SUCCESS: ns('FETCH_SCHEDULER_OVERRIDES_SUCCESS'),
  FETCH_SCHEDULER_OVERRIDES_FAILURE: ns('FETCH_SCHEDULER_OVERRIDES_FAILURE'),
  DELETE_SCHEDULER_OVERRIDE_REQUEST: ns('DELETE_SCHEDULER_OVERRIDE_REQUEST'),
};

export const actions = {
  // Schedulers List
  fetchSchedulersRequest: withPayload(types.FETCH_SCHEDULERS_REQUEST),
  fetchSchedulersSuccess: withPayload(types.FETCH_SCHEDULERS_SUCCESS),
  fetchSchedulersFailure: withPayload(types.FETCH_SCHEDULERS_FAILURE),
  // Scheduler
  fetchSchedulerRequest: withPayload(types.FETCH_SCHEDULER_REQUEST),
  fetchSchedulerSuccess: withPayload(types.FETCH_SCHEDULER_SUCCESS),
  fetchSchedulerFailure: withPayload(types.FETCH_SCHEDULER_FAILURE),
  deleteSchedulerRequest: withPayload(types.DELETE_SCHEDULER_REQUEST),
  fetchSchedulerManagersTeamRequest: withPayload(
    types.FETCH_SCHEDULER_MANAGERS_TEAM_REQUEST,
  ),
  fetchSchedulerAgentsTeamRequest: withPayload(
    types.FETCH_SCHEDULER_AGENTS_TEAM_REQUEST,
  ),
  fetchSchedulerTeamSuccess: withPayload(types.FETCH_SCHEDULER_TEAM_SUCCESS),
  createSchedulerMembershipRequest: withPayload(
    types.CREATE_SCHEDULER_MEMBERSHIP_REQUEST,
  ),
  deleteSchedulerMembershipRequest: withPayload(
    types.DELETE_SCHEDULER_MEMBERSHIP_REQUEST,
  ),
  createUserWithSchedulerMembershipRequest: withPayload(
    types.CREATE_USER_WITH_SCHEDULER_MEMBERSHIP_REQUEST,
  ),
  // Scheduler Config
  fetchSchedulerConfigRequest: noPayload(types.FETCH_SCHEDULER_CONFIG_REQUEST),
  fetchSchedulerConfigSuccess: withPayload(
    types.FETCH_SCHEDULER_CONFIG_SUCCESS,
  ),
  fetchSchedulerConfigFailure: withPayload(
    types.FETCH_SCHEDULER_CONFIG_REQUEST_FAILURE,
  ),
  deleteSchedulerConfigRequest: withPayload(
    types.DELETE_SCHEDULER_CONFIG_REQUEST,
  ),
  // Scheduler Availability
  fetchSchedulerAvailabilityRequest: noPayload(
    types.FETCH_SCHEDULER_AVAILABILITY_REQUEST,
  ),
  fetchSchedulerAvailabilitySuccess: withPayload(
    types.FETCH_SCHEDULER_AVAILABILITY_SUCCESS,
  ),
  fetchSchedulerAvailabilityFailure: withPayload(
    types.FETCH_SCHEDULER_AVAILABILITY_FAILURE,
  ),
  deleteSchedulerAvailabilityRequest: withPayload(
    types.DELETE_SCHEDULER_AVAILABILITY_REQUEST,
  ),
  // Scheduler Overrides
  fetchSchedulerOverridesRequest: withPayload(
    types.FETCH_SCHEDULER_OVERRIDES_REQUEST,
  ),
  fetchSchedulerOverridesCurrent: noPayload(
    types.FETCH_SCHEDULER_OVERRIDES_CURRENT,
  ),
  fetchSchedulerOverridesNext: noPayload(types.FETCH_SCHEDULER_OVERRIDES_NEXT),
  fetchSchedulerOverridesPrevious: noPayload(
    types.FETCH_SCHEDULER_OVERRIDES_PREVIOUS,
  ),
  fetchSchedulerOverridesSuccess: withPayload(
    types.FETCH_SCHEDULER_OVERRIDES_SUCCESS,
  ),
  fetchSchedulerOverridesFailure: withPayload(
    types.FETCH_SCHEDULER_OVERRIDES_FAILURE,
  ),
  deleteSchedulerOverrideRequest: withPayload(
    types.DELETE_SCHEDULER_OVERRIDE_REQUEST,
  ),
};

const listDefaultsForState = {
  error: null,
  data: null,
};
const pagingDefaultsForState = {
  paging: false,
  pageToken: null,
  nextPageToken: null,
  previousPageTokens: List(),
};

export const State = Record({
  list: { ...listDefaultsForState },
  scheduler: {
    error: null,
    data: null,
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
    case types.FETCH_SCHEDULERS_REQUEST:
      return state.setIn(['list', 'error'], null);
    case types.FETCH_SCHEDULERS_SUCCESS:
      return state.setIn(['list', 'data'], List(payload));
    case types.FETCH_SCHEDULERS_FAILURE:
      return state.setIn(['list', 'error'], payload);
    // Scheduler
    case types.FETCH_SCHEDULER_REQUEST:
      return state
        .setIn(['scheduler', 'error'], null)
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
    case types.FETCH_SCHEDULER_SUCCESS:
      return state
        .setIn(['scheduler', 'data'], DatastoreSubmission(payload))
        .setIn(
          ['scheduler', 'config'],
          state.scheduler.data && state.scheduler.data.id !== payload.id
            ? { ...listDefaultsForState }
            : state.scheduler.config,
        )
        .setIn(
          ['scheduler', 'availability'],
          state.scheduler.data && state.scheduler.data.id !== payload.id
            ? { ...listDefaultsForState }
            : state.scheduler.availability,
        )
        .setIn(
          ['scheduler', 'overrides'],
          state.scheduler.data && state.scheduler.data.id !== payload.id
            ? {
                ...listDefaultsForState,
                ...pagingDefaultsForState,
              }
            : state.scheduler.overrides,
        );
    case types.FETCH_SCHEDULER_FAILURE:
      return state.setIn(['scheduler', 'error'], payload);
    case types.FETCH_SCHEDULER_MANAGERS_TEAM_REQUEST:
      return state.setIn(['scheduler', 'loading'], true);
    case types.FETCH_SCHEDULER_AGENTS_TEAM_REQUEST:
      return state.setIn(['scheduler', 'loading'], true);
    case types.FETCH_SCHEDULER_TEAM_SUCCESS:
      return state
        .setIn(['scheduler', 'loading'], false)
        .updateIn(['scheduler', 'teams'], teams => ({ ...teams, ...payload }));
    // Scheduler Config
    case types.FETCH_SCHEDULER_CONFIG_REQUEST:
      return state.setIn(['scheduler', 'config', 'error'], null);
    case types.FETCH_SCHEDULER_CONFIG_SUCCESS:
      return state.setIn(['scheduler', 'config', 'data'], List(payload));
    case types.FETCH_SCHEDULER_CONFIG_FAILURE:
      return state.setIn(['scheduler', 'config', 'error'], payload);
    // Scheduler Availability
    case types.FETCH_SCHEDULER_AVAILABILITY_REQUEST:
      return state.setIn(['scheduler', 'availability', 'error'], null);
    case types.FETCH_SCHEDULER_AVAILABILITY_SUCCESS:
      return state.setIn(['scheduler', 'availability', 'data'], List(payload));
    case types.FETCH_SCHEDULER_AVAILABILITY_FAILURE:
      return state.setIn(['scheduler', 'availability', 'error'], payload);
    // Scheduler Overrides
    case types.FETCH_SCHEDULER_OVERRIDES_REQUEST:
      return state
        .setIn(['scheduler', 'overrides', 'pageToken'], null)
        .setIn(['scheduler', 'overrides', 'nextPageToken'], null)
        .setIn(['scheduler', 'overrides', 'previousPageTokens'], List())
        .setIn(['scheduler', 'overrides', 'error'], null)
        .setIn(
          ['scheduler', 'includePastOverrides'],
          payload && typeof payload.past === 'boolean'
            ? payload.past
            : state.scheduler.includePastOverrides,
        )
        .setIn(
          ['scheduler', 'overrides', 'data'],
          payload &&
          typeof payload.past === 'boolean' &&
          payload.past !== state.scheduler.includePastOverrides
            ? null
            : state.scheduler.overrides.data,
        );
    case types.FETCH_SCHEDULER_OVERRIDES_CURRENT:
      return state
        .setIn(['scheduler', 'overrides', 'paging'], true)
        .setIn(['scheduler', 'overrides', 'error'], null);
    case types.FETCH_SCHEDULER_OVERRIDES_NEXT:
      return state
        .setIn(['scheduler', 'overrides', 'paging'], true)
        .updateIn(['scheduler', 'overrides', 'previousPageTokens'], prev =>
          prev.push(state.scheduler.overrides.pageToken),
        )
        .setIn(
          ['scheduler', 'overrides', 'pageToken'],
          state.scheduler.overrides.nextPageToken,
        )
        .setIn(['scheduler', 'overrides', 'nextPageToken'], null)
        .setIn(['scheduler', 'overrides', 'error'], null);
    case types.FETCH_SCHEDULER_OVERRIDES_PREVIOUS:
      return state
        .setIn(['scheduler', 'overrides', 'paging'], true)
        .setIn(
          ['scheduler', 'overrides', 'pageToken'],
          state.scheduler.overrides.previousPageTokens.last(),
        )
        .updateIn(['scheduler', 'overrides', 'previousPageTokens'], prev =>
          prev.pop(),
        )
        .setIn(['scheduler', 'overrides', 'nextPageToken'], null)
        .setIn(['scheduler', 'overrides', 'error'], null);
    case types.FETCH_SCHEDULER_OVERRIDES_SUCCESS:
      return state
        .setIn(['scheduler', 'overrides', 'paging'], false)
        .setIn(
          ['scheduler', 'overrides', 'nextPageToken'],
          payload.nextPageToken,
        )
        .setIn(['scheduler', 'overrides', 'data'], List(payload.data));
    case types.FETCH_SCHEDULER_OVERRIDES_FAILURE:
      return state
        .setIn(['scheduler', 'overrides', 'paging'], false)
        .setIn(['scheduler', 'overrides', 'error'], payload);
    default:
      return state;
  }
};
