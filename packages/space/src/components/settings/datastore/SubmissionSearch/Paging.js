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

  const bottom = pages > 1 ? (pages - 1) * DATASTORE_LIMIT + 1 : pages;
  const top = (pages - 1) * DATASTORE_LIMIT + submissions.size;

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
      <div className="datastore-top-pagination">
        <button
          className="btn btn-primary"
          disabled={pageTokens.size === 0}
          onClick={handlePrevThousandPage}
        >
          <span className="fa fa-fw fa-caret-left" />
          Previous {DATASTORE_LIMIT}
        </button>
        <span>
          {submissions.size > 0
            ? getPageText(pageTokens, nextPageToken, submissions)
            : ''}
        </span>
        <button
          className="btn btn-primary"
          disabled={nextPageToken === null}
          onClick={handleNextThousandPage}
        >
          Next {DATASTORE_LIMIT}
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
