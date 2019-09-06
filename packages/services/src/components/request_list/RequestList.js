import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { StateListWrapper } from 'common';
import { RequestCard } from '../shared/RequestCard';
import { PageTitle } from '../shared/PageTitle';

import { getSubmissionPath } from '../../utils';
import { I18n } from '@kineticdata/react';

const emptyStateMessage = type => {
  switch (type) {
    case 'Draft': {
      return "You have no draft requests. Draft services are forms you started but haven't submitted yet.";
    }
    case 'Open': {
      return 'You have no open requests. If you request something, it will show up here.';
    }
    case 'Closed': {
      return "Closed requests are services  you've requested that have been completed or canceled.";
    }
    default: {
      return 'No requests found. Submit a service and it will show up here!';
    }
  }
};

export const RequestList = ({
  forms,
  submissions,
  error,
  type,
  paging,
  hasNextPage,
  hasPreviousPage,
  pageIndexStart,
  pageIndexEnd,
  handleNextPage,
  handlePreviousPage,
  refreshPage,
  appLocation,
}) => (
  <Fragment>
    <PageTitle parts={['My Requests']} />
    <div className="page-container page-container--color-bar">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to={appLocation}>
                <I18n>services</I18n>
              </Link>{' '}
              /{' '}
              {type && (
                <Link to={`${appLocation}/requests`}>
                  <I18n>requests</I18n>
                </Link>
              )}
              {type && ' / '}
            </h3>
            <h1>
              <I18n>{type || 'All Requests'}</I18n>
            </h1>
          </div>
        </div>
        <div className="cards__wrapper">
          <StateListWrapper
            data={submissions}
            error={error}
            emptyTitle={`No ${type !== 'All' ? `${type} ` : ''}Requests Found`}
            emptyMessage={emptyStateMessage(type)}
          >
            {data => (
              <Fragment>
                {data
                  .map(submission => ({
                    submission,
                    forms,
                    key: submission.id,
                    path: getSubmissionPath(
                      appLocation,
                      submission,
                      null,
                      type,
                    ),
                    deleteCallback: refreshPage,
                  }))
                  .map(props => <RequestCard {...props} />)}
                <div className="pagination-bar">
                  <I18n
                    render={translate => (
                      <button
                        className="btn btn-link icon-wrapper"
                        onClick={handlePreviousPage}
                        disabled={paging || !hasPreviousPage}
                        title={translate('Previous Page')}
                      >
                        <span className="icon">
                          <span className="fa fa-fw fa-caret-left" />
                        </span>
                      </button>
                    )}
                  />
                  <small>
                    {paging ? (
                      <span className="fa fa-spinner fa-spin" />
                    ) : (
                      <strong>{`${pageIndexStart}-${pageIndexEnd}`}</strong>
                    )}
                  </small>
                  <I18n
                    render={translate => (
                      <button
                        className="btn btn-link icon-wrapper"
                        onClick={handleNextPage}
                        disabled={paging || !hasNextPage}
                        title={translate('Next Page')}
                      >
                        <span className="icon">
                          <span className="fa fa-fw fa-caret-right" />
                        </span>
                      </button>
                    )}
                  />
                </div>
              </Fragment>
            )}
          </StateListWrapper>
        </div>
      </div>
    </div>
  </Fragment>
);
