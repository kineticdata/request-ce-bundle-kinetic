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
  byIndividuals: false,
  individuals: List(),
});

const assignmentCriteriaReviver = assignmentCriteriaJSON => {
  const individuals = List(assignmentCriteriaJSON.individuals);

  return AssignmentCriteria({ ...assignmentCriteriaJSON, individuals });
};

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
  // Valid types are: default, custom, and adhoc.
  type: 'default',

  // Filter sort order: createdAt, updatedAt, Due Date.
  sortBy: 'createdAt',

  // Search Criteria.
  status: VALID_STATUSES.filter(isActiveStatus),
  teams: List(),
  assignments: AssignmentCriteria(),
  dateRange: DateRangeCriteria(),
  createdByMe: false,
});

export const filterReviver = filterJSON => {
  const status = List(filterJSON.status);
  const teams = List(filterJSON.teams);
  const assignments = assignmentCriteriaReviver(filterJSON.assignments);
  const dateRange = DateRangeCriteria(filterJSON.dateRange);

  return Filter({ ...filterJSON, status, teams, assignments, dateRange });
};
