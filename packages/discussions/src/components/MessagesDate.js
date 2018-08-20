import React from 'react';
import { compose, shouldUpdate } from 'recompose';
import moment from 'moment';
import { MessagesGroupContainer } from './MessagesGroup';

export const MessagesDate = ({ discussion, messages, profile }) => (
  <div className="messages-date">
    <div className="date">
      <hr />
      <span>
        {moment(messages.first().first().created_at).format('MMMM Do, YYYY')}
      </span>
      <hr />
    </div>
    {messages.map(messagesGroup => (
      <MessagesGroupContainer
        discussion={discussion}
        key={messagesGroup.first().id}
        messages={messagesGroup}
        profile={profile}
      />
    ))}
  </div>
);

export const MessagesDateContainer = compose(
  shouldUpdate(
    (props, nextProps) =>
      !props.messages.equals(nextProps.messages) ||
      props.profile !== nextProps.profile,
  ),
)(MessagesDate);
