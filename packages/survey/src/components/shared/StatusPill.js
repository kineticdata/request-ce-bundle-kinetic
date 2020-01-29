import React from 'react';
// import { getStatus, getStatusClass } from '../../utils';
import { I18n } from '@kineticdata/react';

export const StatusPill = props => {
  const statusColor =
    props.status === 'New'
      ? 'yellow'
      : props.status === 'Active'
        ? 'green'
        : props.status === 'Inactive'
          ? 'gray'
          : props.status === 'Deleted' && 'red';
  return (
    <span className={`status status--${statusColor}`}>
      <I18n>{props.status}</I18n>
    </span>
  );
};
