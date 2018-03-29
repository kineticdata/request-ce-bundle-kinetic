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
  refreshPage,
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
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-inverse"
            disabled={!hasPreviousPage}
            onClick={handlePreviousPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-left" />
            </span>
          </button>
          <button
            type="button"
            className="btn btn-inverse"
            disabled={!hasNextPage}
            onClick={handleNextPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-right" />
            </span>
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
            deleteCallback: refreshPage,
          }))
          .map(props => <RequestCard {...props} />)}
      </div>
    </div>
  </div>
);
