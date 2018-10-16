import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { compose } from 'recompose';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverBody,
} from 'reactstrap';
import classNames from 'classnames';
import ContentEditable from './ContentEditable';

import { actions } from '../redux/modules/discussions';

const VALID_IMG_TYPES = [
  'image/jpeg',
  'image/bmp',
  'image/gif',
  'image/x-icon',
  'image/png',
  'image/svg+xml',
];

const canShowPreview = file =>
  file.preview && VALID_IMG_TYPES.includes(file.type);

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatInput: '',
      actionsOpen: false,
      fileAttachment: null,
      hasFocus: false,
    };

    this.handleSendChatMessage = this.handleSendChatMessage.bind(this);
    this.handleChatHotKey = this.handleChatHotKey.bind(this);
    this.handleChatInput = this.handleChatInput.bind(this);
    this.handleAttachmentDrop = this.handleAttachmentDrop.bind(this);
    this.handleAttachmentClick = this.handleAttachmentClick.bind(this);
    this.handleAttachmentCancel = this.handleAttachmentCancel.bind(this);
    this.handleDropzoneRef = this.handleDropzoneRef.bind(this);
    this.isChatInputInvalid = this.isChatInputInvalid.bind(this);
    this.toggleActionsOpen = this.toggleActionsOpen.bind(this);
    this.setActionsOpen = this.setActionsOpen.bind(this);
    this.cancelAction = this.cancelAction.bind(this);
  }

  componentDidMount() {
    this.props.registerChatInput(this);
  }

  handleSendChatMessage(e) {
    e.preventDefault();
    if (this.props.editMessageId) {
      this.props.setEditMessageId(null);
      this.props.sendMessageUpdate(
        this.props.discussion.id,
        this.props.editMessageId,
        this.state.chatInput,
        this.state.fileAttachment,
      );
    } else {
      this.props.sendMessage(
        this.props.discussion.id,
        this.state.chatInput,
        this.state.fileAttachment,
        this.props.replyMessage && this.props.replyMessage.id,
      );
      if (this.props.replyMessage) {
        this.props.setReplyMessage(null);
      }
    }
    this.setState({ chatInput: '', fileAttachment: null });
  }

  handleChatHotKey({ nativeEvent: e }) {
    if (
      e.keyCode === 13 &&
      !e.shiftKey &&
      this.state.chatInput.trim().length > 0
    ) {
      // Handle enter (but not shift enter.)
      this.handleSendChatMessage(e);
    } else if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
    }
  }

  handleChatInput(event, value) {
    this.setState({ chatInput: value });
  }

  editMessage(message) {
    this.setState({
      chatInput: message.content[0].value,
    });
    this.contentEditable.focus();
  }

  focus() {
    this.contentEditable.focus();
  }

  cancelAction() {
    this.props.setEditMessageId(null);
    this.props.setReplyMessage(null);
    this.setState({ chatInput: '', fileAttachment: null });
  }

  handleAttachmentDrop(files) {
    // Store the dropped/selected file.
    this.setState({ fileAttachment: files[0] });

    // And in case the action menu was open, close it.
    this.setActionsOpen(false);
  }

  handleAttachmentClick() {
    this.dropzone.open();
  }

  handleAttachmentCancel() {
    this.setState({ fileAttachment: null });
  }

  handleDropzoneRef(dropzone) {
    this.dropzone = dropzone;
  }

  toggleActionsOpen() {
    this.setState(state => ({ actionsOpen: !state.actionsOpen }));
  }

  setActionsOpen(actionsOpen) {
    this.setState({ actionsOpen });
  }

  isChatInputInvalid() {
    return !this.state.chatInput && !this.state.fileAttachment;
  }

  handleFocus = () => {
    this.setState({ hasFocus: true });
  };

  handleBlur = () => {
    this.setState({ hasFocus: false });
  };

  render() {
    return (
      <Dropzone
        disableClick
        ref={this.handleDropzoneRef}
        onDrop={this.handleAttachmentDrop}
        multiple={false}
        style={{}}
      >
        <form
          onSubmit={this.handleSendChatMessage}
          className={`new-message ${
            this.props.editMessageId ? 'editing' : ''
          } ${this.props.replyMessage ? 'replying' : ''}`}
        >
          <ButtonDropdown
            isOpen={this.state.actionsOpen}
            toggle={this.toggleActionsOpen}
            direction="up"
          >
            <DropdownToggle color="subtle">
              <i className="fa fa-fw fa-plus" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.handleAttachmentClick}>
                <i className="fa fa-fw fa-paperclip" /> Add File
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  this.props.openModal(this.props.discussion.id, 'invitation')
                }
              >
                <i className="fa fa-fw fa-plus" /> Invite Person
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          <Popover
            className="reply-popover"
            placement="top-start"
            hideArrow
            isOpen={!!this.props.replyMessage}
            target="chatInput"
          >
            {this.props.replyMessage && (
              <PopoverBody>
                &#x21AA; In reply to{' '}
                {this.props.replyMessage.createdBy.displayName}
              </PopoverBody>
            )}
          </Popover>
          <div className="input-container" id="chatInput">
            {this.state.fileAttachment !== null && (
              <div
                className="icon-wrapper"
                style={{
                  display: 'flex',
                  backgroundColor: '#fff',
                  height: '24px',
                  minWidth: '96px',
                  maxWidth: '182px',
                  color: '#54698D',
                  fontSize: '10px',
                  lineHeight: '12px',
                  marginBottom: '0.5em',
                }}
              >
                {canShowPreview(this.state.fileAttachment) && (
                  <img
                    src={this.state.fileAttachment.preview}
                    alt={this.state.fileAttachment.name}
                    style={{ width: '24px', height: '24px' }}
                  />
                )}
                <span style={{ flex: '1', marginLeft: '0.5em' }}>
                  {this.state.fileAttachment.name}
                </span>
                <button
                  className="btn btn-icon"
                  type="button"
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  onClick={this.handleAttachmentCancel}
                >
                  <i className="fa fa-fw fa-times" />
                </button>
              </div>
            )}
            <div
              className={classNames('placeholder', {
                hidden: this.state.chatInput !== '',
              })}
            >
              Type your message here&hellip;
            </div>
            <ContentEditable
              ref={element => (this.contentEditable = element)}
              tabIndex={0}
              tagName="div"
              className="message-input"
              contentEditable="plaintext-only"
              html={this.state.chatInput}
              onChange={this.handleChatInput}
              onKeyPress={this.handleChatHotKey}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </div>
          {(this.props.editMessageId || this.props.replyMessage) && (
            <button
              type="button"
              className="btn btn-subtle btn-cancel"
              onClick={this.cancelAction}
            >
              <i className="fa fa-fw fa-times" />
            </button>
          )}
          <button
            type="submit"
            className="btn btn-subtle btn-send"
            disabled={this.isChatInputInvalid()}
          >
            {this.props.editMessageId ? (
              <i className="fa fa-fw fa-check" />
            ) : (
              <i className="fa fa-fw fa-paper-plane" />
            )}
          </button>
        </form>
        {this.state.hasFocus && (
          <div className="markdown-help">
            <strong className="markdown-sample">*Bold*</strong>
            <em className="markdown-sample">_Italics</em>
            <strike className="markdown-sample">Strike</strike>
            <span className="markdown-sample">!Blockquote</span>
          </div>
        )}
      </Dropzone>
    );
  }
}

const mapDispatchToProps = {
  sendMessage: actions.sendMessage,
  sendMessageUpdate: actions.sendMessageUpdate,
  openModal: actions.openModal,
};

export const ChatInputForm = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
)(ChatInput);
