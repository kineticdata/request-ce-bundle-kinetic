import React from 'react';
import { List } from 'immutable';
import { Avatar } from 'common';
import { MessagesGroup } from 'discussions';
export const DiscussionCard = ({ discussion, me, onDiscussionClick }) => {
  const displayableMessages = discussion
    ? discussion.messages.filter(m => m.type !== 'System').slice(-1)
    : [];
  const messages = List(displayableMessages);

  return (
    <div className="discussion-summary">
      <div className="header">
        <a className="header__title" onClick={onDiscussionClick(discussion)}>
          {discussion.title}
        </a>
        <div className="participants">
          {discussion.participants
            .filter(p => p.user.unknown !== true)
            .map(participant => (
              <Avatar
                key={participant.user.username}
                username={participant.user.username}
                size={24}
              />
            ))}
        </div>
      </div>

      <div className="messages">
        {messages.size > 0 && (
          <MessagesGroup
            discussion={discussion}
            messages={messages}
            profile={me}
          />
        )}
      </div>
    </div>
  );
};
