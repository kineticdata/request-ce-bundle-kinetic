import { selectCurrentKapp } from './selectors';

describe('selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      kinops: {
        loading: false,
        kapps: [{ slug: 'this-kapp' }],
      },
    };
  });

  describe('#selectCurrentKapp', () => {
    it('returns the current kapp', () => {
      global.bundle.kappSlug = () => 'this-kapp';

      expect(selectCurrentKapp(state)).toBe(state.kinops.kapps[0]);
    });

    it('returns null when loading', () => {
      state.kinops.loading = true;
      global.bundle.kappSlug = () => 'this-kapp';

      expect(selectCurrentKapp(state)).toBeNull();
    });

    it('returns null when there is no current kapp', () => {
      global.bundle.kappSlug = () => '';

      expect(selectCurrentKapp(state)).toBeNull();
    });
  });
});
