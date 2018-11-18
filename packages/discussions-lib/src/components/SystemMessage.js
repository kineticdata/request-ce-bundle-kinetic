import React from 'react';
import { List, Range } from 'immutable';
import moment from 'moment';
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

export const SystemMessageContent = ({ actions, content }) =>
  List(content)
    .map((token, i) => {
      switch (token.type) {
        case 'message':
          return (
            <span
              key={i}
              className="message-token"
              onClick={() => actions.history(token.value)}
            >
              [ <PlainMessageContent key={i} content={token.value.content} /> ]
            </span>
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

export const SystemMessage = props => (
  <div className="system-message">
    <SystemMessageContent
      actions={props.actions}
      content={
        props.message.action
          ? generateSystemMessageContent(
              props.message.action,
              props.message.content,
            )
          : props.message.content
      }
    />
    <span className="timestamp">
      {moment(props.message.createdAt).format('h:mma')}
    </span>
  </div>
);
