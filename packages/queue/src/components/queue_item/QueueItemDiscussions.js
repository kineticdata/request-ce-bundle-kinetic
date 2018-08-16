import React from 'react';
import { Discussion } from 'discussions';

export const QueueItemDiscussions = props => {
  const { discussionId, createDiscussion } = props;

  return discussionId ? (
    <Discussion
      discussionId={discussionId}
      isMobileModal
      renderClose={() => null}
    />
  ) : (
    <div className="kinops-discussions d-none d-md-flex">
      <div className="empty-discussion">
        <h5>No discussion to display</h5>
        <p>
          <button onClick={createDiscussion} className="btn btn-link">
            Create a new discussion
          </button>
        </p>
      </div>
    </div>
  );
};
