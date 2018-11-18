import React, { Fragment } from 'react';
import { bundle } from 'react-kinetic-core';
import Markdown from 'react-markdown';
import classnames from 'classnames';

// Import images used.
import aviIcon from '../../../discussions/src/assets/images/avi_128.png';
import excelIcon from '../../../discussions/src/assets/images/excel_128.png';
import htmlIcon from '../../../discussions/src/assets/images/html_128.png';
import illustratorIcon from '../../../discussions/src/assets/images/illustrator_128.png';
import movieIcon from '../../../discussions/src/assets/images/movie_128.png';
import indesignIcon from '../../../discussions/src/assets/images/indesign_128.png';
import mpegIcon from '../../../discussions/src/assets/images/mpeg_128.png';
import pdfIcon from '../../../discussions/src/assets/images/pdf_128.png';
import photoshopIcon from '../../../discussions/src/assets/images/photoshop_128.png';
import powerpointIcon from '../../../discussions/src/assets/images/powerpoint_128.png';
import txtIcon from '../../../discussions/src/assets/images/txt_128.png';
import unknownIcon from '../../../discussions/src/assets/images/unknown_128.png';
import wordIcon from '../../../discussions/src/assets/images/word_128.png';

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

export const Message = ({ discussion, message, actions }) => (
  <div className={`message ${editedClass(message)}`}>
    <TextMessage discussion={discussion} message={message} />
    {actions &&
      message.createdAt !== message.updatedAt && (
        <button
          className="btn btn-link"
          onClick={() => actions.history(message)}
        >
          <em>(Edited)</em>
        </button>
      )}
    {message.parent && (
      <div className="parent-message">
        {message.parent.unknown ? (
          <div className="message message-missing">(Message missing)</div>
        ) : message.parent.omitted ? null : (
          <Fragment>
            <Message
              discussion={discussion}
              message={message.parent}
              actions={actions}
            />
            <small>
              &mdash; {message.parent.createdBy.displayName || 'Unknown'}
            </small>
          </Fragment>
        )}
      </div>
    )}
  </div>
);

export const UserMessage = ({ discussion, message, profile, actions }) => (
  <div
    className={classnames('message-list-item', {
      editing: actions && actions.editing && actions.editing.id === message.id,
      replying:
        actions && actions.replying && actions.replying.id === message.id,
    })}
  >
    {actions && (
      <ul className="actions meta">
        <li>
          <a role="button" onClick={() => actions.reply(message)}>
            Reply
          </a>
        </li>
        {message.createdBy.username === profile.username && (
          <li>
            <a role="button" onClick={() => actions.edit(message)}>
              Edit
            </a>
          </li>
        )}
      </ul>
    )}
    <div className="message-bubble">
      <Message discussion={discussion} message={message} actions={actions} />
    </div>
  </div>
);
