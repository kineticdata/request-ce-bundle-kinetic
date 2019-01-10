import React from 'react';
import { SystemMessage } from './SystemMessage';

export const SystemMessageGroup = props => (
  <div className="messages__grouping">
    <div className="system-message-list">
      {props.messages.map(message => (
        <SystemMessage
          key={message.id}
          message={message}
          actions={props.actions}
        />
      ))}
    </div>
  </div>
);
