import React, { Fragment } from 'react';
import { getGroupedDiscussions } from '@kineticdata/react';
import { DiscussionCard } from './DiscussionCard';
import { StateListWrapper } from '../../StateMessages';

export const DiscussionsList = ({
  discussions,
  error,
  handleCreateDiscussionClick,
  handleDiscussionClick,
  renderHeader,
  me,
}) => (
  <div className="discussion discussion--list">
    <div className="discussion--list__header">
      {renderHeader
        ? renderHeader()
        : handleCreateDiscussionClick && (
            <div className="discussion--list__header-content">
              <button
                onClick={handleCreateDiscussionClick}
                className="btn btn-inverse btn-block"
              >
                New Discussion
              </button>
            </div>
          )}
    </div>
    <div className="discussion__content">
      <StateListWrapper
        data={discussions}
        error={error}
        loadingTitle="Loading Discussions"
        emptyTitle="No discussions to display"
      >
        {data => (
          <Fragment>
            {getGroupedDiscussions(data)
              .map((discussions, dateGroup) => (
                <div className="discussion__summaries" key={dateGroup}>
                  <div className="date-divider">
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
        )}
      </StateListWrapper>
    </div>
  </div>
);
