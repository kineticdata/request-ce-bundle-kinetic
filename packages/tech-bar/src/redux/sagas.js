import { all } from 'redux-saga/effects';

import { watchAppointments } from './sagas/appointments';
import { watchTechBarApp } from './sagas/techBarApp';
import { watchWalkIns } from './sagas/walkIns';
import { watchMetrics } from './sagas/metrics';

export default function*() {
  yield all([
    watchAppointments(),
    watchTechBarApp(),
    watchWalkIns(),
    watchMetrics(),
  ]);
}
