import React from 'react';
import { KappLink as Link } from 'common';
import { RequestCard } from '../RequestCard';
import { getSubmissionPath } from '../../helpers';
import { PageTitle } from '../Shared/PageTitle';

export const RequestList = ({
  forms,
  submissions,
  type,
  hasNextPage,
  hasPreviousPage,
  handleNextPage,
  handlePreviousPage,
}) => (
  <div>
    <PageTitle parts={['My Requests']} />
    <div className="services-bar">
      <span className="bordercolor" />
    </div>
    <div className="request-list-container container">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">services</Link> /{' '}
            {type && <Link to="/requests">requests</Link>}
            {type && ' / '}
          </h3>
          <h1>{type || 'All Requests'}</h1>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={!hasPreviousPage}
            onClick={handlePreviousPage}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={!hasNextPage}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
      <div className="r-cards-wrapper">
        {submissions
          .map(submission => ({
            submission,
            forms,
            key: submission.id,
            path: getSubmissionPath(submission, null, type),
          }))
          .map(props => <RequestCard {...props} />)}
      </div>
    </div>
  </div>
);
