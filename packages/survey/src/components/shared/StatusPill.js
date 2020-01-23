import React from 'react';
import { getStatus, getStatusClass } from '../../utils';
import { I18n } from '@kineticdata/react';

export const StatusPill = props => (
  <span className={`status status--green`}>
    <I18n>{props.status}</I18n>
  </span>
);
