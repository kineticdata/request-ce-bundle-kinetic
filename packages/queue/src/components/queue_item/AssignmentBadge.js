import React from 'react';
import classNames from 'classnames';

export const AssignmentBadge = ({ queueItem, toggle, readOnly }) => (
  <div
    className={classNames('assignment-badge icon-wrapper', {
      'read-only': readOnly,
    })}
  >
    <span className="badge" onClick={toggle} role="button" tabIndex={0}>
      {queueItem.values['Assigned Team Display Name'] &&
        queueItem.values['Assigned Team Display Name'].charAt(0)}
    </span>
    <div onClick={toggle} role="button" tabIndex={-1}>
      <div className="team">
        {queueItem.values['Assigned Team Display Name']}
      </div>
      <div className="individual">
        {queueItem.values['Assigned Individual Display Name']}
      </div>
    </div>
    {!readOnly && (
      <span className="icon">
        <span
          className="fa fa-chevron-right icon"
          onClick={toggle}
          role="button"
          tabIndex={0}
        />
      </span>
    )}
  </div>
);
