import { actions as modalFormActions } from 'kinops/src/redux/modules/modalForm';
import { actions as alertsActions } from 'kinops/src/redux/modules/alerts';
import { actions as toastsActions } from 'kinops/src/redux/modules/toasts';

export const actions = {
  openForm: modalFormActions.openForm,
  fetchALerts: alertsActions.fetchAlerts,
  addSuccess: toastsActions.addSuccess,
};
