import { all } from 'redux-saga/effects';
import { watchApp } from './sagas/app';
import { watchAppointments } from './sagas/appointments';
import { watchTechBarApp } from './sagas/techBarApp';
import { watchWalkIns } from './sagas/walkIns';
import { watchMetrics } from './sagas/metrics';
import { watchExport } from './sagas/export';

export default function*() {
  yield all([
    watchApp(),
    watchAppointments(),
    watchTechBarApp(),
    watchWalkIns(),
    watchMetrics(),
    watchExport(),
  ]);
}
