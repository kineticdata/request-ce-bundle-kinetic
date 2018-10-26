import React from 'react';
import moment from 'moment';
import { List, Range } from 'immutable';
import { MessageActionsContext } from './Discussion';
import generateSystemMessageContent from '../helpers/generateSystemMessageContent';

export const PlainMessageContent = ({ content }) => {
  const plainContent = content
    .map(token => {
      switch (token.type) {
        case 'team':
          return token.value.name;
        case 'text':
          return token.value.trim();
        case 'user':
          return token.value.displayName;
        default:
          return `(${token.type.toUpperCase()})`;
      }
    })
    .join(' ');
  return plainContent.length > 50
    ? plainContent.substring(0, 50) + '...'
    : plainContent;
};

export const SystemMessageContent = ({ content }) =>
  List(content)
    .map((token, i) => {
      switch (token.type) {
        case 'message':
          return (
            <MessageActionsContext.Consumer key={i}>
              {actions => (
                <span
                  className="message-token"
                  onClick={() => actions.viewMessageVersions(token.value)}
                >
                  [{' '}
                  <PlainMessageContent key={i} content={token.value.content} />{' '}
                  ]
                </span>
              )}
            </MessageActionsContext.Consumer>
          );
        case 'team':
          return (
            <span key={i} className="team-token">
              {token.value.name}
            </span>
          );
        case 'text':
          return (
            <span key={i} className="text-token">
              {token.value.trim()}
            </span>
          );
        case 'user':
          return (
            <span key={i} className="user-token">
              {token.value.displayName}
            </span>
          );
        default:
          return <span key={i}>({token.type.toUpperCase()})</span>;
      }
    })
    .zip(Range().map(i => <span key={`space-${i}`}>&nbsp;</span>))
    .toArray();

export const SystemMessagesGroup = props => (
  <div className="messages-group">
    <div className="system-message-list">
      {props.messages.map(message => (
        <div className="system-message" key={message.id}>
          <SystemMessageContent
            content={
              message.action
                ? generateSystemMessageContent(message.action, message.content)
                : message.content
            }
          />
          <span className="timestamp">
            {moment(message.createdAt).format('h:mma')}
          </span>
        </div>
      ))}
    </div>
  </div>
);
