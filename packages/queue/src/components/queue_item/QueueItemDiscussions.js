import React from 'react';
import { Discussion, DiscussionsList } from 'discussions';

export const QueueItemDiscussions = props => {
  const {
    discussionId,
    profile,
    handleCreateDiscussion,
    relatedDiscussions,
    handleDiscussionClick,
    handleDiscussionClear,
  } = props;

  return discussionId ? (
    <div className="kinops-discussions d-none d-md-flex">
      <button onClick={handleDiscussionClear} className="btn btn-link btn-back">
        <span className="icon">
          <span className="fa fa-fw fa-chevron-left" />
        </span>
        Back to Discussions
      </button>
      <Discussion
        discussionId={discussionId}
        isMobileModal
        renderClose={() => null}
      />
    </div>
  ) : relatedDiscussions.size > 0 ? (
    <div className="recent-discussions-wrapper kinops-discussions d-none d-md-flex">
      <DiscussionsList
        handleCreateDiscussion={handleCreateDiscussion}
        handleDiscussionClick={handleDiscussionClick}
        discussions={relatedDiscussions}
        me={profile}
      />
    </div>
  ) : (
    <div className="kinops-discussions d-none d-md-flex">
      <div className="empty-discussion">
        <h5>No discussion to display</h5>
        <p>
          <button onClick={handleCreateDiscussion} className="btn btn-link">
            Create a new discussion
          </button>
        </p>
      </div>
    </div>
  );
};
