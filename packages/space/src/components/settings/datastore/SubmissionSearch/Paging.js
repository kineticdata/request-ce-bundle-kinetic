import React, { Fragment } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';

import {
  actions,
  DATASTORE_LIMIT,
} from '../../../../redux/modules/settingsDatastore';

const getPageText = (pageTokens, nextPageToken, submissions) => {
  let pages = pageTokens.size + 1;
  const initialOffset = submissions.size === 1 ? 0 : 1;

  const bottom = pages > 1 ? pages * DATASTORE_LIMIT + 1 : pages;
  const top = nextPageToken
    ? // Has more pages
      pages > 1 ? (pages + 1) * DATASTORE_LIMIT : pages * DATASTORE_LIMIT
    : // Does not have more pages.
      pages > 1
      ? pages * DATASTORE_LIMIT + initialOffset + submissions.size
      : submissions.size;

  return ` ${bottom} to ${top}`;
};

const PagingComponent = ({
  submissions,
  nextPageToken,
  pageTokens,
  handleNextThousandPage,
  handlePrevThousandPage,
}) =>
  (nextPageToken !== null || pageTokens.size > 0) && (
    <Fragment>
      <div className="search-lookup-footer">
        {(pageTokens.size > 0 || nextPageToken !== null) && (
          <p className="search-lookup-error text-danger">
            {`The Datastore contains too many records to display at one time.
      Please enter additional search criteria to narrow down the
      results, or use the buttons below the table to navigate between
      chunks of ${DATASTORE_LIMIT} records.`}
          </p>
        )}
      </div>
      <div className="datastore-top-pagination">
        <button
          className="btn btn-primary"
          disabled={pageTokens.size === 0}
          onClick={handlePrevThousandPage}
        >
          <span className="fa fa-fw fa-caret-left" />
          Previous 1000
        </button>
        <span>
          <strong>Sorting &amp; Filtering</strong>
          {submissions.size > 0
            ? getPageText(pageTokens, nextPageToken, submissions)
            : ''}
        </span>
        <button
          className="btn btn-primary"
          disabled={nextPageToken === null}
          onClick={handleNextThousandPage}
        >
          Next 1000
          <span className="fa fa-fw fa-caret-right" />
        </button>
      </div>
    </Fragment>
  );

export const mapStateToProps = state => ({
  submissions: state.settingsDatastore.submissions,
  pageTokens: state.settingsDatastore.pageTokens,
  nextPageToken: state.settingsDatastore.nextPageToken,
  simpleSearchActive: state.settingsDatastore.simpleSearchActive,
});

export const mapDispatchToProps = {
  push,
  fetchSubmissionsAdvanced: actions.fetchSubmissionsAdvanced,
  fetchSubmissionsSimple: actions.fetchSubmissionsSimple,
  pushPageToken: actions.pushPageToken,
  popPageToken: actions.popPageToken,
  setNextPageToken: actions.setNextPageToken,
};

const handleNextThousandPage = ({
  simpleSearchActive,
  fetchSubmissionsSimple,
  fetchSubmissionsAdvanced,
}) => () => {
  simpleSearchActive ? fetchSubmissionsSimple() : fetchSubmissionsAdvanced();
};

const handlePrevThousandPage = ({
  popPageToken,
  simpleSearchActive,
  fetchSubmissionsSimple,
  fetchSubmissionsAdvanced,
}) => () => {
  popPageToken();
  simpleSearchActive ? fetchSubmissionsSimple() : fetchSubmissionsAdvanced();
};

export const Paging = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handlePrevThousandPage,
    handleNextThousandPage,
  }),
)(PagingComponent);
