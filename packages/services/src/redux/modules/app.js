import { Record } from 'immutable';
import { LayoutModule } from 'react-kinops-common';
import { LOCATION_CHANGE } from 'connected-react-router';

export const types = {
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_HOME_SIDEBAR_OPEN: 'SET_HOME_SIDEBAR_OPEN',
};

export const actions = {
  setSidebarOpen: payload => ({ type: types.SET_SIDEBAR_OPEN, payload }),
  setHomeSidebarOpen: payload => ({
    type: types.SET_HOME_SIDEBAR_OPEN,
    payload,
  }),
};

const State = Record({
  layoutSize: 'small',
  sidebarOpen: true,
  homeSidebarOpen: false,
});

const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case LayoutModule.types.SET_SIZE:
      return state.set('layoutSize', payload);
    case types.SET_SIDEBAR_OPEN:
      return (
        state
          .set('sidebarOpen', payload)
          // if we are closing the sidebar from non-home pages we assume that we
          // should also close the sidebar for the home page as well.
          .set('homeSidebarOpen', !payload ? payload : state.homeSidebarOpen)
      );
    case types.SET_HOME_SIDEBAR_OPEN:
      return (
        state
          .set('homeSidebarOpen', payload)
          // if we are openening the sidebar from the home page we assume that we
          // shoudl also open teh sidebar for the non-home pages as well.
          .set('sidebarOpen', payload ? payload : state.sidebarOpen)
      );
    case LOCATION_CHANGE:
      return state.layoutSize === 'small'
        ? state.set('sidebarOpen', false)
        : state;
    default:
      return state;
  }
};

export default reducer;
