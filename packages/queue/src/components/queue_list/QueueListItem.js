import React from 'react';
import { Link } from '@reach/router';
import { TimeAgo } from 'common';
import { StatusContent } from '../shared/StatusContent';
import { I18n } from '@kineticdata/react';

const AssignmentParagraph = ({ values }) => (
  <span className="submission__assignment">
    <I18n>
      {values['Assigned Team'] &&
        (values['Assigned Team Display Name'] || values['Assigned Team'])}
    </I18n>
    {values['Assigned Individual'] && values['Assigned Team'] && ' > '}
    {values['Assigned Individual'] &&
      (values['Assigned Individual Display Name'] ||
        values['Assigned Individual'])}
  </span>
);

const Timestamp = ({ id, label, value, username }) =>
  value && (
    <li className="list-group-item">
      <I18n>{label}</I18n>
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

export const QueueListItemSmall = ({ queueItem, filter, path }) => {
  const { createdAt, createdBy, updatedAt, updatedBy, id, values } = queueItem;
  return (
    <li className="submission list-group-item">
      <Link to={path || `item/${id}`} className="submission-summary">
        <div className="submission__meta">
          <StatusContent queueItem={queueItem} />
          <div className="submission__handler">
            <I18n
              context={`kapps.${queueItem.form.kapp.slug}.forms.${
                queueItem.form.slug
              }`}
            >
              {queueItem.form.name}
            </I18n>{' '}
            ({queueItem.handle})
          </div>
          <AssignmentParagraph values={values} />
          {queueItem.values['Discussion Id'] && (
            <span className="btn icon icon--discussion">
              <span
                className="fa fa-fw fa-comments"
                style={{ color: 'rgb(9, 84, 130)', fontSize: '16px' }}
              />
            </span>
          )}
        </div>

        <div className="submission__title">{queueItem.label}</div>
        <ul className="submission__timestamps list-group">
          <DueOrCloseDate queueItem={queueItem} />
          <Timestamp
            label="Updated"
            value={updatedAt}
            id={id}
            username={updatedBy}
          />
          <Timestamp
            label="Created"
            value={createdAt}
            id={id}
            username={createdBy}
          />
        </ul>
      </Link>
    </li>
  );
};
