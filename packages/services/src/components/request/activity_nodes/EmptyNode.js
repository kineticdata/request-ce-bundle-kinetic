import React from 'react';
import { I18n } from '../../../../../app/src/I18nProvider';

export const EmptyNode = () => (
  <li>
    <div className="submission-timeline__item">
      <span className="circle" />
      <h1>
        <I18n>No Activity</I18n>
      </h1>
    </div>
  </li>
);
