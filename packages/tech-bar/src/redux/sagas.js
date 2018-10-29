import { all } from 'redux-saga/effects';

import { watchAppointments } from './sagas/appointments';
import { watchTechBarApp } from './sagas/techBarApp';

export default function*() {
  yield all([watchAppointments(), watchTechBarApp()]);
}
