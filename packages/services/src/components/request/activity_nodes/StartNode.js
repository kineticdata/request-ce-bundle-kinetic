import React from 'react';
import { TimeAgo } from 'common';

export const StartNode = ({ label, timestamp }) => (
  <div className="timeline-status timeline-status--start">
    {label} <br />
    <small>
      <TimeAgo tooltip={false} timestamp={timestamp} />
    </small>
  </div>
);
