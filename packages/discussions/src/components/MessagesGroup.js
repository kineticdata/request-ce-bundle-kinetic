import React from 'react';
import { compose, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';
import { Avatar } from 'common';
import moment from 'moment';
import Markdown from 'react-markdown';
import { bundle } from 'react-kinetic-core';
import { ParticipantCard } from './ParticipantCard';

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

export const TextMessage = ({ message }) => (
  <Markdown className="message" source={message.body} skipHtml />
);

export const MessagesGroup = ({ messages, profile, discussionServerUrl }) => (
  <div
    className={`messages-group ${
      messages.first().user.email === profile.email ? 'mine' : 'other'
    }`}
  >
    {messages.first().user.email !== profile.email && (
      <Avatar
        key={messages.first().user.id}
        size={36}
        username={messages.first().user.email}
      />
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
                messages.first().user.email === profile.email ? 'mine' : 'other'
              }
            />
          ) : (
            <TextMessage key={message.id} message={message} />
          ),
      )}
      <div className="meta">
        <span className="author">
          {messages.last().user.email === profile.email
            ? 'You'
            : messages.last().user.name}
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
