import React from 'react';
import { Link } from 'react-router-dom';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import {
  actions,
  selectServerUrl,
  selectIsMoreDiscussions,
  selectGroupedDiscussions,
} from '../../redux/modules/app';

import { actions as teamListActions } from '../../redux/modules/teamList';

import { CreateDiscussionModal } from './CreateDiscussionModal';
import { Discussion } from './Discussion';
import { PageTitle } from '../shared/PageTitle';

const HomeComponent = ({
  spaceName,
  kapps,
  teams,
  discussionGroups,
  discussionsError,
  discussionsLoading,
  discussionsSearchTerm,
  discussionServerUrl,
  isMoreDiscussions,
  me,
  handleCreateDiscussionButtonClick,
  handleDiscussionSearchInputChange,
  handleDiscussionSearchInputSubmit,
  handleLoadMoreButtonClick,
}) => (
  <div className="home-container">
    <PageTitle parts={['Home']} />
    <CreateDiscussionModal />
    <div className="home-content">
      <h4 className="home-title">Welcome to kinops for {spaceName}</h4>

      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">home</Link> /{' '}
            {discussionsSearchTerm !== '' ? `search results` : ''}
          </h3>
          <h1>
            {discussionsSearchTerm !== ''
              ? `${discussionsSearchTerm}`
              : 'Recent Discussions'}
          </h1>
        </div>
        <div className="search-discussion-form">
          <div className="select">
            <form onSubmit={handleDiscussionSearchInputSubmit}>
              <input
                placeholder="Search discussions"
                className="form-control"
                onChange={handleDiscussionSearchInputChange}
              />
              <button type="submit">
                <span className="fa fa-search" />
              </button>
            </form>
          </div>
          <button
            onClick={handleCreateDiscussionButtonClick}
            className="btn btn-default"
          >
            Create Discussion
          </button>
        </div>
      </div>

      {!discussionsError &&
        !discussionsLoading && (
          <div className="discussion-summary-wrapper kinops-discussions">
            {discussionGroups
              .map((discussions, dateGroup) => (
                <div className="messages" key={dateGroup}>
                  <div className="date">
                    <hr />
                    <span>{dateGroup}</span>
                    <hr />
                  </div>
                  {discussions.map(discussion => (
                    <Discussion
                      key={discussion.id}
                      discussion={discussion}
                      discussionServerUrl={discussionServerUrl}
                      teams={teams}
                      me={me}
                    />
                  ))}
                </div>
              ))
              .toList()}
            {isMoreDiscussions && (
              <div className="discussion-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleLoadMoreButtonClick}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  </div>
);

export const mapStateToProps = state => ({
  spaceName: state.kinops.space.name,
  discussionGroups: selectGroupedDiscussions(state),
  discussionsError: state.app.discussionsError,
  discussionsLoading: state.app.discussionsLoading,
  discussionsLimit: state.app.discussionsLimit,
  discussionsOffset: state.app.discussionsOffset,
  discussionsSearchInputValue: state.app.discussionsSearchInputValue,
  discussionsSearchTerm: state.app.discussionsSearchTerm,
  discussionServerUrl: selectServerUrl(state),
  isMoreDiscussions: selectIsMoreDiscussions(state),
  me: state.kinops.profile,
  teams: state.teamList.data,
});

export const mapDispatchToProps = {
  fetchDiscussions: actions.fetchDiscussions,
  fetchTeams: teamListActions.fetchTeams,
  searchDiscussions: actions.searchDiscussions,
  setCreateDiscussionModalOpen: actions.setCreateDiscussionModalOpen,
  setDiscussionsLimit: actions.setDiscussionsLimit,
  setDiscussionsOffset: actions.setDiscussionsOffset,
  setDiscussionsSearchInputValue: actions.setDiscussionsSearchInputValue,
  setDiscussionsSearchTerm: actions.setDiscussionsSearchTerm,
};

export const Home = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleCreateDiscussionButtonClick: props => event =>
      props.setCreateDiscussionModalOpen(true),
    handleDiscussionSearchInputChange: props => event =>
      props.setDiscussionsSearchInputValue(event.target.value),
    handleDiscussionSearchInputSubmit: props => event => {
      event.preventDefault();
      props.setDiscussionsLimit(10);
      props.setDiscussionsOffset(0);
      props.searchDiscussions();
      props.setDiscussionsSearchTerm(props.discussionsSearchInputValue);
    },
    handleLoadMoreButtonClick: ({
      fetchDiscussions,
      discussionsLimit,
      setDiscussionsLimit,
    }) => event => {
      setDiscussionsLimit(discussionsLimit + 10);
      fetchDiscussions();
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchTeams();
      this.props.fetchDiscussions();
    },
  }),
)(HomeComponent);
