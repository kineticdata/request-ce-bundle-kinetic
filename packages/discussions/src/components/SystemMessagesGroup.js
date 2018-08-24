import React from 'react';
import moment from 'moment';
import { produceContent } from './MessagesGroup';

export const SystemMessagesGroup = props => (
  <div className="messages-group">
    <div className="system-message-list">
      {props.messages.map(
        message =>
          console.log(message) || (
            <div className="system-message" key={message.id}>
              {produceContent(message)}
              <span className="timestamp">
                {moment(message.created_at).format('h:mma')}
              </span>
            </div>
          ),
      )}
    </div>
  </div>
);
