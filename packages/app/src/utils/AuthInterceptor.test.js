import AuthInterceptor from './AuthInterceptor';
import axios from 'axios';
jest.mock('axios');

let store;
const unauthenticatedAction = () => ({ type: 'TIMED_OUT' });
const authenticatedSelector = state => state.authenticated;
const cancelledSelector = state => state.cancelled;

describe('AuthInterceptor', () => {
  beforeEach(() => {
    store = {
      state: { authenticated: false, cancelled: false },
      getState() {
        return this.state;
      },
      dispatch(action) {
        this.actions.push(action);
      },
      subscribe(listener) {
        this.listeners.push(listener);
        return () => {
          this.listeners = this.listeners.filter(l => l !== listener);
        };
      },
      actions: [],
      listeners: [],
    };
    axios.mockReset();
  });

  describe('constructor', () => {
    test('sets properties', () => {
      const authInterceptor = new AuthInterceptor(
        store,
        unauthenticatedAction,
        authenticatedSelector,
        cancelledSelector,
      );
      expect(authInterceptor.store).toBe(store);
      expect(authInterceptor.unauthenticatedAction).toBe(unauthenticatedAction);
      expect(authInterceptor.authenticatedSelector).toBe(authenticatedSelector);
      expect(authInterceptor.cancelledSelector).toBe(cancelledSelector);
    });

    test('autPromise should be null', () => {
      const authInterceptor = new AuthInterceptor(
        store,
        unauthenticatedAction,
        authenticatedSelector,
        cancelledSelector,
      );
      expect(authInterceptor.authPromise).toBeNull();
    });
  });

  describe('handleRejected', () => {
    test('returns rejected promise with the given error if not 401', async () => {
      const authInterceptor = new AuthInterceptor(
        store,
        unauthenticatedAction,
        authenticatedSelector,
        cancelledSelector,
      );
      const error = { response: { status: 400 } };
      await expect(authInterceptor.handleRejected(error)).rejects.toBe(error);
      expect(authInterceptor.authPromise).toBeNull();
    });

    test('performs authentication workflow with successful login', async () => {
      const authInterceptor = new AuthInterceptor(
        store,
        unauthenticatedAction,
        authenticatedSelector,
        cancelledSelector,
      );
      // Mock an axios return value.
      axios.mockReturnValue(Promise.resolve('Hello World'));
      // Make a call to handleRejected that will trigger the auth functionality.
      const error = { response: { status: 401, config: { url: 'foo' } } };
      const rejectedCall = authInterceptor.handleRejected(error);
      // It should dispatch the redux action using the action creator passed to
      // the controller and start to listen to the store for success or cancel.
      expect(store.actions).toEqual([{ type: 'TIMED_OUT' }]);
      expect(store.listeners.length).toBe(1);
      expect(authInterceptor.authPromise).not.toBeNull();
      // Simulate cancel and call the listener.
      store.state.authenticated = true;
      store.listeners[0]();
      // The promse should be rejected with the original error object.  Also
      // ensure that axios is not called and that the listener is unsubscribed.
      await expect(rejectedCall).resolves.toBe('Hello World');
      expect(axios.mock.calls).toEqual([[{ url: 'foo' }]]);
      expect(store.listeners.length).toBe(0);
      expect(authInterceptor.authPromise).toBeNull();
    });

    test('performs authentication workflow with cancelled login', async () => {
      const authInterceptor = new AuthInterceptor(
        store,
        unauthenticatedAction,
        authenticatedSelector,
        cancelledSelector,
      );
      // Make a call to handleRejected that will trigger the auth functionality.
      const error = { response: { status: 401, config: { url: 'foo' } } };
      const rejectedCall = authInterceptor.handleRejected(error);
      // It should dispatch the redux action using the action creator passed to
      // the controller and start to listen to the store for success or cancel.
      expect(store.actions).toEqual([{ type: 'TIMED_OUT' }]);
      expect(store.listeners.length).toBe(1);
      expect(authInterceptor.authPromise).not.toBeNull();
      // Simulate cancel and call the listener.
      store.state.cancelled = true;
      store.listeners[0]();
      // The promse should be rejected with the original error object.  Also
      // ensure that axios is not called and that the listener is unsubscribed.
      await expect(rejectedCall).rejects.toBe(error);
      expect(axios.mock.calls).toEqual([]);
      expect(store.listeners.length).toBe(0);
      expect(authInterceptor.authPromise).toBeNull();
    });

    test('creates one authPromise for multiple calls', async () => {
      const authInterceptor = new AuthInterceptor(
        store,
        unauthenticatedAction,
        authenticatedSelector,
        cancelledSelector,
      );
      // Should be null initially.
      expect(authInterceptor.authPromise).toBeNull();
      // Call handleRejected with the error object, should return a promise.
      const error = { response: { status: 401, config: { url: 'foo' } } };
      authInterceptor.handleRejected(error);
      // Should now be set after a call to handleRejected.
      const authPromise1 = authInterceptor.authPromise;
      expect(authPromise1).not.toBeNull();
      // Second call to handleRejected should not change the value of the
      // authPromise.
      authInterceptor.handleRejected(error);
      const authPromise2 = authInterceptor.authPromise;
      expect(authPromise1).toBe(authPromise2);
    });

    test('returns original error if authenticated selector returns true initially', async () => {
      const authInterceptor = new AuthInterceptor(
        store,
        unauthenticatedAction,
        authenticatedSelector,
        cancelledSelector,
      );
      const error = { response: { status: 401, config: { url: 'foo' } } };
      store.state.authenticated = true;
      await expect(authInterceptor.handleRejected(error)).rejects.toBe(error);
      expect(authInterceptor.authPromise).toBeNull();
    });

    test('returns original error if cancelled selector returns true initially', async () => {
      const authInterceptor = new AuthInterceptor(
        store,
        unauthenticatedAction,
        authenticatedSelector,
        cancelledSelector,
      );
      const error = { response: { status: 401, config: { url: 'foo' } } };
      store.state.cancelled = true;
      await expect(authInterceptor.handleRejected(error)).rejects.toBe(error);
      expect(authInterceptor.authPromise).toBeNull();
    });
  });
});
