import { Record, Map, List } from 'immutable';
import { Utils } from 'common';
import { Filter, AssignmentCriteria } from '../../records';
import { buildFilterPath } from './queueApp';
import { getSubmissionDate } from '../sagas/queue';
import moment from 'moment';

const { namespace, withPayload, noPayload } = Utils;

export const types = {
  SET_ADHOC_FILTER: namespace('queue', 'SET_ADHOC_FILTER'),
  FETCH_CURRENT_ITEM: namespace('queue', 'FETCH_CURRENT_ITEM'),
  SET_CURRENT_ITEM: namespace('queue', 'SET_CURRENT_ITEM'),
  UPDATE_QUEUE_ITEM: namespace('queue', 'UPDATE_QUEUE_ITEM'),
  FETCH_LIST: namespace('queue', 'FETCH_LIST'),
  SET_LIST_ITEMS: namespace('queue', 'SET_LIST_ITEMS'),
  SET_LIST_STATUS: namespace('queue', 'SET_LIST_STATUS'),
  SET_SORT_DIRECTION: namespace('queue', 'SET_SORT_DIRECTION'),
  SET_GROUP_DIRECTION: namespace('queue', 'SET_GROUP_DIRECTION'),
  OPEN_PREVIEW: namespace('queue', 'OPEN_PREVIEW'),
  CLOSE_PREVIEW: namespace('queue', 'CLOSE_PREVIEW'),
  OPEN_NEW_MENU: namespace('queue', 'OPEN_NEW_MENU'),
  CLOSE_NEW_MENU: namespace('queue', 'CLOSE_NEW_MENU'),
  SET_OFFSET: namespace('queue', 'SET_OFFSET'),
};

export const actions = {
  setAdhocFilter: withPayload(types.SET_ADHOC_FILTER),
  fetchCurrentItem: withPayload(types.FETCH_CURRENT_ITEM),
  setCurrentItem: withPayload(types.SET_CURRENT_ITEM),
  updateQueueItem: withPayload(types.UPDATE_QUEUE_ITEM),
  fetchList: withPayload(types.FETCH_LIST),
  setListItems: (filter, list) => ({
    type: types.SET_LIST_ITEMS,
    payload: { filter, list },
  }),
  setListStatus: (filter, status) => ({
    type: types.SET_LIST_STATUS,
    payload: { filter, status },
  }),
  setSortDirection: withPayload(types.SET_SORT_DIRECTION),
  setGroupDirection: withPayload(types.SET_GROUP_DIRECTION),
  openPreview: withPayload(types.OPEN_PREVIEW),
  closePreview: noPayload(types.CLOSE_PREVIEW),
  openNewItemMenu: withPayload(types.OPEN_NEW_MENU),
  closeNewItemMenu: noPayload(types.CLOSE_NEW_MENU),
  setOffset: withPayload(types.SET_OFFSET),
};

export const selectPrevAndNext = (state, filter) => {
  const queueItems = state.queue.queue.lists.get(filter) || List();
  const currentItemIndex = queueItems.findIndex(
    item => item.id === state.queue.queue.currentItem.id,
  );
  const prevItem =
    currentItemIndex > 0 ? queueItems.get(currentItemIndex - 1).id : null;
  const nextItem =
    currentItemIndex < queueItems.size - 1
      ? queueItems.get(currentItemIndex + 1).id
      : null;
  const filterPath = buildFilterPath(filter);
  return {
    prev: prevItem && `${filterPath}/item/${prevItem}`,
    next: nextItem && `${filterPath}/item/${nextItem}`,
  };
};

export const selectGroupedQueueItems = (state, filter) => {
  const groupedBy = filter.groupBy;
  const queueItems = state.queue.queue.lists.get(filter) || List();
  return queueItems
    .sort(
      (s1, s2) =>
        moment(getSubmissionDate(s1, groupedBy)).isBefore(
          getSubmissionDate(s2, groupedBy),
        )
          ? 1
          : moment(getSubmissionDate(s1, groupedBy)).isAfter(
              getSubmissionDate(s2, groupedBy),
            )
            ? -1
            : 0,
    )
    .reverse()
    .groupBy(submission =>
      moment(getSubmissionDate(submission, groupedBy)).calendar(),
    );
};

export const State = Record({
  sortDirection: 'ASC',
  groupDirection: 'ASC',
  currentItem: null,
  currentItemLoading: false,
  adhocFilter: Filter({
    type: 'adhoc',
    assignments: AssignmentCriteria({ mine: true }),
  }),
  lists: Map(),
  statuses: Map(),
  newItemMenuOpen: false,
  newItemMenuOptions: Map(),

  // List pagination
  offset: 0,
  limit: 10,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_ADHOC_FILTER:
      return state.set('adhocFilter', payload);
    case types.SET_LIST_ITEMS:
      return state
        .setIn(['lists', payload.filter], List(payload.list))
        .setIn(['statuses', payload.filter], null);
    case types.SET_LIST_STATUS:
      return state.setIn(['statuses', payload.filter], payload.status);
    case types.FETCH_CURRENT_ITEM:
      return state.set('currentItemLoading', true);
    case types.SET_CURRENT_ITEM:
      return state.set('currentItemLoading', false).set('currentItem', payload);
    case types.SET_SORT_DIRECTION:
      return state.set('sortDirection', payload);
    case types.SET_GROUP_DIRECTION:
      return state.set('groupDirection', payload);
    case types.OPEN_NEW_MENU:
      return state
        .set('newItemMenuOpen', true)
        .set('newItemMenuOptions', Map(payload));
    case types.CLOSE_NEW_MENU:
      return state.set('newItemMenuOpen', false).remove('newItemMenuOptions');
    case types.SET_OFFSET:
      return state.set('offset', payload);
    default:
      return state;
  }
};
