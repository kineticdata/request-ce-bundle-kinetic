import React from 'react';
import { Link } from 'react-router-dom';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { PageTitle } from 'common';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import {
  actions,
  selectIsMoreDiscussions,
  selectGroupedDiscussions,
} from '../../redux/modules/spaceApp';
import { actions as teamListActions } from '../../redux/modules/teamList';
import { CreateDiscussionModal } from './CreateDiscussionModal';
import { Discussion } from './Discussion';
import wallyMissingImage from 'common/src/assets/images/wally-missing.svg';
import { bundle } from 'react-kinetic-core';

const HomeComponent = ({
  spaceName,
  kapps,
  teams,
  discussionsEnabled,
  discussionGroups,
  discussionsError,
  discussionsLoading,
  discussionsSearchTerm,
  discussionsSearchInputValue,
  discussionServerUrl,
  isMoreDiscussions,
  me,
  handleCreateDiscussionButtonClick,
  handleDiscussionSearchInputChange,
  handleDiscussionSearchInputSubmit,
  handleLoadMoreButtonClick,
  handleHomeLinkClick,
}) => (
  <div className="page-container page-container--space-home">
    <PageTitle parts={['Home']} />
    <CreateDiscussionModal />
    <div className="page-panel page-panel--space-home">
      <h4 className="space-home-title">Welcome to kinops for {spaceName}</h4>
      {discussionsEnabled ? (
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link onClick={handleHomeLinkClick} to="/">
                home
              </Link>{' '}
              / {discussionsSearchTerm !== '' ? `search results` : ''}
            </h3>
            <h1>
              {discussionsSearchTerm !== ''
                ? `${discussionsSearchTerm}`
                : 'Recent Discussions'}
            </h1>
          </div>
          <div className="search-form--discussion">
            <div className="search-box search-box--discussion">
              <form
                onSubmit={handleDiscussionSearchInputSubmit}
                className="search-box__form"
              >
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search discussions"
                    onChange={handleDiscussionSearchInputChange}
                    className="form-control"
                    value={discussionsSearchInputValue}
                  />
                  <div className="input-group-append">
                    <button className="btn" type="submit">
                      <span className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <button
              onClick={handleCreateDiscussionButtonClick}
              className="btn btn-secondary"
            >
              New Discussion
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state empty-state--wally">
          <h5>Woops...</h5>
          <img src={wallyMissingImage} alt="Missing Wally" />
          <h6>
            Looks like this space does not have a Discussion Server configured!
          </h6>
        </div>
      )}

      {discussionsEnabled &&
        !discussionsError &&
        !discussionsLoading &&
        discussionGroups.size > 0 && (
          <div className="recent-discussions-wrapper kinops-discussions">
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
                      teams={teams}
                      me={me}
                      discussionServerUrl={discussionServerUrl}
                    />
                  ))}
                </div>
              ))
              .toList()}
            {isMoreDiscussions && (
              <div className="recent-discussion-actions">
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
      {!discussionsError &&
        !discussionsLoading &&
        discussionGroups.size === 0 && (
          <div className="empty-state empty-state--wally">
            <h5>No discussions found</h5>
            <img src={wallyMissingImage} alt="Missing Wally" />
            <h6>You are not involved in any discussions!</h6>
          </div>
        )}
    </div>
  </div>
);

export const mapStateToProps = state => ({
  spaceName: state.app.space.name,
  discussionGroups: selectGroupedDiscussions(state),
  discussionsError: state.space.spaceApp.discussionsError,
  discussionsLoading: state.space.spaceApp.discussionsLoading,
  discussionsLimit: state.space.spaceApp.discussionsLimit,
  discussionsOffset: state.space.spaceApp.discussionsOffset,
  discussionsSearchInputValue: state.space.spaceApp.discussionsSearchInputValue,
  discussionsSearchTerm: state.space.spaceApp.discussionsSearchTerm,
  discussionServerUrl: `${bundle.spaceLocation()}/kinetic-response`,
  isMoreDiscussions: selectIsMoreDiscussions(state),
  discussionsEnabled: selectDiscussionsEnabled(state),
  me: state.app.profile,
  teams: state.space.teamList.data,
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
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
    handleHomeLinkClick: props => event => {
      event.preventDefault();
      props.setDiscussionsSearchTerm('');
      props.setDiscussionsSearchInputValue('');
      props.searchDiscussions();
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
      this.props.discussionsEnabled && this.props.fetchDiscussions();
    },
  }),
)(HomeComponent);
