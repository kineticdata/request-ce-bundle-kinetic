import React from 'react';
import moment from 'moment';
import Avatar from 'react-avatar';
import { UserMessage } from './UserMessage';

export const UserMessageGroup = ({
  discussion,
  messages,
  profile,
  actions,
}) => (
  <div
    className={`messages__grouping ${
      messages.first().createdBy.username === profile.username
        ? 'is-mine'
        : 'is-other'
    }`}
  >
    {messages.first().createdBy.username !== profile.username && (
      <Avatar
        size={36}
        email={messages.first().createdBy.email}
        name={messages.first().createdBy.displayName}
        round
      />
    )}
    <div className="message-list">
      {messages.map(message => (
        <UserMessage
          key={message.id}
          discussion={discussion}
          message={message}
          actions={actions}
          profile={profile}
        />
      ))}
      <div className="meta">
        <span className="author">
          {messages.last().createdBy.username === profile.username
            ? 'You'
            : messages.last().createdBy.displayName}
        </span>
        <span className="timestamp">
          {moment(messages.last().createdAt).format('h:mma')}
        </span>
      </div>
    </div>
  </div>
);
