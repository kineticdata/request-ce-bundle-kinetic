import React, { Fragment } from 'react';
import { UncontrolledTooltip, ButtonGroup, Button } from 'reactstrap';
import { KappLinkContainer as LinkContainer } from 'common';
import { I18n } from '../../../../app/src/I18nProvider';

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

export const StatusContent = ({ queueItem, prevAndNext }) => (
  <Fragment>
    <div
      className={
        prevAndNext
          ? 'status-content  status-content--is-active'
          : 'status-content'
      }
    >
      <span
        className={getStatusClass(queueItem.values.Status)}
        id={getStatusId(queueItem)}
      >
        <I18n>{queueItem.values.Status}</I18n>
        {queueItem.values.Status !== 'Open' && (
          <UncontrolledTooltip
            placement="top"
            target={getStatusId(queueItem)}
            delay={0}
          >
            {getStatusReason(queueItem)}
          </UncontrolledTooltip>
        )}
      </span>
    </div>
    {prevAndNext && (
      <span className="submission-status--reason" id={getStatusId(queueItem)}>
        {getStatusReason(queueItem)}
      </span>
    )}
    {prevAndNext && <PrevAndNextGroup prevAndNext={prevAndNext} />}
  </Fragment>
);
