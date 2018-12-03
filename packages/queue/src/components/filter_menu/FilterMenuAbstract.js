import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import { push } from 'connected-react-router';
import { isImmutable, List, Map, OrderedMap } from 'immutable';
import { actions as queueActions } from '../../redux/modules/queue';
import { actions } from '../../redux/modules/filterMenu';
import { DateRangeSelector } from 'common/src/components/DateRangeSelector';
import { validateDateRange } from './FilterMenuContainer';

const VALID_STATUSES = List(['Open', 'Pending', 'Cancelled', 'Complete']);

const ASSIGNMENT_LABELS = {
  mine: 'Mine',
  teammates: 'Teammates',
  unassigned: 'Unassigned',
};

const SORT_OPTIONS = OrderedMap([
  ['createdAt', { label: 'Created At', id: 'sorted-by-created-at' }],
  ['updatedAt', { label: 'Updated At', id: 'sorted-by-updated-at' }],
  ['closedAt', { label: 'Closed At', id: 'sorted-by-closed-at' }],
  ['Due Date', { label: 'Due Date', id: 'sorted-by-due-date' }],
]);

const convertDateRangeValue = dateRange =>
  !dateRange.custom
    ? dateRange.preset
    : { start: dateRange.start, end: dateRange.end };

const formatTimeline = timeline => {
  const match = timeline.match(/(.)(.*)At/);
  return `${match[1].toUpperCase()}${match[2]}`;
};

const formatPreset = preset => {
  const match = preset.match(/(\d+)days/);
  return `${match[1]} days`;
};

const formatDate = date => moment(date).format('l');

const summarizeDateRange = range =>
  range.preset !== ''
    ? formatTimeline(range.timeline) + ' in last ' + formatPreset(range.preset)
    : range.custom
      ? formatDate(range.start) + ' - ' + formatDate(range.end)
      : null;

const restrictDateRange = filter =>
  filter.status.includes('Cancelled') || filter.status.includes('Complete')
    ? 'A date range is required if status includes Complete or Cancelled'
    : null;

const FilterCheckbox = props => (
  <label htmlFor={props.id}>
    <input type="checkbox" {...props} />
    {props.label}
  </label>
);

const FilterMenuAbstractComponent = props =>
  props.currentFilter &&
  props.render({
    teamFilters: props.teams
      .map(team => ({
        id: `filter-menu-team-checkbox-${team.slug}`,
        name: team.name,
        label: team.name,
        checked: props.currentFilter.teams.includes(team.name),
        onChange: props.toggleTeam,
      }))
      .map(props => <FilterCheckbox key={props.name} {...props} />),
    assignmentFilters: props.currentFilter.assignments
      .toSeq()
      .map((checked, name) => ({
        id: `filter-menu-assignment-checkbox-${name}`,
        name,
        label: ASSIGNMENT_LABELS[name],
        checked,
        onChange: props.toggleAssignment,
      }))
      .valueSeq()
      .map(props => <FilterCheckbox key={props.name} {...props} />),
    statusFilters: VALID_STATUSES.map(status => ({
      id: `filter-menu-status-checkbox-${status}`,
      name: status,
      label: status,
      checked: props.currentFilter.status.includes(status),
      onChange: props.toggleStatus,
    })).map(props => <FilterCheckbox key={props.name} {...props} />),
    dateRangeFilters: (
      <Fragment>
        <select
          value={props.currentFilter.dateRange.timeline}
          onChange={props.changeTimeline}
        >
          <option value="createdAt">Created At</option>
          <option value="updatedAt">Updated At</option>
          <option value="completedAt">Completed At</option>
        </select>
        <DateRangeSelector
          allowNone
          value={convertDateRangeValue(props.currentFilter.dateRange)}
          onChange={props.setDateRange}
        />
      </Fragment>
    ),
    sortedByOptions: SORT_OPTIONS.map(({ label, id }, value) => (
      <label key={id} htmlFor={id}>
        <input
          type="radio"
          id={id}
          value={value}
          name="sorted-by"
          checked={value === props.currentFilter.sortBy}
          onChange={props.changeSortedBy}
        />
        {label}
      </label>
    )).toList(),
    groupedByOptions: (
      <input
        type="text"
        value={props.currentFilter.groupBy}
        onChange={props.changeGroupedBy}
      />
    ),
    teamSummary: props.filter.teams.join(', '),
    assignmentSummary: props.filter.assignments
      .toSeq()
      .filter(b => b)
      .keySeq()
      .map(v => ASSIGNMENT_LABELS[v])
      .join(', '),
    statusSummary: props.filter.status.join(', '),
    dateRangeSummary: summarizeDateRange(props.filter.dateRange),
    dateRangeError: validateDateRange(props.currentFilter),
    sortedBySummary: SORT_OPTIONS.get(props.filter.sortBy).label,
    sortDirection: props.sortDirection,
    groupDirection: props.groupDirection,
    showing: props.showing,
    toggleShowing: props.toggleShowing,
    dirty: !props.currentFilter.equals(props.filter),
    apply: props.applyFilter,
    reset: props.resetFilter,
    validations: [validateDateRange]
      .map(fn => fn(props.currentFilter))
      .filter(v => v),
    clearTeams: props.clearTeams,
    clearAssignments: props.clearAssignments,
    clearStatus: props.clearStatus,
    clearDateRange: restrictDateRange(props.filter) || props.clearDateRange,
    clearGroupedBy: props.clearGroupedBy,
    toggleCreatedByMe: props.toggleCreatedByMe,
    toggleSortDirection: props.toggleSortDirection,
    toggleGroupDirection: props.toggleGroupDirection,
  });

export const mapStateToProps = (state, props) => ({
  currentFilter: state.queue.filterMenu.get('currentFilter'),
  showing: state.queue.filterMenu.get('activeSection'),
  kappSlug: state.app.config.kappSlug,
  teams: state.queue.queueApp.myTeams,
  sortDirection: state.queue.queue.sortDirection,
  groupDirection: state.queue.queue.groupDirection,
});

export const mapDispatchToProps = {
  open: actions.open,
  close: actions.close,
  show: actions.showSection,
  resetFilter: actions.reset,
  toggleTeam: actions.toggleTeam,
  toggleAssignment: actions.toggleAssignment,
  toggleStatus: actions.toggleStatus,
  setDateRangeTimeline: actions.setDateRangeTimeline,
  setDateRange: actions.setDateRange,
  setSortedBy: actions.setSortedBy,
  setGroupedBy: actions.setGroupedBy,
  setSortDirection: queueActions.setSortDirection,
  setGroupDirection: queueActions.setGroupDirection,
  setOffset: queueActions.setOffset,
  push,
  setAdhocFilter: queueActions.setAdhocFilter,
};

const toggleTeam = props => e => props.toggleTeam(e.target.name);
const toggleAssignment = props => e => props.toggleAssignment(e.target.name);
const toggleStatus = props => e => props.toggleStatus(e.target.name);
const changeTimeline = props => e => props.setDateRangeTimeline(e.target.value);
const changeSortedBy = props => e => props.setSortedBy(e.target.value);
const changeGroupedBy = props => e => props.setGroupedBy(e.target.value);

const toggleShowing = props => name => () => {
  props.resetFilter();
  props.show(props.showing === name ? null : name);
};

const applyFilter = props => filter => {
  props.close();
  props.setAdhocFilter(isImmutable(filter) ? filter : props.currentFilter);
  props.push(`/kapps/${props.kappSlug}/adhoc`);
};
const clearTeams = props => () =>
  props.applyFilter(props.filter.delete('teams'));
const clearAssignments = props => () =>
  props.applyFilter(props.filter.delete('assignments'));
const clearStatus = props => () =>
  props.applyFilter(props.filter.set('status', List()));
const clearDateRange = props => () =>
  props.applyFilter(props.filter.delete('dateRange'));
const clearGroupedBy = props => () =>
  props.applyFilter(props.filter.delete('groupBy'));
const toggleCreatedByMe = props => () =>
  props.applyFilter(props.filter.update('createdByMe', b => !b));
const toggleSortDirection = props => () => {
  props.setSortDirection(props.sortDirection === 'ASC' ? 'DESC' : 'ASC');
  props.setOffset(0);
};
const toggleGroupDirection = props => () => {
  props.setGroupDirection(props.groupDirection === 'ASC' ? 'DESC' : 'ASC');
  props.setOffset(0);
};

export const FilterMenuAbstract = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({ applyFilter }),
  withHandlers({
    toggleShowing,
    toggleTeam,
    toggleAssignment,
    toggleStatus,
    toggleCreatedByMe,
    changeTimeline,
    changeSortedBy,
    changeGroupedBy,
    toggleSortDirection,
    toggleGroupDirection,
    clearTeams,
    clearAssignments,
    clearStatus,
    clearDateRange,
    clearGroupedBy,
  }),
  lifecycle({
    componentDidMount() {
      this.props.open(this.props.filter);
    },
    componentDidUpdate(prevProps) {
      if (!this.props.filter.equals(prevProps.filter)) {
        this.props.open(this.props.filter);
      }
    },
  }),
)(FilterMenuAbstractComponent);
