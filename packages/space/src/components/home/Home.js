import React from 'react';
import { Link } from '@reach/router';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { getGroupedDiscussions } from '@kineticdata/react';
import { GroupDivider } from 'common';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import { actions } from '../../redux/modules/spaceApp';
import { actions as teamListActions } from '../../redux/modules/teamList';
import { CreateDiscussionModal } from './CreateDiscussionModal';
import { Discussion } from './Discussion';
import wallyMissingImage from 'common/src/assets/images/wally-missing.svg';
import { bundle } from '@kineticdata/react';
import { Popover } from 'reactstrap';
import { DateRangeDropdown } from './DateRangeDropdown';
import { I18n } from '@kineticdata/react';
import { context } from '../../redux/store';
import { PageTitle } from '../shared/PageTitle';

const HomeComponent = ({
  spaceName,
  kapps,
  teams,
  discussionsEnabled,
  discussionGroups,
  discussionsError,
  discussionsPageTokens,
  discussionsLoading,
  discussionsSearchTerm,
  discussionsSearchInputValue,
  discussionServerUrl,
  createModalOpen,
  me,
  handleCreateDiscussionButtonClick,
  handleDiscussionSearchInputChange,
  handleDiscussionSearchInputSubmit,
  handleLoadMoreButtonClick,
  handlePrevPage,
  handleNextPage,
  handleHomeLinkClick,
  headerDropdownOpen,
  toggleHeaderDropdown,
  showingArchived,
  toggleShowingArchived,
}) => (
  <div className="page-container page-container--space-home">
    <PageTitle parts={['Home']} />
    {createModalOpen && <CreateDiscussionModal />}
    <div className="page-panel page-panel--space-home">
      {discussionsEnabled ? (
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link onClick={handleHomeLinkClick} to="/">
                <I18n>discussions</I18n>
              </Link>{' '}
              /{' '}
              {discussionsSearchTerm !== '' ? <I18n>search results</I18n> : ''}
            </h3>
            <h1>
              {discussionsSearchTerm !== '' ? (
                `${discussionsSearchTerm}`
              ) : showingArchived ? (
                <I18n>Archived</I18n>
              ) : (
                <I18n>Recent</I18n>
              )}
              <button
                className="btn btn-link"
                id="header-dropdown"
                onClick={toggleHeaderDropdown}
              >
                <i className="fa fa-fw fa-caret-down" />
              </button>
              <Popover
                isOpen={headerDropdownOpen}
                toggle={toggleHeaderDropdown}
                target="header-dropdown"
                placement="bottom-end"
              >
                <button
                  className="btn btn-link"
                  onClick={toggleShowingArchived}
                >
                  <I18n>
                    {showingArchived ? 'Recent' : 'Archived'} Discussions
                  </I18n>
                </button>
              </Popover>
            </h1>
          </div>

          <div className="search-form--discussion">
            <div className="search-box search-box--discussion">
              <form
                onSubmit={handleDiscussionSearchInputSubmit}
                className="search-box__form"
              >
                <div className="input-group">
                  <I18n
                    render={translate => (
                      <input
                        type="text"
                        placeholder={translate('Search discussions')}
                        onChange={handleDiscussionSearchInputChange}
                        className="form-control"
                        value={discussionsSearchInputValue}
                      />
                    )}
                  />
                  <div className="input-group-append">
                    <button className="btn" type="submit">
                      <span className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {showingArchived ? (
              <DateRangeDropdown />
            ) : (
              <button
                onClick={handleCreateDiscussionButtonClick}
                className="btn btn-secondary"
              >
                <I18n>New Discussion</I18n>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-state empty-state--wally">
          <h5>
            <I18n>Woops...</I18n>
          </h5>
          <img src={wallyMissingImage} alt="Missing Wally" />
          <h6>
            <I18n>
              Looks like this space does not have a Discussion Server
              configured!
            </I18n>
          </h6>
        </div>
      )}

      {discussionsEnabled &&
        !discussionsError &&
        !discussionsLoading &&
        discussionGroups.size > 0 && (
          <div className="page-panel--discussions discussions--space-home page-panel--discussions-recent">
            {discussionGroups
              .map((discussions, dateGroup) => (
                <div className="discussion__messages" key={dateGroup}>
                  <GroupDivider value={dateGroup} className="my-4" />
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
            <div className="discussion__actions">
              {discussionsPageTokens.size > 1 && (
                <button className="btn btn-primary" onClick={handlePrevPage}>
                  Prev
                </button>
              )}
              &nbsp;
              {discussionsPageTokens.size > 0 &&
                discussionsPageTokens.last() !== null && (
                  <button className="btn btn-primary" onClick={handleNextPage}>
                    Next
                  </button>
                )}
            </div>
          </div>
        )}
      {!discussionsError &&
        !discussionsLoading &&
        discussionGroups.size === 0 && (
          <div className="empty-state empty-state--wally">
            <h5>
              <I18n>No discussions found</I18n>
            </h5>
            <img src={wallyMissingImage} alt="Missing Wally" />
            <h6>
              <I18n>You are not involved in any discussions!</I18n>
            </h6>
          </div>
        )}
    </div>
  </div>
);

export const mapStateToProps = state => ({
  spaceName: state.app.space.name,
  discussionGroups: getGroupedDiscussions(state.spaceApp.discussions),
  discussionsError: state.spaceApp.discussionsError,
  discussionsLoading: state.spaceApp.discussionsLoading,
  discussionsPageToken: state.spaceApp.discussionsPageToken,
  discussionsPageTokens: state.spaceApp.discussionsPageTokens,
  discussionsSearchInputValue: state.spaceApp.discussionsSearchInputValue,
  discussionsSearchTerm: state.spaceApp.discussionsSearchTerm,
  discussionServerUrl: `${bundle.spaceLocation()}/kinetic-response`,
  discussionsEnabled: selectDiscussionsEnabled(state),
  createModalOpen: state.spaceApp.isCreateDiscussionModalOpen,
  me: state.app.profile,
  teams: state.teamList.data,
  headerDropdownOpen: state.spaceApp.headerDropdownOpen,
  showingArchived: state.spaceApp.showingArchived,
});

export const mapDispatchToProps = {
  fetchDiscussions: actions.fetchDiscussions,
  fetchTeams: teamListActions.fetchTeams,
  searchDiscussions: actions.searchDiscussions,
  setCreateDiscussionModalOpen: actions.setCreateDiscussionModalOpen,
  setDiscussionsPageToken: actions.setDiscussionsPageToken,
  setDiscussionsSearchInputValue: actions.setDiscussionsSearchInputValue,
  setDiscussionsSearchTerm: actions.setDiscussionsSearchTerm,
  popDiscussionPageToken: actions.popDiscussionPageToken,
  clearDiscussionPageTokens: actions.clearDiscussionPageTokens,
  toggleHeaderDropdown: actions.toggleHeaderDropdown,
  toggleShowingArchived: actions.toggleShowingArchived,
};

export const Home = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withHandlers({
    handleCreateDiscussionButtonClick: props => event =>
      props.setCreateDiscussionModalOpen(true),
    handleDiscussionSearchInputChange: props => event =>
      props.setDiscussionsSearchInputValue(event.target.value),
    handleDiscussionSearchInputSubmit: props => event => {
      event.preventDefault();
      props.setDiscussionsPageToken(null);
      props.clearDiscussionPageTokens();
      props.searchDiscussions();
      props.setDiscussionsSearchTerm(props.discussionsSearchInputValue);
    },
    handleHomeLinkClick: props => event => {
      event.preventDefault();
      props.setDiscussionsSearchTerm('');
      props.setDiscussionsSearchInputValue('');
      props.setDiscussionsPageToken(null);
      props.clearDiscussionPageTokens();
      props.searchDiscussions();
    },
    handleNextPage: ({
      discussionsPageTokens,
      setDiscussionsPageToken,
      fetchDiscussions,
    }) => _event => {
      const nextToken = discussionsPageTokens.last();
      setDiscussionsPageToken(nextToken);
      fetchDiscussions();
    },
    handlePrevPage: ({
      discussionsPageTokens,
      setDiscussionsPageToken,
      popDiscussionPageToken,
      fetchDiscussions,
    }) => _event => {
      // The last token is the next page, the one before that is the current page,
      // and one more is the previous page.
      const prevToken = discussionsPageTokens.get(-3) || null;
      popDiscussionPageToken(prevToken);
      setDiscussionsPageToken(prevToken);
      fetchDiscussions();
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchTeams();
      this.props.discussionsEnabled && this.props.fetchDiscussions();
    },
    componentWillUnmount() {
      this.props.clearDiscussionPageTokens();
      this.props.setDiscussionsPageToken(null);
    },
  }),
)(HomeComponent);
