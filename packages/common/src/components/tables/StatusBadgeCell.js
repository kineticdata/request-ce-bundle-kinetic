import React from 'react';
import { I18n } from '@kineticdata/react';

const STATUS_CLASSES = {
  New: 'badge-primary',
  Active: 'badge-success',
  Inactive: 'badge-secondary',
  Delete: 'badge-danger',
  Paused: 'badge-warning',
};

export const StatusBadgeCell = ({ value }) => (
  <td>
    <span className={`badge ${STATUS_CLASSES[value]}`}>
      <I18n>{value}</I18n>
    </span>
  </td>
);

export const StatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_CLASSES[status]}`}>
    <I18n>{status}</I18n>
  </span>
);
