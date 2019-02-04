import React from 'react';
import { TimeAgo } from 'common';
import { I18n } from '../../../../../app/src/I18nProvider';

export const EndNode = ({ timestamp }) => (
  <div className="timeline-status timeline-status--end">
    <I18n>Finished</I18n>
    <br />
    <small>
      <TimeAgo tooltip={false} timestamp={timestamp} />
    </small>
  </div>
);
