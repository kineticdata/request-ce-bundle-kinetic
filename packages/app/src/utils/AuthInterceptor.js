import axios from 'axios';

export default class AuthInterceptor {
  constructor(
    store,
    unauthenticatedAction,
    authenticatedSelector,
    cancelledSelector,
  ) {
    this.store = store;
    this.unauthenticatedAction = unauthenticatedAction;
    this.authenticatedSelector = authenticatedSelector;
    this.cancelledSelector = cancelledSelector;
    this.authPromise = null;
    this.handleRejected = this.handleRejected.bind(this);
  }

  authenticate() {
    this.store.dispatch(this.unauthenticatedAction());
    if (
      this.authenticatedSelector(this.store.getState()) ||
      this.cancelledSelector(this.store.getState())
    ) {
      console.error(
        'AuthInterceptor found invalid state when handling unauthenticated ' +
          'response. The selectors given (authenticated and cancelled) should ' +
          'both return false initially and then return true once the user has ' +
          'successfully authenticated or cancelled respectively.',
      );
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      const unsub = this.store.subscribe(() => {
        if (this.authenticatedSelector(this.store.getState())) {
          unsub();
          resolve();
        } else if (
          this.cancelledSelector &&
          this.cancelledSelector(this.store.getState())
        ) {
          unsub();
          reject();
        }
      });
    });
  }

  handleRejected(error) {
    if (
      error.response.status === 401 &&
      !error.response.config.__bypassAuthInterceptor
    ) {
      if (!this.authPromise) {
        this.authPromise = this.authenticate();
        this.authPromise.finally(() => {
          this.authPromise = null;
        });
      }
      return new Promise((resolve, reject) => {
        this.authPromise
          .then(() => {
            axios(error.response.config)
              .then(resolve)
              .catch(reject);
          })
          .catch(() => {
            reject(error);
          });
      });
    } else {
      return Promise.reject(error);
    }
  }
}
