import React from 'react';
import { TimeAgo } from '../../TimeAgo';

export const EndNode = ({ timestamp }) => (
  <div className="timeline-end">
    Finished
    <br />
    <small>
      <TimeAgo tooltip={false} timestamp={timestamp} />
    </small>
  </div>
);
