import React from 'react';

const STATUS_CLASSES = {
  New: 'badge-primary',
  Active: 'badge-success',
  Inactive: 'badge-secondary',
  Delete: 'badge-danger',
};

export const StatusBadgeCell = ({ value }) => (
  <td>
    <span className={`badge ${STATUS_CLASSES[value]}`}>{value}</span>
  </td>
);
