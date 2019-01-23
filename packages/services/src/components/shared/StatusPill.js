import React from 'react';
import { getStatus, getStatusClass } from '../../utils';
import { I18n } from '../../../../app/src/I18nProvider';

export const StatusPill = props => (
  <span className={`status ${getStatusClass(props.submission)}`}>
    <I18n>{getStatus(props.submission)}</I18n>
  </span>
);
