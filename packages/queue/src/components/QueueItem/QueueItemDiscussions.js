import React from 'react';
import { Link } from 'react-router-dom';
import { Discussion } from 'react-kinops-discussions';

export const QueueItemDiscussions = props => {
  const { queueItem, discussionId, createDiscussion } = props;

  return discussionId ? (
    <Discussion
      discussionId={discussionId}
      isMobileModal
      renderClose={() => (
        <Link to={`/item/${queueItem.id}`} className="btn btn-link">
          Close
        </Link>
      )}
    />
  ) : (
    <div className="kinops-discussions hidden-sm-down">
      <div className="empty-discussion">
        <h6>No discussion to display</h6>
        <p>
          <button onClick={createDiscussion} className="btn btn-link">
            Create a new discussion
          </button>
        </p>
      </div>
    </div>
  );
};
