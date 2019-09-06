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
  <div className="page-container">
    <PageTitle parts={['Discussions']} />
    {createModal && (
      <CreateDiscussionModal
        close={() => setCreateModal(false)}
        onSuccess={discussion => navigate(discussion.id)}
        profile={profile}
      />
    )}
    <div className="page-panel page-panel--no-padding">
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
          <I18n
            render={translate => (
              <button
                className="btn btn-link icon-wrapper"
                onClick={loadPreviousHandler}
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
                onClick={loadNextHandler}
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
      )}
    </div>
  </div>
);

const renderHeaderHandler = props => () => {
  return (
    <Fragment>
      <div className="header">
        <div>
          <span>
            <I18n>
              {props.archived ? 'Archived Discussions' : 'Recent Discussions'}
            </I18n>
          </span>
          {props.title && (
            <span className="search-query">
              <I18n
                render={translate =>
                  ` / ${translate('search results for')} "${props.title}"`
                }
              />
            </span>
          )}
        </div>
        <I18n
          render={translate => (
            <div className="btn-group">
              {!props.archived && (
                <button
                  type="button"
                  className="btn btn-icon"
                  onClick={props.toggleCreateDiscussionHandler}
                  title={translate('New Discussion')}
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
                title={translate('Reload Discussions')}
              >
                <span className="icon">
                  <span className="fa fa-refresh" />
                </span>
              </button>
            </div>
          )}
        />
      </div>
      <div className="subheader">
        <button
          className="btn btn-inverse"
          onClick={props.toggleArchivedHandler}
        >
          <I18n>{props.archived ? 'Show Recent' : 'Show Archived'}</I18n>
        </button>
        {props.archived && (
          <DateRangeDropdown
            value={props.dateRange}
            onChange={props.setDateRangeHandler}
          />
        )}
        <form
          onSubmit={e => {
            e.preventDefault();
            props.performSearchHandler();
          }}
        >
          <I18n
            render={translate => (
              <div className="input-group">
                <input
                  type="text"
                  placeholder={translate('Search discussions')}
                  onChange={e => props.setQuery(e.target.value)}
                  className="form-control"
                  value={props.query}
                />
                {props.query && (
                  <div className="input-group-append">
                    <button
                      className="btn btn-inverse"
                      type="button"
                      onClick={() => props.performSearchHandler(true)}
                      title={translate('Clear Search')}
                    >
                      <span className="fa fa-times text-danger" />
                    </button>
                  </div>
                )}
                <div className="input-group-append">
                  <button
                    className="btn btn-inverse"
                    type="submit"
                    title={translate('Search')}
                  >
                    <span className="fa fa-search" />
                  </button>
                </div>
              </div>
            )}
          />
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
