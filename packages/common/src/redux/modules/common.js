import { actions as modalFormActions } from 'kinops/src/redux/modules/modalForm';
import { actions as alertsActions } from 'kinops/src/redux/modules/alerts';
import {
  actions as toastsActions,
  types as toastsTypes,
} from 'kinops/src/redux/modules/toasts';
import { types as layoutTypes } from 'kinops/src/redux/modules/layout';
import { getAttributeValue } from '../../../utils';

// Discussion Server
export const selectDiscussionsEnabled = state =>
  state.kinops.space &&
  getAttributeValue(state.kinops.space, 'Discussion Server Url', null) === null
    ? false
    : true;

export const actions = {
  openForm: modalFormActions.openForm,
  fetchAlerts: alertsActions.fetchAlerts,
  addInfo: toastsActions.addInfo,
  addNormal: toastsActions.addNormal,
  addSuccess: toastsActions.addSuccess,
  addWarn: toastsActions.addWarn,
  addError: toastsActions.addError,
};

export const types = {
  ...toastsTypes,
  ...layoutTypes,
};
