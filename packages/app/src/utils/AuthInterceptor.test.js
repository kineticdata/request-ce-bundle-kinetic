import AuthInterceptor from './AuthInterceptor';
import axios from 'axios';
jest.mock('axios');

const store = {
  state: { authenticated: false, cancelled: false },
  getState() {
    return this.state;
  },
  dispatch: jest.fn(),
  subscribe: jest.fn(),
};
const unauthenticatedAction = () => ({ type: 'TIMED_OUT' });
const authenticatedSelector = state => state.authenticated;
const cancelledSelector = state => state.cancelled;

describe('AuthInterceptor', () => {
  beforeEach(() => {
    store.state = { authenticated: false, cancelled: false };
    store.dispatch.mockReset();
    store.subscribe.mockReset();
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
      // Define the error that triggers the auth functionality.
      const error = { response: { status: 401, config: { url: 'foo' } } };
      // Create a mock unsub function that should be called once once the
      // authPromise gets resolved.
      const unsub = jest.fn();
      // Mock the store subscribe function to return the unsub value above.
      store.subscribe.mockImplementation(() => unsub);
      // Call handleRejected with the error object, should return a promise.
      const rejectedCall = authInterceptor.handleRejected(error);
      // The authIntercetpor should subscribe to the store to determine when
      // successful authentication has occurred.
      expect(store.subscribe.mock.calls.length).toBe(1);
      // Get the listener from the subscription so we can call it.
      const listener = store.subscribe.mock.calls[0][0];
      // Mutate the state so that the authInterceptor continues (given the
      // selectors defined at the top of the file).
      store.state.authenticated = true;
      // Invoke the listener which should trigger the authInterceptor to
      // continue.
      axios.mockReturnValue(Promise.resolve('Hello World'));
      listener();
      // It should unsubscribe.
      expect(unsub.mock.calls).toEqual([[]]);
      // Finally the rejectedCall promise should eventually resolve to the mock
      // axios value.
      await expect(rejectedCall).resolves.toBe('Hello World');
      expect(axios.mock.calls).toEqual([[{ url: 'foo' }]]);
    });

    test('performs authentication workflow with cancelled login', async () => {
      const authInterceptor = new AuthInterceptor(
        store,
        unauthenticatedAction,
        authenticatedSelector,
        cancelledSelector,
      );
      // Define the error that triggers the auth functionality.
      const error = { response: { status: 401, config: { url: 'foo' } } };
      // Create a mock unsub function that should be called once once the
      // authPromise gets resolved.
      const unsub = jest.fn();
      // Mock the store subscribe function to return the unsub value above.
      store.subscribe.mockImplementation(() => unsub);
      // Call handleRejected with the error object, should return a promise.
      const rejectedCall = authInterceptor.handleRejected(error);
      // The authIntercetpor should subscribe to the store to determine when
      // successful authentication has occurred.
      expect(store.subscribe.mock.calls.length).toBe(1);
      // Get the listener from the subscription so we can call it.
      const listener = store.subscribe.mock.calls[0][0];
      // Mutate the state so that the authInterceptor continues (given the
      // selectors defined at the top of the file).
      store.state.cancelled = true;
      // Invoke the listener which should trigger the authInterceptor to
      // continue.
      listener();
      // It should unsubscribe.
      expect(unsub.mock.calls).toEqual([[]]);
      // Finally the rejectedCall promise should eventually resolve to the mock
      // axios value.
      await expect(rejectedCall).rejects.toEqual({
        response: { status: 401, config: { url: 'foo' } },
      });
      expect(axios.mock.calls).toEqual([]);
    });
  });
});
