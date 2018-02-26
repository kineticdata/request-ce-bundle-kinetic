import { Record } from 'immutable';
import { LOCATION_CHANGE } from 'connected-react-router';
import { namespace, withPayload } from 'common/utils';

export const types = {
  SET_SIZE: namespace('layout', 'SET_SIZE'),
  SET_SIDEBAR_OPEN: namespace('layout', 'SET_SIDEBAR_OPEN'),
  SET_LIMITED_SIDEBAR_OPEN: namespace('layout', 'SET_LIMITED_SIDEBAR_OPEN'),
};

export const actions = {
  setSize: withPayload(types.SET_SIZE),
  setSidebarOpen: payload => ({ type: types.SET_SIDEBAR_OPEN, payload }),
  setLimitedSidebarOpen: payload => ({
    type: types.SET_LIMITED_SIDEBAR_OPEN,
    payload,
  }),
};

export const State = Record({
  size: 'small',
  sidebarOpen: true,
  // There are some pages where we want the sidebar to be less of a focus in the
  // user interface (the home page of the services kapp is one example). The
  // limitedSidebarOpen state tracks whether or not the sidebar should be open
  // on these kinds of pages. It defaults to false and needs to be opened
  // manually, then if the sidebar is closed from another page we assume that
  // the sidebar on these types of pages should also then be closed (all of that
  // logic is implemented in the reducer below).
  limitedSidebarOpen: false,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_SIZE:
      return state.set('size', payload);
    case types.SET_SIDEBAR_OPEN:
      return (
        state
          .set('sidebarOpen', payload)
          // if we are closing the sidebar from regular pages we assume that we
          // should also close the sidebar for the "limited" pages as well.
          .set(
            'limitedSidebarOpen',
            !payload ? payload : state.limitedSidebarOpen,
          )
      );
    case types.SET_LIMITED_SIDEBAR_OPEN:
      return (
        state
          .set('limitedSidebarOpen', payload)
          // if we are openening the sidebar from the "limited" page we assume
          // that we should also open the sidebar for the regular pages as well.
          .set('sidebarOpen', payload ? payload : state.sidebarOpen)
      );
    case LOCATION_CHANGE:
      return state.size === 'small' ? state.set('sidebarOpen', false) : state;
    default:
      return state;
  }
};
