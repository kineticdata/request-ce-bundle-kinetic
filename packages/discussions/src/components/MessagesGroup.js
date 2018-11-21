import React, { Fragment } from 'react';
import { compose, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';
import { Avatar } from 'common';
import moment from 'moment';
import Markdown from 'react-markdown';
import { bundle } from 'react-kinetic-core';
import { ParticipantCard } from './ParticipantCard';
import { MessageActionsContext } from './Discussion';

import aviIcon from '../assets/images/avi_128.png';
import excelIcon from '../assets/images/excel_128.png';
import htmlIcon from '../assets/images/html_128.png';
import illustratorIcon from '../assets/images/illustrator_128.png';
import indesignIcon from '../assets/images/indesign_128.png';
import movieIcon from '../assets/images/movie_128.png';
import mpegIcon from '../assets/images/mpeg_128.png';
import pdfIcon from '../assets/images/pdf_128.png';
import photoshopIcon from '../assets/images/photoshop_128.png';
import powerpointIcon from '../assets/images/powerpoint_128.png';
import txtIcon from '../assets/images/txt_128.png';
import unknownIcon from '../assets/images/unknown_128.png';
import wordIcon from '../assets/images/word_128.png';

// Import images used.
const AVAILABLE_ICONS = {
  avi: aviIcon,
  excel: excelIcon,
  html: htmlIcon,
  illustrator: illustratorIcon,
  movie: movieIcon,
  indesign: indesignIcon,
  mpeg: mpegIcon,
  pdf: pdfIcon,
  photoshop: photoshopIcon,
  powerpoint: powerpointIcon,
  txt: txtIcon,
  unknown: unknownIcon,
  word: wordIcon,
};

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

const thumbnailUrl = (discussion, message, attachment) =>
  SUPPORTED_IMAGE_MIMES.includes(attachment.contentType)
    ? `${bundle.spaceLocation()}/app/discussions/api/v1/discussions/${
        discussion.id
      }/messages/${message.id}/files/${
        attachment.thumbnailId
      }/${encodeURIComponent(attachment.filename.replace(/ /g, '_'))}`
    : attachmentIcon(attachment);

const attachmentUrl = (discussion, message, attachment) =>
  `${bundle.spaceLocation()}/app/discussions/api/v1/discussions/${
    discussion.id
  }/messages/${message.id}/files/${attachment.documentId}/${encodeURIComponent(
    attachment.filename.replace(/ /g, '_'),
  )}`;

const attachmentIcon = attachment => {
  const iconType = attachment.contentType.split('/')[1];

  if (Object.keys(AVAILABLE_ICONS).includes(iconType)) {
    return AVAILABLE_ICONS[iconType];
  }
  return AVAILABLE_ICONS['unknown'];
};

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
          <img
            src={thumbnailUrl(discussion, message, attachment.value)}
            alt={attachment.value.filename}
          />
        </a>

        <small>
          {attachment.value.filename} (<em>
            {formatFileSize(attachment.value.size)}
          </em>)
        </small>
      </div>
    ))}
  </Fragment>
);

export const Message = ({ discussion, message }) => (
  <div className={`message ${editedClass(message)}`}>
    <TextMessage discussion={discussion} message={message} />
    {message.createdAt !== message.updatedAt && (
      <MessageActionsContext.Consumer>
        {actions =>
          actions && (
            <button
              className="btn btn-link"
              onClick={() => actions.viewMessageVersions(message)}
            >
              <em>(Edited)</em>
            </button>
          )
        }
      </MessageActionsContext.Consumer>
    )}
    {message.parent && (
      <div className="parent-message">
        {message.parent.unknown ? (
          <div className="message message-missing">(Message missing)</div>
        ) : message.parent.omitted ? null : (
          <Fragment>
            <Message discussion={discussion} message={message.parent} />
            <small>
              &mdash; {message.parent.createdBy.displayName || 'Unknown'}
            </small>
          </Fragment>
        )}
      </div>
    )}
  </div>
);

export const MessageBubble = ({ discussion, message }) => (
  <div className="message-bubble">
    <Message discussion={discussion} message={message} />
  </div>
);

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
          <Avatar
            key={messages.first().createdBy.username}
            size={36}
            username={messages.first().createdBy.username}
          />
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
