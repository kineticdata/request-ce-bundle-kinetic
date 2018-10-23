import React, { Fragment } from 'react';
import { Utils } from 'common';
import { DiscussionCard } from './DiscussionCard';

export const DiscussionsList = ({
  handleCreateDiscussion,
  handleDiscussionClick,
  discussions,
  me,
}) => {
  const discussionGroup = Utils.getGroupedDiscussions(discussions);
  return (
    <Fragment>
      <button
        onClick={handleCreateDiscussion}
        className="btn btn-inverse"
        style={{ flex: '1 0 auto' }}
      >
        Create a new discussion
      </button>

      {discussionGroup
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
  );
};
