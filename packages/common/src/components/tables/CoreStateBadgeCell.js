import React from 'react';
import { I18n } from '@kineticdata/react';

export const CORE_STATE_CLASSES = {
  Draft: 'badge-warning',
  Submitted: 'badge-success',
  Closed: 'badge-secondary',
};

export const CoreStateBadge = ({ coreState }) => (
  <span className={`badge ${CORE_STATE_CLASSES[coreState]}`}>
    <I18n>{coreState}</I18n>
  </span>
);

export const CoreStateBadgeCell = ({ value }) => (
  <td>
    <CoreStateBadge coreState={value} />
  </td>
);
