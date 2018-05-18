import { selectCurrentKapp } from './selectors';

describe('selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      app: {
        app: {
          loading: false,
          kapps: [{ slug: 'this-kapp' }],
          kappSlug: 'this-kapp',
        },
      },
    };
  });

  describe('#selectCurrentKapp', () => {
    it('returns the current kapp', () => {
      expect(selectCurrentKapp(state)).toBe(state.app.kapps[0]);
    });

    it('returns null when loading', () => {
      state.app.loading = true;
      expect(selectCurrentKapp(state)).toBeNull();
    });

    it('returns null when there is no current kapp', () => {
      state.app.config.kappSlug = null;
      expect(selectCurrentKapp(state)).toBeNull();
    });
  });
});
