import { List, Map } from 'immutable';
import * as matchers from 'jest-immutable-matchers';
import { reducer, actions, State } from './queue';
import { Filter } from '../../records';

beforeEach(() => jest.addMatchers(matchers));

describe('reducer', () => {
  describe('INIT', () => {
    test('sets to State()', () => {
      expect(reducer(undefined, {})).toEqualImmutable(State());
    });
  });

  describe('SET_ADHOC_FILTER', () => {
    test('sets adhocFilter to the payload value', () => {
      const state = State({ adhocFilter: Filter() });
      const filter = Filter();
      const action = actions.setAdhocFilter(filter);
      expect(reducer(state, action).adhocFilter).toBe(filter);
    });
  });

  describe('SET_LIST_ITEMS', () => {
    test('sets value in lists using the filter as the key statuses to null', () => {
      const filter1 = Filter({ name: 'Filter 1' });
      const filter2 = Filter({ name: 'Filter 2' });
      const state = State({
        lists: Map([[filter1, List()], [filter2, List()]]),
        statuses: Map([[filter1, 'error'], [filter2, 'error']]),
        previewItem: null,
      });
      const queueItems = [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }];
      const action = actions.setListItems(filter1, queueItems);
      expect(reducer(state, action).lists).toEqualImmutable(
        Map([[filter1, List(queueItems)], [filter2, List()]]),
      );
      expect(reducer(state, action).statuses.get(filter1)).toBeNull();
    });
  });

  describe('SET_LIST_STATUS', () => {
    test('sets statuses entry for the filter to the payload status value', () => {
      const filter = Filter({ name: 'Filter' });
      const state = State();
      const action = actions.setListStatus(filter, 'Failed');
      expect(reducer(state, action).statuses.get(filter)).toEqual('Failed');
    });
  });

  describe('FETCH_CURRENT_ITEM', () => {
    test('sets currentItemLoading to true', () => {
      const state = State({ currentItemLoading: false });
      const action = actions.fetchCurrentItem('abc123');
      expect(reducer(state, action).currentItemLoading).toEqual(true);
    });
  });

  describe('SET_CURRENT_ITEM', () => {
    test('sets currentItemLoading to false and sets currentItem to the payload value', () => {
      const state = State({ currentItemLoading: true });
      const queueItem = {};
      const action = actions.setCurrentItem(queueItem);
      expect(reducer(state, action).currentItemLoading).toEqual(false);
      expect(reducer(state, action).currentItem).toBe(queueItem);
    });
  });

  describe('SET_SORT_DIRECTION', () => {
    test('sets sortDirection to the payload value', () => {
      const state = State({ sortDirection: 'DESC' });
      const action = actions.setSortDirection('ASC');
      expect(reducer(state, action).sortDirection).toEqual('ASC');
    });
  });

  describe('SET_OFFSET', () => {
    test('sets offset to the payload value', () => {
      const state = State({ offset: 0 });
      const action = actions.setOffset(10);
      expect(reducer(state, action).offset).toEqual(10);
    });
  });

  describe('OPEN_NEW_MENU', () => {
    test('sets newItemMenuOpen to true and newItemMenuOptions to payload value', () => {
      const state = State({
        newItemMenuOpen: false,
        newItemMenuOptions: Map(),
      });
      const menuOptions = {
        fname: 'Shayne',
        lname: 'Koestler',
      };
      const action = actions.openNewItemMenu(menuOptions);
      expect(reducer(state, action).newItemMenuOpen).toEqual(true);
      expect(reducer(state, action).newItemMenuOptions).toEqualImmutable(
        Map(menuOptions),
      );
    });
  });

  describe('CLOSE_NEW_MENU', () => {
    test('sets newItemMenuOpen to false and newItemMenuOptions to an empty Map', () => {
      const state = State({
        newItemMenuOpen: true,
        newItemMenuOptions: Map({
          fname: 'Shayne',
          lname: 'Koestler',
        }),
      });
      const action = actions.closeNewItemMenu();
      expect(reducer(state, action).newItemMenuOpen).toEqual(false);
      expect(reducer(state, action).newItemMenuOptions).toEqualImmutable(Map());
    });
  });
});
