import React from 'react';
import classNames from 'classnames';
import { I18n } from '@kineticdata/react';

export const AssignmentBadge = ({ queueItem, toggle, readOnly }) => (
  <div
    className={classNames('assignment-badge icon-wrapper', {
      'read-only': readOnly,
    })}
    onClick={toggle}
    role="button"
    aria-label="Change Assignment"
    tabIndex={0}
  >
    <span className="badge" aria-hidden="true">
      {(queueItem.values['Assigned Individual Display Name'] &&
        queueItem.values['Assigned Individual Display Name'].charAt(0)) ||
        (queueItem.values['Assigned Team Display Name'] &&
          queueItem.values['Assigned Team Display Name'].charAt(0))}
    </span>
    <div>
      <div className="assignment-badge__team">
        <I18n>{queueItem.values['Assigned Team Display Name']}</I18n>
      </div>
      <div className="assignment-badge__individual text-truncate">
        {queueItem.values['Assigned Individual Display Name']}
      </div>
    </div>
    {!readOnly && (
      <span className="icon" aria-hidden="true">
        <span className="fa fa-chevron-right icon" />
      </span>
    )}
  </div>
);
