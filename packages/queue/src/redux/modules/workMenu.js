import { Record } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload } = Utils;

export const types = {
  OPEN_WORK_MENU: namespace('workMenu', 'OPEN_WORK_MENU'),
  CLOSE_WORK_MENU: namespace('workMenu', 'CLOSE_WORK_MENU'),
};

export const actions = {
  openWorkMenu: (queueItem, onWorked) => ({
    type: types.OPEN_WORK_MENU,
    payload: { queueItem, onWorked },
  }),
  closeWorkMenu: noPayload(types.CLOSE_WORK_MENU),
};

export const State = Record({
  queueItem: null,
  onWorked: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.OPEN_WORK_MENU:
      return State(payload);
    case types.CLOSE_WORK_MENU:
      return State();
    default:
      return state;
  }
};
