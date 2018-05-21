import { List } from 'immutable';
import { State as AppState, getFilterByPath } from './queueApp';
import { State as QueueState } from './queue';
import { Filter } from '../../records';

const state = {
  queue: {
    queueApp: AppState({
      filters: List([Filter({ name: 'Mine' }), Filter({ name: 'Teammates' })]),
      myFilters: List([
        Filter({ name: 'Facilities Teammates' }),
        Filter({ name: 'Everything' }),
      ]),
    }),
    queue: QueueState({
      adhocFilter: Filter({ name: 'Adhoc' }),
    }),
  },
};

describe('getFilterByPath', () => {
  describe('matches adhoc filter', () => {
    it('should return the adhocFilter property from queue state', () => {
      expect(getFilterByPath(state, '/kapps/q/adhoc').name).toBe('Adhoc');
      expect(getFilterByPath(state, '/kapps/q/adhoc/foo/bar').name).toBe(
        'Adhoc',
      );
    });
  });

  describe('matches custom filter', () => {
    it('should return the custom filter with matching name', () => {
      expect(getFilterByPath(state, '/kapps/q/custom/Everything').name).toBe(
        'Everything',
      );
      expect(getFilterByPath(state, '/kapps/q/custom/Everything/').name).toBe(
        'Everything',
      );
      expect(
        getFilterByPath(state, '/kapps/q/custom/Everything/foo/bar').name,
      ).toBe('Everything');
    });
  });

  describe('matches default filter', () => {
    it('should return the default filter with matching name', () => {
      expect(getFilterByPath(state, '/kapps/q/list/Mine').name).toBe('Mine');
    });
    it('should return the default filter with matching name', () => {
      expect(getFilterByPath(state, '/kapps/q/list/Mine/').name).toBe('Mine');
    });
    it('should return the default filter with matching name', () => {
      expect(getFilterByPath(state, '/kapps/q/list/Mine/foo/bar').name).toBe(
        'Mine',
      );
    });
  });

  describe('does not match any filter type', () => {
    it('returns undefined', () => {
      expect(getFilterByPath(state, '/kapps/q/')).toBeUndefined();
      expect(getFilterByPath(state, '/kapps/q/x')).toBeUndefined();
      expect(getFilterByPath(state, '/kapps/q/list')).toBeUndefined();
      expect(getFilterByPath(state, '/kapps/q/list/other')).toBeUndefined();
      expect(getFilterByPath(state, '/kapps/q/custom')).toBeUndefined();
      expect(getFilterByPath(state, '/kapps/q/custom/other')).toBeUndefined();
    });
  });
});
