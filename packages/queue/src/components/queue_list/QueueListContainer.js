import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { is, List } from 'immutable';
import { getFilterByPath } from '../../redux/modules/queueApp';
import { actions as queueActions } from '../../redux/modules/queue';
import { actions as filterMenuActions } from '../../redux/modules/filterMenu';
import { QueueList } from './QueueList';
import {
  validateAssignments,
  validateDateRange,
} from '../filter_menu/FilterMenuContainer';
import { context } from '../../redux/store';

const mapStateToProps = (state, props) => {
  const filter = getFilterByPath(state, props.location.pathname);
  return {
    filter,
    offset: state.queue.offset,
    limit: state.queue.limit,
    sortDirection: state.queue.sortDirection,
    groupDirection: state.queue.groupDirection,
    sortBy: filter && filter.sortBy,
    queueItems: (filter && state.queue.lists.get(filter)) || List(),
    isGrouped: filter && filter.groupBy !== '',
    statusMessage: filter && state.queue.statuses.get(filter),
    isMobile: state.app.layoutSize === 'small',
  };
};

const mapDispatchToProps = {
  openFilterMenu: filterMenuActions.open,
  showFilterMenuSection: filterMenuActions.showSection,
  fetchList: queueActions.fetchList,
  setSortDirection: queueActions.setSortDirection,
  setGroupDirection: queueActions.setGroupDirection,
  setOffset: queueActions.setOffset,
  gotoPrevPage: queueActions.gotoPrevPage,
  gotoNextPage: queueActions.gotoNextPage,
};

const SYSTEM_PROPERTIES_FOR_GROUPING = [
  'closedAt',
  'closedBy',
  'coreState',
  'createdAt',
  'createdBy',
  'submittedAt',
  'submittedBy',
  'type',
  'updatedAt',
  'updatedBy',
];

const SYSTEM_PROPERTIES_FOR_SORTING = ['closedAt', 'createdAt', 'updatedAt'];

const sortQueueItems = (items, filter, groupDirection, sortDirection) => {
  if (!filter) {
    return items;
  }
  if (filter.groupBy) {
    const getGroupByValue = SYSTEM_PROPERTIES_FOR_GROUPING.includes(
      filter.groupBy,
    )
      ? i => i[filter.groupBy]
      : i => i.values[filter.groupBy];
    const getSortByValue = SYSTEM_PROPERTIES_FOR_SORTING.includes(filter.sortBy)
      ? i => i[filter.sortBy]
      : i => i.values[filter.sortBy];
    return items.sortBy(
      item => [getGroupByValue(item) || '', getSortByValue(item) || ''],
      (a, b) => {
        if (a[0].localeCompare(b[0]) === 0) {
          return a[1].localeCompare(b[1]) * (sortDirection === 'DESC' ? -1 : 1);
        } else {
          return (
            a[0].localeCompare(b[0]) * (groupDirection === 'DESC' ? -1 : 1)
          );
        }
      },
    );
  } else {
    return sortDirection === 'DESC' ? items.reverse() : items;
  }
};

export const QueueListContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withProps(
    ({
      filter,
      sortDirection,
      groupDirection,
      queueItems,
      limit,
      offset,
      isGrouped,
    }) => {
      const items = sortQueueItems(
        queueItems,
        filter,
        groupDirection,
        sortDirection,
      )
        .skip(offset)
        .take(limit);

      return {
        hasPrevPage: offset !== 0,
        hasNextPage: queueItems.size > limit + offset,
        count: queueItems.size,
        pageCount: items.size,
        queueItems: isGrouped
          ? items.groupBy(
              SYSTEM_PROPERTIES_FOR_GROUPING.includes(filter.groupBy)
                ? i => i[filter.groupBy]
                : i => i.values[filter.groupBy],
            )
          : items,
        filterValidations: filter
          ? [validateAssignments, validateDateRange]
              .map(fn => fn(filter))
              .filter(v => v)
          : [],
      };
    },
  ),
  withHandlers({
    openFilterMenu: props => section => () => {
      props.openFilterMenu(props.filter);
      if (section) {
        props.showFilterMenuSection(section);
      }
    },
    toggleSortDirection: ({
      sortDirection,
      setSortDirection,
      setOffset,
    }) => () => {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
      setOffset(0);
    },
    toggleGroupDirection: ({
      groupDirection,
      setGroupDirection,
      setOffset,
    }) => () => {
      setGroupDirection(groupDirection === 'ASC' ? 'DESC' : 'ASC');
      setOffset(0);
    },
    refresh: ({ filter, fetchList, setOffset }) => () => {
      fetchList(filter);
      setOffset(0);
    },
    gotoPrevPage: ({ limit, offset, setOffset }) => () =>
      setOffset(offset - limit),
    gotoNextPage: ({ limit, offset, setOffset }) => () =>
      setOffset(offset + limit),
  }),
  lifecycle({
    componentWillMount() {
      this.loadFilter(this.props.filter, this.props.filterValidations);
    },
    componentWillReceiveProps(nextProps) {
      if (!is(this.props.filter, nextProps.filter)) {
        this.loadFilter(nextProps.filter, nextProps.filterValidations);
      }
    },
    loadFilter(filter, filterValidations) {
      if (filterValidations.length <= 0) {
        this.props.fetchList(filter);
        this.props.setOffset(0);
        this.props.setSortDirection('ASC');
        this.props.setGroupDirection('ASC');
      }
    },
  }),
)(QueueList);
