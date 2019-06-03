import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { PageTitle } from './shared/PageTitle';
import { I18n } from '@kineticdata/react';
import {
  CreateDiscussionModal,
  DateRangeDropdown,
  DiscussionsList,
} from 'common';
import { actions } from '../redux/modules/discussions';

const DiscussionsComponent = ({
  navigate,
  profile,
  discussions,
  error,
  renderHeaderHandler,
  createModal,
  setCreateModal,
  hasPreviousPage,
  hasNextPage,
  loadPreviousHandler,
  loadNextHandler,
  pageIndexStart,
  pageIndexEnd,
  paging,
}) => (
  <Fragment>
    <PageTitle parts={['Discussions']} />
    {createModal && (
      <CreateDiscussionModal
        close={() => setCreateModal(false)}
        onSuccess={discussion => navigate(discussion.id)}
        profile={profile}
      />
    )}
    <div className="page-panel page-panel--discussions">
      <DiscussionsList
        discussions={discussions}
        error={error}
        handleCreateDiscussionClick={console.log}
        handleDiscussionClick={discussion => () => navigate(discussion.id)}
        me={profile}
        renderHeader={renderHeaderHandler}
      />
      {discussions && (
        <div className="pagination-bar">
          <button
            className="btn btn-link icon-wrapper"
            onClick={loadPreviousHandler}
            disabled={paging || !hasPreviousPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-left" />
            </span>
          </button>
          <small>
            {paging ? (
              <span className="fa fa-spinner fa-spin" />
            ) : (
              <strong>{`${pageIndexStart}-${pageIndexEnd}`}</strong>
            )}
          </small>
          <button
            className="btn btn-link icon-wrapper"
            onClick={loadNextHandler}
            disabled={paging || !hasNextPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-right" />
            </span>
          </button>
        </div>
      )}
    </div>
  </Fragment>
);

const renderHeaderHandler = props => () => {
  return (
    <Fragment>
      <div className="header">
        <div className="d-flex">
          <I18n>
            {props.archived ? 'Archived Discussions' : 'Recent Discussions'}{' '}
          </I18n>
          {props.title && (
            <span
              className="badge badge-search"
              onClick={() => props.performSearchHandler(true)}
              role="button"
            >
              {props.title}
            </span>
          )}
        </div>
        <div className="btn-group">
          {!props.archived && (
            <button
              type="button"
              className="btn btn-icon"
              onClick={props.toggleCreateDiscussionHandler}
            >
              <span className="icon">
                <span className="fa fa-plus" />
              </span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-icon"
            onClick={props.reloadHandler}
          >
            <span className="icon">
              <span className="fa fa-refresh" />
            </span>
          </button>
        </div>
      </div>
      <div className="subheader">
        {props.archived && (
          <DateRangeDropdown
            value={props.dateRange}
            onChange={props.setDateRangeHandler}
          />
        )}
        <button
          className="btn btn-inverse"
          onClick={props.toggleArchivedHandler}
        >
          <I18n>{props.archived ? 'Show Recent' : 'Show Archived'}</I18n>
        </button>
        <form
          onSubmit={e => {
            e.preventDefault();
            props.performSearchHandler();
          }}
        >
          <div className="input-group">
            <I18n
              render={translate => (
                <input
                  type="text"
                  placeholder={translate('Search discussions')}
                  onChange={e => props.setQuery(e.target.value)}
                  className="form-control"
                  value={props.query}
                />
              )}
            />
            {props.query && (
              <div className="input-group-append">
                <button
                  className="btn btn-inverse"
                  type="button"
                  onClick={() => props.performSearchHandler(true)}
                >
                  <span className="fa fa-times text-danger" />
                </button>
              </div>
            )}
            <div className="input-group-append">
              <button className="btn btn-inverse" type="submit">
                <span className="fa fa-search" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

const toggleArchivedHandler = props => () => {
  props.fetchDiscussionsRequest({
    archived: !props.archived,
    title: props.title,
    dateRange: props.archived ? '30days' : props.dateRange,
  });
};

const setDateRangeHandler = props => dateRange => {
  props.fetchDiscussionsRequest({
    archived: props.archived,
    title: props.title,
    dateRange,
  });
};

const performSearchHandler = props => clear => {
  props.fetchDiscussionsRequest({
    archived: props.archived,
    title: clear ? '' : props.query,
    dateRange: props.dateRange,
  });
  if (clear) {
    props.setQuery('');
  }
};

const reloadHandler = props => () => {
  props.fetchDiscussionsRequest({
    archived: props.archived,
    title: props.title,
    dateRange: props.dateRange,
    clear: true,
  });
};

const loadNextHandler = props => () => {
  if (props.hasNextPage) {
    props.fetchDiscussionsNext();
  }
};

const loadPreviousHandler = props => () => {
  if (props.hasPreviousPage) {
    props.fetchDiscussionsPrevious();
  }
};

const toggleCreateDiscussionHandler = props => () => {
  props.setCreateModal(!props.createModal);
};

const mapStateToProps = state => ({
  profile: state.app.profile,
  title: state.discussions.title,
  archived: state.discussions.archived,
  dateRange: state.discussions.dateRange,
  discussions: state.discussions.data,
  error: state.discussions.error,
  paging: state.discussions.paging,
  hasPreviousPage: state.discussions.previousPageTokens.size > 0,
  hasNextPage: !!state.discussions.nextPageToken,
  pageIndexStart:
    state.discussions.previousPageTokens.size * state.discussions.pageSize +
    (state.discussions.data && state.discussions.data.size > 0 ? 1 : 0),
  pageIndexEnd:
    state.discussions.previousPageTokens.size * state.discussions.pageSize +
    ((state.discussions.data && state.discussions.data.size) || 0),
});

const mapDispatchToProps = {
  fetchDiscussionsRequest: actions.fetchDiscussionsRequest,
  fetchDiscussionsNext: actions.fetchDiscussionsNext,
  fetchDiscussionsPrevious: actions.fetchDiscussionsPrevious,
};

export const Discussions = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('query', 'setQuery', ''),
  withState('createModal', 'setCreateModal', false),
  withHandlers({
    loadNextHandler,
    loadPreviousHandler,
    performSearchHandler,
    reloadHandler,
    setDateRangeHandler,
    toggleArchivedHandler,
    toggleCreateDiscussionHandler,
  }),
  withHandlers({ renderHeaderHandler }),
  lifecycle({
    componentDidMount() {
      this.props.fetchDiscussionsRequest({
        archived: this.props.archived,
        title: this.props.title,
        dateRange: this.props.dateRange,
      });
    },
  }),
)(DiscussionsComponent);
