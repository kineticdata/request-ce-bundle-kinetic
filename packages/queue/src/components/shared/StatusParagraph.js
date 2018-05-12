import React from 'react';
import { UncontrolledTooltip, ButtonGroup, Button } from 'reactstrap';
import { KappLinkContainer as LinkContainer } from 'common';

const CLOSED_STATUSES = ['Cancelled', 'Complete'];

const getStatusClass = status =>
  `queue-status queue-status--${status.toLowerCase().replace(/\s+/g, '-')}`;

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
    <LinkContainer to={prevAndNext.prev || ''}>
      <Button color="inverse" disabled={!prevAndNext.prev}>
        <span className="fa fa-fw fa-caret-left" />
      </Button>
    </LinkContainer>
    <LinkContainer to={prevAndNext.next || ''}>
      <Button color="inverse" disabled={!prevAndNext.next}>
        <span className="fa fa-fw fa-caret-right" />
      </Button>
    </LinkContainer>
  </ButtonGroup>
);

export const StatusParagraph = ({ queueItem, prevAndNext }) => (
  <div className="status-paragraph">
    <p className="queue-status">
      <span className={getStatusClass(queueItem.values.Status)}>
        {CLOSED_STATUSES.includes(queueItem.values.Status) ? (
          <span className="fa fa-fw fa-circle" />
        ) : (
          <span className="fa fa-fw fa-circle-o " />
        )}
        {queueItem.values.Status}
      </span>
      <span className="queue-status--reason" id={getStatusId(queueItem)}>
        {getStatusReason(queueItem)}
      </span>
      {queueItem.values.Status !== 'Open' && (
        <UncontrolledTooltip
          placement="top"
          target={getStatusId(queueItem)}
          delay={0}
        >
          {getStatusReason(queueItem)}
        </UncontrolledTooltip>
      )}
    </p>
    {prevAndNext && <PrevAndNextGroup prevAndNext={prevAndNext} />}
  </div>
);
