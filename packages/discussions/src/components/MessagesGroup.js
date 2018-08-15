import React from 'react';
import { compose, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';
import Avatar from 'react-avatar';
import moment from 'moment';
import Markdown from 'react-markdown';
import { bundle } from 'react-kinetic-core';
import { ParticipantCard } from './ParticipantCard';
import { Hoverable } from 'common';

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

const produceContent = message =>
  message.content.reduce((content, token) => (content += token.value), '');

export const TextMessage = ({ message }) => (
  <Markdown className="message" source={produceContent(message)} skipHtml />
);

export const MessagesGroup = ({ messages, profile, discussionServerUrl }) => (
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
          <ParticipantCard participant={messages.first().createdBy} />
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
            <UploadMessage
              key={message.id}
              message={message}
              discussionServerUrl={discussionServerUrl}
              messageOwner={
                messages.first().createdBy.username === profile.username
                  ? 'mine'
                  : 'other'
              }
            />
          ) : (
            <TextMessage key={message.id} message={message} />
          ),
      )}
      <div className="meta">
        <span className="author">
          {messages.last().createdBy.username === profile.username
            ? 'You'
            : messages.last().createdBy.displayName}
        </span>
        <span className="timestamp">
          {moment(messages.last().created_at).format('h:mma')}
        </span>
      </div>
    </div>
  </div>
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
