import React from 'react';
import { TimeAgo } from 'common';

export const EndNode = ({ timestamp }) => (
  <div className="timeline-status timeline-status--end">
    Finished
    <br />
    <small>
      <TimeAgo tooltip={false} timestamp={timestamp} />
    </small>
  </div>
);
