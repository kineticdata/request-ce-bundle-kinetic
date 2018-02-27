import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import SVGInline from 'react-svg-inline';
import { Icon } from '../Icon';
import { bundle, CoreForm } from 'react-kinetic-core';
import { RequestShowConfirmationContainer } from './RequestShowConfirmation';
import { RequestActivityList } from './RequestActivityList';
import { TimeAgo } from '../TimeAgo';
import chevronLeftIcon from 'font-awesome-svg-png/black/svg/chevron-left.svg';
import { CancelButtonContainer } from '../CancelButton';
import { CommentButtonContainer } from '../CommentButton';
import { CloneButtonContainer } from '../CloneButton';
import { FeedbackButtonContainer } from '../FeedbackButton';
import { PageTitle } from '../Shared/PageTitle';

import * as constants from '../../constants';
import * as helpers from '../../helpers';

const globals = import('../../globals');

const getIcon = form =>
  helpers.getAttributeValue(
    form,
    constants.ATTRIBUTE_ICON,
    constants.DEFAULT_FORM_ICON,
  );

const ProfileLink = ({ submitter }) => (
  <a
    href={`${bundle.spaceLocation()}?page=profile&username=${encodeURIComponent(
      submitter,
    )}`}
  >
    {submitter === bundle.identity() ? 'you' : submitter}
  </a>
);

const StatusItem = ({ submission }) => (
  <div className="col">
    <dl>
      <dt>Status:</dt>
      <dd>{helpers.getStatus(submission)}</dd>
    </dl>
  </div>
);

const DisplayDateItem = ({ submission }) =>
  !submission.submittedAt ? (
    <div className="col">
      <dl>
        <dt>Created:</dt>
        <dd>
          <TimeAgo timestamp={submission.createdAt} />
        </dd>
        <dd>
          <em>by</em>
          {` `}
          <ProfileLink submitter={submission.createdBy} />
        </dd>
      </dl>
    </div>
  ) : (
    <div className="col">
      <dl>
        <dt>Submitted:</dt>
        <dd>
          <TimeAgo timestamp={submission.submittedAt} />
          <br />
          <small>
            by
            {` `}
            <ProfileLink submitter={submission.submittedBy} />
          </small>
        </dd>
      </dl>
    </div>
  );

const ServiceOwnerItem = ({ submission }) => {
  const serviceOwner = helpers.getConfig({
    submission,
    name: constants.ATTRIBUTE_SERVICE_OWNING_TEAM,
  });
  return (
    !!serviceOwner && (
      <div className="col">
        <dl>
          <dt>Service Owning Team:</dt>
          <dd>{serviceOwner} Team</dd>
        </dl>
      </div>
    )
  );
};

const EstCompletionItem = ({ submission }) => {
  const dueDate = helpers.getDueDate(
    submission,
    constants.ATTRIBUTE_SERVICE_DAYS_DUE,
  );
  return (
    submission.coreState === constants.CORE_STATE_SUBMITTED &&
    !!dueDate && (
      <div className="col">
        <dl>
          <dt>Est. Completion:</dt>
          <dd>
            <TimeAgo timestamp={dueDate} />
          </dd>
        </dl>
      </div>
    )
  );
};

const CompletedInItem = ({ submission }) => {
  const duration =
    submission.coreState === constants.CORE_STATE_CLOSED &&
    helpers.getDurationInDays(submission.createdAt, submission.closedAt);
  return (
    (duration || duration === 0) && (
      <div className="col">
        <dl>
          <dt>Completed in:</dt>
          <dd>
            {duration} {duration === 1 ? 'day' : 'days'}
          </dd>
        </dl>
      </div>
    )
  );
};

export const RequestShow = ({ submission, listType, mode }) => (
  <div>
    <PageTitle parts={[submission && `#${submission.handle}`, 'Requests']} />
    <div className="services-bar">
      <span className="bordercolor" />
    </div>
    <div className="request-details-container">
      <Link className="back-link" to={`/requests/${listType || ''}`}>
        <div className="icon-wrapper">
          <SVGInline svg={chevronLeftIcon} className="icon" />
          Return to {listType || 'All'} Requests
        </div>
      </Link>
      {submission && (
        <div className="submission-detail-wrapper">
          <div className="meta-wrapper">
            <div className="container">
              <div className="row">
                <StatusItem submission={submission} />
                <div className="col">
                  <dl>
                    <dt>Confirmation #</dt>
                    <dd>{submission.handle}</dd>
                  </dl>
                </div>
                <DisplayDateItem submission={submission} />
                <ServiceOwnerItem submission={submission} />
                <EstCompletionItem submission={submission} />
                <CompletedInItem submission={submission} />
                <div className="col btn-group-col">
                  <CloneButtonContainer submission={submission} />
                  {submission.coreState === constants.CORE_STATE_SUBMITTED && (
                    <CommentButtonContainer submission={submission} />
                  )}
                  {submission.coreState === constants.CORE_STATE_CLOSED && (
                    <FeedbackButtonContainer submission={submission} />
                  )}

                  <CancelButtonContainer submission={submission} />
                </div>
              </div>
            </div>
          </div>
          <div className="submission-details-container container">
            <div className="submission-detail-wrapper">
              <h1>
                <Icon
                  image={getIcon(submission.form)}
                  background="greenGrass"
                />
                {submission.form.name}
              </h1>
              {submission.form.name !== submission.label && (
                <p>{submission.label}</p>
              )}
            </div>
            <div className="confirmation-wrapper">
              {mode === 'confirmation' && (
                <RequestShowConfirmationContainer submission={submission} />
              )}
            </div>
            <div className="submission-details-tab-wrapper">
              <ul className="nav nav-tabs">
                <li role="presentation">
                  <NavLink
                    to={helpers.getSubmissionPath(submission, null, listType)}
                    activeClassName="active"
                  >
                    Timeline
                  </NavLink>
                </li>
                <li role="presentation">
                  <NavLink
                    to={`${helpers.getSubmissionPath(
                      submission,
                      'review',
                      listType,
                    )}`}
                    activeClassName="active"
                  >
                    Review Request
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="submission-timeline-wrapper">
              {mode === 'review' ? (
                <CoreForm submission={submission.id} review globals={globals} />
              ) : (
                <RequestActivityList submission={submission} />
              )}
            </div>
            <div className="submission-request-wrapper">
              {/* Review Request goes here */}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
