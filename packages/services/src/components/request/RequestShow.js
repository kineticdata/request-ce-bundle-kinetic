import React, { Fragment } from 'react';
import { Link as SpaceLink } from 'react-router-dom';
import classNames from 'classnames';
import {
  KappLink as Link,
  KappNavLink as NavLink,
  PageTitle,
  Icon,
  TimeAgo,
  Utils as CommonUtils,
} from 'common';
import { bundle, CoreForm } from 'react-kinetic-core';
import { RequestShowConfirmationContainer } from './RequestShowConfirmation';
import { RequestDiscussion } from './RequestDiscussion';
import { RequestActivityList } from './RequestActivityList';
import { CancelButtonContainer } from './CancelButton';
import { CommentButtonContainer } from './CommentButton';
import { CloneButtonContainer } from './CloneButton';
import { FeedbackButtonContainer } from './FeedbackButton';
import { ViewDiscussionButtonContainer } from './ViewDiscussionButton';
import { SendMessageModal } from './SendMessageModal';
import * as constants from '../../constants';
import {
  getDueDate,
  getDurationInDays,
  getStatus,
  getSubmissionPath,
} from '../../utils';

const globals = import('common/globals');

const getIcon = form =>
  CommonUtils.getAttributeValue(
    form,
    constants.ATTRIBUTE_ICON,
    constants.DEFAULT_FORM_ICON,
  );

const ProfileLink = ({ submitter }) => (
  <SpaceLink to={`/profile/${encodeURIComponent(submitter)}`}>
    {submitter === bundle.identity() ? 'you' : submitter}
  </SpaceLink>
);

const StatusItem = ({ submission }) => (
  <div className="data-list-row__col">
    <dl>
      <dt>Status:</dt>
      <dd>{getStatus(submission)}</dd>
    </dl>
  </div>
);

const DisplayDateItem = ({ submission }) =>
  !submission.submittedAt ? (
    <div className="data-list-row__col">
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
    <div className="data-list-row__col">
      <dl>
        <dt>Submitted:</dt>
        <dd className="text-truncate">
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
  const serviceOwner = CommonUtils.getConfig({
    submission,
    name: constants.ATTRIBUTE_SERVICE_OWNING_TEAM,
  });
  return (
    !!serviceOwner && (
      <div className="data-list-row__col">
        <dl>
          <dt>Service Owning Team:</dt>
          <dd>{serviceOwner} Team</dd>
        </dl>
      </div>
    )
  );
};

const EstCompletionItem = ({ submission }) => {
  const dueDate = getDueDate(submission, constants.ATTRIBUTE_SERVICE_DAYS_DUE);
  return (
    submission.coreState === constants.CORE_STATE_SUBMITTED &&
    !!dueDate && (
      <div className="data-list-row__col">
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
    getDurationInDays(submission.createdAt, submission.closedAt);
  return (
    (duration || duration === 0) && (
      <div className="data-list-row__col">
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

export const RequestShow = ({
  submission,
  listType,
  mode,
  sendMessageModalOpen,
  viewDiscussionModal,
  discussion,
  openDiscussion,
  closeDiscussion,
}) => (
  <div className="page-container page-container--panels page-container--services-submission page-container--no-padding">
    <div
      className={classNames(
        'page-panel page-panel--services-submission page-panel--scrollable',
        {
          'page-panel--three-fifths page-panel--no-padding ': discussion,
        },
      )}
    >
      <div className="scroll-wrapper">
        <PageTitle
          parts={[submission && `#${submission.handle}`, 'Requests']}
        />
        {sendMessageModalOpen && <SendMessageModal submission={submission} />}
        <span className="services-color-bar services-color-bar__blue-slate" />
        <Link className="nav-return" to={`/requests/${listType || ''}`}>
          <span className="fa fa-fw fa-chevron-left" />
          {listType || 'All'} Requests
        </Link>
        {submission && (
          <Fragment>
            <div className="submission__meta">
              <div className="data-list-row">
                <StatusItem submission={submission} />
                <div className="data-list-row__col">
                  <dl>
                    <dt>Confirmation #</dt>
                    <dd>{submission.handle}</dd>
                  </dl>
                </div>
                <DisplayDateItem submission={submission} />
                <ServiceOwnerItem submission={submission} />
                <EstCompletionItem submission={submission} />
                <CompletedInItem submission={submission} />
                <div className="col-lg-auto btn-group-col">
                  <ViewDiscussionButtonContainer
                    openDiscussion={openDiscussion}
                  />
                  <CloneButtonContainer submission={submission} />
                  {submission.coreState === constants.CORE_STATE_SUBMITTED &&
                    !discussion && (
                      <CommentButtonContainer submission={submission} />
                    )}
                  {submission.coreState === constants.CORE_STATE_CLOSED && (
                    <FeedbackButtonContainer submission={submission} />
                  )}

                  <CancelButtonContainer submission={submission} />
                </div>
              </div>
            </div>
            <div className="page-container page-container--submission">
              <div className="page-content">
                <div className="submission-title">
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

                {mode === 'confirmation' && (
                  <div className="card card--submission-confirmation">
                    <RequestShowConfirmationContainer submission={submission} />
                  </div>
                )}

                <div className="submission-tabs">
                  <ul className="nav nav-tabs">
                    <li role="presentation">
                      <NavLink
                        to={getSubmissionPath(submission, null, listType)}
                        activeClassName="active"
                      >
                        Timeline
                      </NavLink>
                    </li>

                    <li role="presentation">
                      <NavLink
                        to={`${getSubmissionPath(
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
                  <div className="submission-tabs__content">
                    {mode === 'review' ? (
                      <CoreForm
                        submission={submission.id}
                        review
                        globals={globals}
                      />
                    ) : (
                      <RequestActivityList submission={submission} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    {discussion && (
      <RequestDiscussion
        discussion={discussion}
        viewDiscussionModal={viewDiscussionModal}
        closeDiscussion={closeDiscussion}
      />
    )}
  </div>
);
