import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { is, List } from 'immutable';
import { getFilterByPath } from '../../redux/modules/queueApp';
import {
  actions as queueActions,
  selectGroupedQueueItems,
} from '../../redux/modules/queue';
import { actions as filterMenuActions } from '../../redux/modules/filterMenu';
import { QueueList } from './QueueList';

const mapStateToProps = (state, props) => {
  const filter = getFilterByPath(state, props.location.pathname);
  return {
    filter,
    isExact: props.match.isExact,
    offset: state.queue.queue.offset,
    limit: state.queue.queue.limit,
    sortDirection: state.queue.queue.sortDirection,
    groupDirection: state.queue.queue.groupDirection,
    sortBy: filter && filter.sortBy,
    queueItems: filter && (state.queue.queue.lists.get(filter) || List()),
    isGrouped: filter && filter.groupBy !== '',
    groupedQueueItems:
      filter &&
      filter.groupedBy !== '' &&
      selectGroupedQueueItems(state, filter),
    statusMessage: filter && state.queue.queue.statuses.get(filter),
  };
};

const mapDispatchToProps = {
  openFilterMenu: filterMenuActions.open,
  fetchList: queueActions.fetchList,
  setSortDirection: queueActions.setSortDirection,
  setGroupDirection: queueActions.setGroupDirection,
  setOffset: queueActions.setOffset,
  gotoPrevPage: queueActions.gotoPrevPage,
  gotoNextPage: queueActions.gotoNextPage,
};

export const QueueListContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(
    ({
      sortDirection,
      groupDirection,
      queueItems,
      limit,
      offset,
      isGrouped,
      groupedQueueItems,
    }) => {
      let items;
      if (isGrouped) {
        if (groupDirection === 'DESC') {
          items = groupedQueueItems.reverse();
        } else {
          items = groupedQueueItems;
        }
        if (sortDirection === 'DESC') {
          items = items.map(groupedItemList => groupedItemList.reverse());
        }
      } else {
        items = (sortDirection === 'DESC' ? queueItems.reverse() : queueItems)
          .skip(offset)
          .take(limit);
      }
      // const items = isGrouped
      //   ? groupDirection === 'DESC'
      //     ? groupedQueueItems.reverse()
      //     : groupedQueueItems
      //   : (sortDirection === 'DESC' ? queueItems.reverse() : queueItems)
      //       .skip(offset)
      //       .take(limit);

      return {
        hasPrevPage: offset !== 0,
        hasNextPage: queueItems.size > limit + offset,
        count: queueItems.size,
        queueItems: items,
      };
    },
  ),
  withHandlers({
    openFilterMenu: props => () => props.openFilterMenu(props.filter),
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
      this.loadFilter(this.props.filter);
    },
    componentWillReceiveProps(nextProps) {
      if (!is(this.props.filter, nextProps.filter)) {
        this.loadFilter(nextProps.filter);
      }
    },
    loadFilter(filter) {
      this.props.fetchList(filter);
      this.props.setOffset(0);
      this.props.setSortDirection('ASC');
      this.props.setGroupDirection('ASC');
    },
  }),
)(QueueList);
