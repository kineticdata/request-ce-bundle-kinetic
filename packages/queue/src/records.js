import { List, Record } from 'immutable';

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

  // Filter sort order: createdAt, updatedAt, Due Date.
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

    const status = List(filter.status);
    const teams = List(filter.teams);
    const assignments = AssignmentCriteria(filter.assignments);
    const dateRange = DateRangeCriteria(filter.dateRange);

    return Filter({ ...filter, status, teams, assignments, dateRange });
  } catch (e) {
    return null;
  }
};
