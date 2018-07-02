import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import { CoreAPI, bundle } from 'react-kinetic-core';
import { toastActions } from 'common';
import { actions, types } from '../modules/settingsCategories';

export function* updateCategoriesSaga(action) {
  const currentForm = action.payload.form;
  const currentFormChanges = action.payload.inputs;
  const formContent = {
    attributesMap: {
      Icon: [currentFormChanges.icon],
      'Task Form Slug': currentFormChanges['Task Form Slug']
        ? [currentFormChanges['Task Form Slug']]
        : [],
      'Service Days Due': currentFormChanges['Service Days Due']
        ? [currentFormChanges['Service Days Due']]
        : [],
      'Approval Form Slug': currentFormChanges['Approval Form Slug']
        ? [currentFormChanges['Approval Form Slug']]
        : [],
      'Task Form Slug': currentFormChanges['Task Form Slug']
        ? [currentFormChanges['Task Form Slug']]
        : [],
      Approver: currentFormChanges.Approver
        ? [currentFormChanges.Approver]
        : [],
      'Task Assignee Team': currentFormChanges['Task Assignee Team']
        ? [currentFormChanges['Task Assignee Team']]
        : [],
      'Notification Template Name - Create': currentFormChanges[
        'Notification Template Name - Create'
      ]
        ? [currentFormChanges['Notification Template Name - Create']]
        : [],
      'Notification Template Name - Complete': currentFormChanges[
        'Notification Template Name - Complete'
      ]
        ? [currentFormChanges['Notification Template Name - Complete']]
        : [],
      'Owning Team': currentFormChanges['Owning Team']
        ? currentFormChanges['Owning Team']
        : [],
    },
    status: currentFormChanges.status,
    type: currentFormChanges.type,
    description: currentFormChanges.description,
    categorizations: currentFormChanges.categories,
  };
  const { serverError, form } = yield call(CoreAPI.updateForm, {
    kappSlug: action.payload.kappSlug,
    formSlug: currentForm.slug,
    form: formContent,
    include: FORM_INCLUDES,
  });
  if (!serverError) {
    yield put(
      actions.fetchForm({
        kappSlug: action.payload.kappSlug,
        formSlug: currentForm.slug,
      }),
    );
  }
}

export function* watchSettingsForms() {
  yield takeEvery(types.UPDATE_CATEGORIES, updateCategoriesSaga);
}
