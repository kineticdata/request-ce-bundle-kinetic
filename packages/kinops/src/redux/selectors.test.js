import { selectCurrentKapp } from './selectors';

describe('selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      kinops: {
        loading: false,
        kapps: [{ slug: 'this-kapp' }],
        kappSlug: 'this-kapp',
      },
    };
  });

  describe('#selectCurrentKapp', () => {
    it('returns the current kapp', () => {
      expect(selectCurrentKapp(state)).toBe(state.kinops.kapps[0]);
    });

    it('returns null when loading', () => {
      state.kinops.loading = true;
      expect(selectCurrentKapp(state)).toBeNull();
    });

    it('returns null when there is no current kapp', () => {
      state.kinops.kappSlug = null;
      expect(selectCurrentKapp(state)).toBeNull();
    });
  });
});
