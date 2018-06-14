import { actions as alertsActions } from 'app/src/redux/modules/alerts';
import { actions as layoutActions } from 'app/src/redux/modules/layout';
import { types as layoutTypes } from 'app/src/redux/modules/layout';
import * as Utils from '../../utils';

// Discussion Server
export const selectDiscussionsEnabled = state =>
  state.app.space &&
  Utils.getAttributeValue(state.app.space, 'Discussion Server Url', null) ===
    null
    ? false
    : true;

export const types = {
  ...layoutTypes,
};

export const actions = {
  ...alertsActions,
  ...layoutActions,
};
