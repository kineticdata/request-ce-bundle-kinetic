import React from 'react';
import { KappLink as Link, Icon, TimeAgo } from 'common';
import { StatusPill } from './StatusPill';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { CardDropdown } from './CardDropdown';
import { CancelButtonContainer } from './CancelButton';
import * as helpers from '../helpers';
import * as constants from '../constants';
import { Form } from '../models';

const DisplayDateListItem = ({ submission }) => {
  const isDraft = submission.coreState === constants.CORE_STATE_DRAFT;
  return (
    <div className="col">
      <dt className="">{isDraft ? 'Created' : 'Submitted'}</dt>
      <dd className="">
        <TimeAgo
          timestamp={isDraft ? submission.createdAt : submission.submittedAt}
        />
      </dd>
    </div>
  );
};

const EstCompletionListItem = ({ submission }) => {
  const dueDate = helpers.getDueDate(
    submission,
    constants.ATTRIBUTE_SERVICE_DAYS_DUE,
  );
  return (
    submission.coreState === constants.CORE_STATE_SUBMITTED && (
      <div className="col">
        <dt className="">Est. Completion</dt>
        <dd className="">
          <TimeAgo timestamp={dueDate} />
        </dd>
      </div>
    )
  );
};

const ClosedDateListItem = ({ submission }) =>
  submission.coreState === constants.CORE_STATE_CLOSED && (
    <div className="col">
      <dt className="">Closed</dt>
      <dd className="">
        <TimeAgo timestamp={submission.closedAt} />
      </dd>
    </div>
  );

export const RequestCard = props => (
  <Link to={props.path} className="r-card">
    <h1>
      <Icon image={Form(props.submission.form).icon} background="greenGrass" />
      <span>{props.submission.form.name}</span>
      <StatusPill submission={props.submission} />
      <CardDropdown>
        <DropdownToggle color="icon" className="btn-sm">
          <span className="fa fa-ellipsis-h fa-2x" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem tag={Link} to={``}>
            Request to Cancel
          </DropdownItem>
        </DropdownMenu>
      </CardDropdown>
    </h1>
    <p>{props.submission.form.description}</p>
    <span className="meta">
      <dl className="row">
        <div className="col">
          <dt className="">Confirmation</dt>
          <dd className="">{props.submission.handle}</dd>
        </div>
        <DisplayDateListItem submission={props.submission} />
        <EstCompletionListItem submission={props.submission} />
        <ClosedDateListItem submission={props.submission} />
      </dl>
    </span>
  </Link>
);
