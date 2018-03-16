import { actions as modalFormActions } from 'kinops/src/redux/modules/modalForm';
import { actions as alertsActions } from 'kinops/src/redux/modules/alerts';
import {
  actions as toastsActions,
  types as toastsTypes,
} from 'kinops/src/redux/modules/toasts';
import { types as layoutTypes } from 'kinops/src/redux/modules/layout';

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
