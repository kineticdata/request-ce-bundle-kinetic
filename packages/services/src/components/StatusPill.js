import React from 'react';
import { getStatus, getStatusClass } from '../helpers';

export const StatusPill = props => (
  <span className={`status ${getStatusClass(props.submission)}`}>
    {getStatus(props.submission)}
  </span>
);
