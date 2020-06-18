import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { UncontrolledTooltip, ButtonGroup } from 'reactstrap';
import { I18n } from '@kineticdata/react';

const CLOSED_STATUSES = ['Cancelled', 'Complete'];

const getStatusClass = status =>
  `submission-status submission-status--${status
    .toLowerCase()
    .replace(/\s+/g, '-')}`;

const getStatusId = queueItem => `tooltip-${queueItem.id}-status-paragraph`;

const getStatusReason = queueItem => {
  switch (queueItem.values.Status) {
    case 'Pending':
      return queueItem.values['Pending Reason'];
    case 'Cancelled':
      return queueItem.values['Cancellation Reason'];
    case 'Complete':
      return queueItem.values.Resolution;
    default:
      return null;
  }
};

const PrevAndNextGroup = ({ prevAndNext }) => (
  <ButtonGroup className="queue-details-nav">
    <Link
      to={`../${prevAndNext.prev}`}
      className="btn btn-inverse"
      disabled={!prevAndNext.prev}
      aria-label="Previous Queue Item"
    >
      <span className="fa fa-fw fa-caret-left" role="presentation" />
    </Link>
    <Link
      to={`../${prevAndNext.next}`}
      className="btn btn-inverse"
      disabled={!prevAndNext.next}
      aria-label="Next Queue Item"
    >
      <span className="fa fa-fw fa-caret-right" role="presentation" />
    </Link>
  </ButtonGroup>
);

const sizeString = str => {
  return str && str.length > 20 ? `${str.slice(0, 20).trim()}...` : str;
};

export const StatusContent = ({ queueItem, prevAndNext }) => (
  <Fragment>
    <div
      className={
        prevAndNext
          ? 'status-content  status-content--is-active'
          : 'status-content'
      }
    >
      <span className={getStatusClass(queueItem.values.Status)}>
        <I18n>{queueItem.values.Status}</I18n>
      </span>
    </div>
    {prevAndNext && (
      <span className="submission-status--reason">
        {getStatusReason(queueItem)}
      </span>
    )}
    {prevAndNext && <PrevAndNextGroup prevAndNext={prevAndNext} />}
  </Fragment>
);
