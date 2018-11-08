import React from 'react';
import { KappLink as Link, TimeAgo } from 'common';
import { StatusParagraph } from '../shared/StatusParagraph';
import { buildFilterPath } from '../../redux/modules/queueApp';

const AssignmentParagraph = ({ values }) => (
  <p className="assignment">
    {values['Assigned Team'] &&
      (values['Assigned Team Display Name'] || values['Assigned Team'])}
    {values['Assigned Individual'] && values['Assigned Team'] && ' > '}
    {values['Assigned Individual'] &&
      (values['Assigned Individual Display Name'] ||
        values['Assigned Individual'])}
  </p>
);

const Timestamp = ({ id, label, value }) =>
  value && (
    <li className="list-group-item">
      {label}
      &nbsp;
      <TimeAgo timestamp={value} id={`${id}-${label}`} />
    </li>
  );

const DueOrCloseDate = ({ queueItem }) => {
  if (queueItem.closedAt) {
    return (
      <Timestamp label="Closed" value={queueItem.closedAt} id={queueItem.id} />
    );
  } else if (queueItem.values['Due Date']) {
    return (
      <Timestamp
        label="Due"
        value={queueItem.values['Due Date']}
        id={queueItem.id}
      />
    );
  } else {
    return null;
  }
};

export const QueueListItemSmall = ({ queueItem, filter }) => {
  const { createdAt, updatedAt, id, values } = queueItem;
  return (
    <li className="submission list-group-item">
      <Link
        to={`${buildFilterPath(filter)}/item/${id}`}
        className="summary-group"
      >
        <StatusParagraph queueItem={queueItem} />
        <h6>{queueItem.label}</h6>
        <p className="summary">
          {queueItem.form.name} ({queueItem.handle})
          {queueItem.values['Discussion Id'] && (
            <span className="btn icon">
              <span
                className="fa fa-fw fa-comments"
                style={{ color: 'rgb(9, 84, 130)', fontSize: '16px' }}
              />
            </span>
          )}
        </p>

        <AssignmentParagraph values={values} />
        <ul className="timestamps list-group">
          <Timestamp label="Scheduled At" value={values['Due Date']} id={id} />
          <DueOrCloseDate queueItem={queueItem} />
          <Timestamp label="Updated" value={updatedAt} id={id} />
          <Timestamp label="Created" value={createdAt} id={id} />
        </ul>
      </Link>
    </li>
  );
};
