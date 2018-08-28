import React from 'react';
import moment from 'moment';
import { produceContent } from './MessagesGroup';

export const SystemMessagesGroup = props => (
  <div className="messages-group">
    <div className="system-message-list">
      {props.messages.map(message => (
        <div className="system-message" key={message.id}>
          {produceContent(message)}
          <span className="timestamp">
            {moment(message.createdAt).format('h:mma')}
          </span>
        </div>
      ))}
    </div>
  </div>
);
