import React from 'react';
// import { getStatus, getStatusClass } from '../../utils';
import { I18n } from '@kineticdata/react';

export const StatusPill = props => {
  const statusColor = props.status === 'Active' ? 'green' : 'gray';
  return (
    <span className={`status status--${statusColor}`}>
      <I18n>{props.status === 'Active' ? 'Active' : 'Inactive'}</I18n>
    </span>
  );
};
