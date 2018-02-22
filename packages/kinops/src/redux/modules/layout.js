import { Map } from 'immutable';
import { namespace, noPayload, withPayload } from 'common/utils';

export const types = {
  SET_SIZE: namespace('layout', 'SET_SIZE'),
};

export const actions = {
  setSize: withPayload(types.SET_SIZE),
};

export const defaultState = Map({
  size: 'small',
});

export const reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.SET_SIZE:
      return state.set('size', payload);
    default:
      return state;
  }
};

// Add global listeners
export const createLayoutListeners = store =>
  [
    ['small', window.matchMedia('(max-width: 767px)')],
    ['medium', window.matchMedia('(min-width: 768px) and (max-width: 1200px)')],
    ['large', window.matchMedia('(min-width: 1201px)')],
  ].forEach(([size, mql]) => {
    mql.addListener(event => {
      if (event.matches) {
        store.dispatch(actions.setSize(size));
      }
    });
    if (mql.matches) {
      store.dispatch(actions.setSize(size));
    }
  });
