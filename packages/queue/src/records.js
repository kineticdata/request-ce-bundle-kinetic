import { List, Record } from 'immutable';
import isarray from 'isarray';
import isobject from 'isobject';

export const Profile = Record({
  displayName: '',
  username: '',
  email: '',
});

export const VALID_STATUSES = List([
  'Open',
  'Pending',
  'Cancelled',
  'Complete',
]);

export const VALID_SORT_OPTIONS = List([
  'createdAt',
  'updatedAt',
  'closedAt',
  'Due Date',
]);

export const isActiveStatus = status =>
  status !== 'Complete' && status !== 'Cancelled';

export const AssignmentCriteria = Record({
  mine: false,
  teammates: false,
  unassigned: false,
});

export const DateRangeCriteria = Record({
  // createdAt, updatedAt, closedAt
  timeline: 'createdAt',
  // 7days, 30days, 60days, 90days
  preset: '',
  custom: false,
  start: '',
  end: '',
});

export const Filter = Record({
  name: '',
  slug: '',
  icon: '',
  // Valid types are: default, team, custom, and adhoc.
  type: 'default',

  // Filter sort order: createdAt, updatedAt, closedAt, Due Date.
  sortBy: 'createdAt',

  // Filter Group By: free text input
  groupBy: '',

  // Search Criteria.
  status: VALID_STATUSES.filter(isActiveStatus),
  teams: List(),
  assignments: AssignmentCriteria(),
  dateRange: DateRangeCriteria(),
  createdByMe: false,
});

export const filterReviver = filterJSON => {
  try {
    let filter = filterJSON;
    if (typeof filterJSON === 'string') {
      filter = JSON.parse(filterJSON);
    }
    const sortBy = VALID_SORT_OPTIONS.includes(filter.sortBy)
      ? filter.sortBy
      : undefined;
    const status = isarray(filter.status) ? List(filter.status) : undefined;
    const teams = isarray(filter.teams) ? List(filter.teams) : undefined;
    const assignments = isobject(filter.assignments)
      ? AssignmentCriteria(filter.assignments)
      : undefined;
    const dateRange = isobject(filter.dateRange)
      ? DateRangeCriteria(filter.dateRange)
      : undefined;

    return Filter({
      name: filter.name,
      slug: filter.slug,
      icon: filter.icon,
      type: filter.type,
      groupBy: filter.groupBy,
      sortBy,
      status,
      teams,
      assignments,
      dateRange,
      createdByMe: filter.createdByMe === true,
    });
  } catch (e) {
    return null;
  }
};
