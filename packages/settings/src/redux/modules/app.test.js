import { List } from 'immutable';
import { State, actions, reducer } from './spaceApp';

describe('spaceApp redux module', () => {
  describe('reducers', () => {
    test('sets default state on init', () => {
      expect(reducer(undefined, { type: 'invalid' })).toEqual(State());
    });

    test('does not change state for default actions', () => {
      const state = State().set('discussionSearchTerm', 'something');

      expect(reducer(state, { type: 'invalid' })).toBe(state);
    });

    describe('FETCH_APP_SETTINGS', () => {
      test('sets appLoading', () => {
        const state = State().set('appLoading', false);
        expect(state.appLoading).toBeFalsy();
        const newState = reducer(state, actions.fetchAppSettings());
        expect(newState.appLoading).toBeTruthy();
      });
    });

    describe('SET_APP_SETTINGS', () => {
      let state;
      let newState;

      beforeEach(() => {
        state = State();
        newState = reducer(
          state,
          actions.setAppSettings({ spaceAdmins: ['A'] }),
        );
      });

      test('unsets appLoading', () => {
        expect(state.appLoading).toBeTruthy();
        expect(newState.appLoading).toBeFalsy();
      });

      test('sets space admins', () => {
        expect(state.spaceAdmins.size).toBe(0);
        expect(newState.spaceAdmins.size).toBe(1);
      });
    });

    describe('SEARCH_DISCUSSIONS', () => {
      test('sets discussionsLoading', () => {
        const state = State().set('discussionsLoading', false);
        expect(state.discussionsLoading).toBeFalsy();
        const newState = reducer(state, actions.searchDiscussions('abc'));
        expect(newState.discussionsLoading).toBeTruthy();
      });
    });

    describe('SET_DISCUSSIONS', () => {
      let state;
      let newState;

      beforeEach(() => {
        state = State();
        newState = reducer(state, actions.setDiscussions(['A']));
      });

      test('sets discussions', () => {
        expect(state.discussions.size).toBe(0);
        expect(newState.discussions.size).toBe(1);
      });
      test('unsets discussions errors', () => {
        state.set('discussionsError', 'abc');
        expect(state.discussionsError).toBeDefined();
        expect(newState.discussionsError).toBeNull();
      });
      test('unsets discussions loading', () => {
        state.set('discussionsLoading', true);
        expect(state.discussionsLoading).toBeTruthy();
        expect(newState.discussionsLoading).toBeFalsy();
      });
    });

    describe('SET_DISCUSSIONS_ERROR', () => {
      let state;
      let newState;

      beforeEach(() => {
        state = State().set('discussions', List(['a']));
        newState = reducer(state, actions.setDiscussionsError('A'));
      });

      test('resets discussions', () => {
        expect(state.discussions.size).toBe(1);
        expect(newState.discussions.size).toBe(0);
      });

      test('sets discussions errors', () => {
        expect(state.discussionsError).toBeNull();
        expect(newState.discussionsError).toBeDefined();
      });
      test('unsets discussions loading', () => {
        state.set('discussionsLoading', true);
        expect(state.discussionsLoading).toBeTruthy();
        expect(newState.discussionsLoading).toBeFalsy();
      });
    });
  });
});
