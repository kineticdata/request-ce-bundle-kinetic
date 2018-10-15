import React, { Fragment } from 'react';
import { compose, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';
import Avatar from 'react-avatar';
import moment from 'moment';
import Markdown from 'react-markdown';
import { bundle } from 'react-kinetic-core';
import { ParticipantCard } from './ParticipantCard';
import { Hoverable } from 'common';
import { MessageActionsContext } from './Discussion';

export const produceContent = message =>
  message.content.reduce((content, token) => {
    switch (token.type) {
      case 'team':
        return `${content}${token.value.name}`;
      case 'user':
        return `${content}${token.value.displayName}`;
      case 'attachment':
        return content;
      case 'unknownUser':
        return 'an unknown user';
      default:
        return `${content}${token.value}`;
    }
  }, '');

const editedClass = message =>
  message.createdAt !== message.updatedAt ? 'edited' : '';

const SUPPORTED_IMAGE_MIMES = [
  'image/gif',
  'image/png',
  'image/jpeg',
  'image/bmp',
  'image/webp',
  'image/x-icon',
  'image/vnd.microsoft.icon',
];

const attachmentUrl = (discussion, message, attachment, thumbnail = false) =>
  `${bundle.spaceLocation()}/app/discussions/api/v1/discussions/${
    discussion.id
  }/messages/${message.id}/files/${
    thumbnail ? attachment.thumbnailId : attachment.documentId
  }/${encodeURIComponent(attachment.filename.replace(/ /g, '_'))}`;

const formatFileSize = fileSize => {
  if (fileSize < 1024) return fileSize + ' bytes';
  else if (fileSize < 1048576) return (fileSize / 1024).toFixed(2) + ' kb';
  else if (fileSize < 1073741824)
    return (fileSize / 1048576).toFixed(2) + ' mb';
  else return (fileSize / 1073741824).toFixed(2) + ' gb';
};

export const TextMessage = ({ discussion, message }) => (
  <Fragment>
    <Markdown source={produceContent(message)} skipHtml />
    {message.content.filter(c => c.type === 'attachment').map(attachment => (
      <div
        key={attachment.value.documentId}
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '0.5em',
        }}
      >
        <a
          href={attachmentUrl(discussion, message, attachment.value)}
          target="_blank"
        >
          {SUPPORTED_IMAGE_MIMES.includes(attachment.value.contentType) ? (
            <img
              src={attachmentUrl(discussion, message, attachment.value, true)}
              alt={attachment.value.filename}
            />
          ) : (
            <span>
              {attachment.value.filename}{' '}
              <small>
                (<em>{formatFileSize(attachment.value.size)}</em>)
              </small>
            </span>
          )}
        </a>
        {SUPPORTED_IMAGE_MIMES.includes(attachment.value.contentType) && (
          <small>
            {attachment.value.filename} (<em>
              {formatFileSize(attachment.value.size)}
            </em>)
          </small>
        )}
      </div>
    ))}
  </Fragment>
);

export const Message = ({ discussion, message }) => (
  <div className={`message ${editedClass(message)}`}>
    <TextMessage discussion={discussion} message={message} />
    {message.parent &&
      message.parent.unknown !== true && (
        <div className="parent-message">
          <Message discussion={discussion} message={message.parent} />
          <small>&mdash; {message.parent.createdBy.displayName}</small>
        </div>
      )}
  </div>
);

export const MessageBubble = ({ discussion, message }) => (
  <div className="message-bubble">
    <Message discussion={discussion} message={message} />
  </div>
);

const getParticipant = (discussion, createdBy) =>
  discussion.participants.find(p => p.user.username === createdBy.username);

export const MessagesGroup = ({ discussion, messages, profile }) => (
  <MessageActionsContext.Consumer>
    {actions => (
      <div
        className={`messages-group ${
          messages.first().createdBy.username === profile.username
            ? 'mine'
            : 'other'
        }`}
      >
        {messages.first().createdBy.username !== profile.username && (
          <Hoverable
            key={messages.first().createdBy.id}
            render={() => (
              <ParticipantCard
                discussion={discussion}
                participant={getParticipant(
                  discussion,
                  messages.first().createdBy,
                )}
              />
            )}
          >
            <Avatar
              size={36}
              email={messages.first().createdBy.email}
              name={messages.first().createdBy.displayName}
              round
            />
          </Hoverable>
        )}
        <div className="message-list">
          {messages.map(message => (
            <div
              key={message.id}
              className={`message-list-item ${
                actions && actions.editMessageId === message.id ? 'editing' : ''
              } ${
                actions &&
                actions.replyMessage &&
                actions.replyMessage.id === message.id
                  ? 'replying'
                  : ''
              }`}
            >
              {actions &&
                (messages.first().createdBy.username === profile.username ? (
                  <ul className="actions meta">
                    <li>
                      <a role="button" onClick={() => actions.reply(message)}>
                        Reply
                      </a>
                    </li>
                    <li>
                      <a
                        role="button"
                        onClick={() => actions.editMessage(message)}
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        role="button"
                        onClick={() => actions.deleteMessage(message)}
                      >
                        Delete
                      </a>
                    </li>
                  </ul>
                ) : (
                  <ul className="actions meta">
                    <li>
                      <a role="button" onClick={() => actions.reply(message)}>
                        Reply
                      </a>
                    </li>
                  </ul>
                ))}
              <MessageBubble discussion={discussion} message={message} />
            </div>
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
    )}
  </MessageActionsContext.Consumer>
);

const mapStateToProps = state => ({
  discussionServerUrl: `${bundle.spaceLocation()}/kinetic-response`,
});

export const MessagesGroupContainer = compose(
  connect(mapStateToProps),
  shouldUpdate(
    (props, nextProps) =>
      !props.messages.equals(nextProps.messages) ||
      props.profile !== nextProps.profile,
  ),
)(MessagesGroup);
