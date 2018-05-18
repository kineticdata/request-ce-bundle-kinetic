import axios from 'axios';

// What happens when you try to re-auth with bad credentials

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
    if (error.response.status === 401) {
      if (!this.authPromise) {
        this.authPromise = this.authenticate();
        this.authPromise
          .then(() => {
            this.authPromise = null;
          })
          .catch(() => {
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
