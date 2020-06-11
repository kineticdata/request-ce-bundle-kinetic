import React from 'react';
import { TimeAgo } from '../TimeAgo';

export const TimeAgoCell = ({ value }) => (
  <td>
    <TimeAgo timestamp={value} />
  </td>
);
