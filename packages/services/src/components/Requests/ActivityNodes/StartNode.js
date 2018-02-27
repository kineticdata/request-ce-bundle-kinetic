import React from 'react';
import { TimeAgo } from '../../TimeAgo';

export const StartNode = ({ label, timestamp }) => (
  <div className="timeline-start">
    {label} <br />
    <small>
      <TimeAgo tooltip={false} timestamp={timestamp} />
    </small>
  </div>
);
