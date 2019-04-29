import React from 'react';
import { getStatus, getStatusClass } from '../../utils';
import { I18n } from '@kineticdata/react';

export const StatusPill = props => (
  <span className={`status ${getStatusClass(props.submission)}`}>
    <I18n>{getStatus(props.submission)}</I18n>
  </span>
);
