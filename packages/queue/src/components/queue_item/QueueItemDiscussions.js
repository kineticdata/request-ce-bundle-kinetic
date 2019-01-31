import React from 'react';
import { Discussion } from 'discussions';
import { I18n } from '../../../../app/src/I18nProvider';

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
        <h5>
          <I18n>No discussion to display</I18n>
        </h5>
        <p>
          <button onClick={createDiscussion} className="btn btn-link">
            <I18n>Create a new discussion</I18n>
          </button>
        </p>
      </div>
    </div>
  );
};
