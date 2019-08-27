import React from 'react';

import { CoreStateBadge } from '../CoreStateBadge';

export const CoreStateBadgeCell = ({ value }) => (
  <td>
    <CoreStateBadge coreState={value} />
  </td>
);
