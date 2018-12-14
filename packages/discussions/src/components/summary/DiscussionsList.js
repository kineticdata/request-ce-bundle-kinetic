import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import { getGroupedDiscussions } from 'discussions-lib';
import { DiscussionCard } from './DiscussionCard';
import { actions as listActions } from '../../redux/modules/discussionsList';
import { actions as discussionsActions } from '../../redux/modules/discussions';

export const DiscussionsListComponent = ({
  handleCreateDiscussion,
  handleDiscussionClick,
  discussions,
  me,
}) => {
  return discussions && discussions.size > 0 ? (
    <Fragment>
      <button onClick={handleCreateDiscussion} className="btn btn-inverse">
        New Discussion
      </button>

      {getGroupedDiscussions(discussions)
        .map((discussions, dateGroup) => (
          <div className="messages" key={dateGroup}>
            <div className="date">
              <hr />
              <span>{dateGroup}</span>
              <hr />
            </div>
            {discussions.map(discussion => (
              <DiscussionCard
                key={discussion.id}
                me={me}
                discussion={discussion}
                onDiscussionClick={handleDiscussionClick}
              />
            ))}
          </div>
        ))
        .toList()}
    </Fragment>
  ) : (
    <div className="empty-discussion">
      <h5>No discussion to display</h5>
      <p>
        <button onClick={handleCreateDiscussion} className="btn btn-link">
          Create a new discussion
        </button>
      </p>
    </div>
  );
};

const mapDispatchToProps = {
  fetchRelatedDiscussions: listActions.fetchRelatedDiscussions,
  createDiscussion: discussionsActions.createDiscussion,
};

const mapStateToProps = state => ({
  discussions: state.discussions.discussionsList.relatedDiscussions,
});
export const DiscussionsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchRelatedDiscussions(
        this.props.itemType,
        this.props.itemKey,
        this.props.onLoad,
      );
    },
  }),
)(DiscussionsListComponent);
