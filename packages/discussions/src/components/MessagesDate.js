import React from 'react';
import { compose, shouldUpdate } from 'recompose';
import moment from 'moment';
import { MessagesGroupContainer } from './MessagesGroup';
import { SystemMessagesGroup } from './SystemMessagesGroup';

export const MessagesDate = ({ discussion, messages, profile }) => (
  <div className="messages-date">
    <div className="date">
      <hr />
      <span>
        {moment(messages.first().first().created_at).format('MMMM Do, YYYY')}
      </span>
      <hr />
    </div>
    {messages.map(
      messagesGroup =>
        messagesGroup.first().type === 'User' ? (
          <MessagesGroupContainer
            discussion={discussion}
            key={messagesGroup.first().id}
            messages={messagesGroup}
            profile={profile}
          />
        ) : (
          <SystemMessagesGroup
            key={messagesGroup.first().id}
            messages={messagesGroup}
          />
        ),
    )}
  </div>
);

export const MessagesDateContainer = compose(
  shouldUpdate(
    (props, nextProps) =>
      !props.messages.equals(nextProps.messages) ||
      props.profile !== nextProps.profile,
  ),
)(MessagesDate);
