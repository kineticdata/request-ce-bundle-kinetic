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

const AVAILABLE_ICONS = [
  'avi',
  'excel',
  'html',
  'illustrator',
  'movie',
  'indesign',
  'mpeg',
  'pdf',
  'photoshop',
  'powerpoint',
  'txt',
  'unknown',
  'word',
];

const getUploadImage = (message, discussionServerUrl) => {
  if (
    message.messageable.file_processing ||
    message.messageable.file_processing === null
  ) {
    return `${discussionServerUrl}/assets/images/loader.gif`;
  }

  if (message.messageable.file_content_type.startsWith('image')) {
    return `${discussionServerUrl}${message.url}`;
  }

  let iconType = message.messageable.file_content_type.split('/')[1];

  if (AVAILABLE_ICONS.indexOf(iconType) !== -1) {
    return `${discussionServerUrl}/assets/images/${iconType}_128.png`;
  }

  return `${discussionServerUrl}/assets/images/unknown_128.png`;
};

const getUploadLink = (message, discussionServerUrl) => {
  if (
    message.messageable.file_processing ||
    message.messageable.file_processing === null
  ) {
    return '';
  }

  return `${discussionServerUrl}${message.url}`;
};

export const UploadMessage = ({
  message,
  messageOwner,
  discussionServerUrl,
}) => (
  <div className={`message message-upload message-${messageOwner} img-fluid`}>
    <a
      className="upload-image"
      href={getUploadLink(message, discussionServerUrl)}
      target="_blank"
    >
      <img
        src={getUploadImage(message, discussionServerUrl)}
        alt={
          message.messageable.description || message.messageable.file_file_name
        }
      />
    </a>
    {!message.messageable.file_content_type.startsWith('image') && (
      <div className="upload-filename">
        <small>{message.messageable.file_file_name}</small>
      </div>
    )}
    {message.messageable.description !== null &&
      message.messageable.description !== '' && (
        <div className="upload-description">
          {message.messageable.description}
        </div>
      )}
  </div>
);

export const produceContent = message =>
  message.content.reduce((content, token) => {
    switch (token.type) {
      case 'team':
        return `${content}${token.value.name}`;
      case 'user':
        return `${content}${token.value.displayName}`;
      case 'unknownUser':
        return 'an unknown user';
      default:
        return `${content}${token.value}`;
    }
  }, '');

const editedClass = message =>
  message.createdAt !== message.updatedAt ? 'edited' : '';

export const TextMessage = ({ message }) => (
  <Markdown source={produceContent(message)} skipHtml />
);

export const Message = ({ message }) => (
  <div className={`message ${editedClass(message)}`}>
    <TextMessage message={message} />
    {message.parent &&
      message.parent.unknown !== true && (
        <div className="parent-message">
          <Message message={message.parent} />
          <small>&mdash; {message.parent.createdBy.displayName}</small>
        </div>
      )}
  </div>
);

export const MessageBubble = ({ message }) => (
  <div className="message-bubble">
    <Message message={message} />
  </div>
);

const getParticipant = (discussion, createdBy) =>
  discussion.participants.find(p => p.user.username === createdBy.username);

export const MessagesGroup = ({
  discussion,
  messages,
  profile,
  discussionServerUrl,
}) => (
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
          {messages.map(
            message =>
              message.messageable_type === 'Upload' ? (
                <div key={message.id} className="message-list-item">
                  <UploadMessage
                    message={message}
                    discussionServerUrl={discussionServerUrl}
                    messageOwner={
                      messages.first().createdBy.username === profile.username
                        ? 'mine'
                        : 'other'
                    }
                  />
                </div>
              ) : (
                <div
                  key={message.id}
                  className={`message-list-item ${
                    actions && actions.editMessageId === message.id
                      ? 'editing'
                      : ''
                  } ${
                    actions &&
                    actions.replyMessage &&
                    actions.replyMessage.id === message.id
                      ? 'replying'
                      : ''
                  }`}
                >
                  {actions &&
                    (messages.first().createdBy.username ===
                    profile.username ? (
                      <ul className="actions meta">
                        <li>
                          <a
                            role="button"
                            onClick={() => actions.reply(message)}
                          >
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
                          <a
                            role="button"
                            onClick={() => actions.reply(message)}
                          >
                            Reply
                          </a>
                        </li>
                      </ul>
                    ))}
                  <MessageBubble message={message} />
                </div>
              ),
          )}
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
