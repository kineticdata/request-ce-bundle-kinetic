import React from 'react';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { KappLink as Link, PageTitle } from 'common';
import { RequestCard } from '../shared/RequestCard';
import { getSubmissionPath } from '../../utils';

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
        {submissions.size > 0 ? (
          submissions
            .map(submission => ({
              submission,
              forms,
              key: submission.id,
              path: getSubmissionPath(submission, null, type),
              deleteCallback: refreshPage,
            }))
            .map(props => <RequestCard {...props} />)
        ) : (
          <div className="wally-empty-state">
            <h5>You have no requests yet.</h5>
            <img src={wallyHappyImage} alt="Happy Wally" />
            <h6>As you request new services, they’ll appear here.</h6>
          </div>
        )}
      </div>
    </div>
  </div>
);
