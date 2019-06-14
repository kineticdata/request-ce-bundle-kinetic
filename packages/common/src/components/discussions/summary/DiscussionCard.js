import React from 'react';
import { List } from 'immutable';
import { Avatar } from 'common';
import { UserMessageGroup } from '@kineticdata/react';

export const DiscussionCard = ({ discussion, me, onDiscussionClick }) => {
  const displayableMessages = discussion
    ? discussion.messages.filter(m => m.type !== 'System').slice(-1)
    : [];
  const messages = List(displayableMessages);

  return (
    <div className="discussion__summary">
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

      {messages.size > 0 && (
        <div className="messages">
          <UserMessageGroup
            discussion={discussion}
            messages={messages}
            profile={me}
          />
        </div>
      )}
    </div>
  );
};
