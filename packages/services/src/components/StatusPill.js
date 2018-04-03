import React from 'react';
import { getStatus, getStatusClass } from '../utils';

export const StatusPill = props => (
  <span className={`status ${getStatusClass(props.submission)}`}>
    {getStatus(props.submission)}
  </span>
);
