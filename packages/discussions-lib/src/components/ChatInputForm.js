import React, { Component } from 'react';
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
import { Provider, connect, dispatch } from '../redux/store';
import { actions } from '../redux/reducer';

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

const UploadCard = ({ attachment, handleAttachmentCancel }) => (
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
      marginRight: '0.5em',
    }}
  >
    {canShowPreview(attachment) && (
      <img
        src={attachment.preview}
        alt={attachment.name}
        style={{
          width: '24px',
          height: '24px',
        }}
      />
    )}
    <span style={{ flex: '1', marginLeft: '0.5em' }}>{attachment.name}</span>
    <button
      className="btn btn-icon"
      type="button"
      style={{
        width: '24px',
        height: '24px',
        display: 'flex',
        justifyContent: 'center',
      }}
      onClick={handleAttachmentCancel(attachment)}
    >
      <i className="fa fa-fw fa-times" />
    </button>
  </div>
);

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatInput: '',
      actionsOpen: false,

      fileAttachments: [],
      hasFocus: false,
    };

    this.handleSendChatMessage = this.handleSendChatMessage.bind(this);
    this.handleChatHotKey = this.handleChatHotKey.bind(this);
    this.handleChatInput = this.handleChatInput.bind(this);
    this.handleAttachmentDrop = this.handleAttachmentDrop.bind(this);
    this.handleAttachmentClick = this.handleAttachmentClick.bind(this);
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
    if (this.props.messageActions.editing) {
      this.props.messageActions.edit(null);
      this.props.dispatch(
        actions.sendMessageUpdate(
          this.props.discussion.id,
          this.props.messageActions.editing.id,
          this.state.chatInput,
          this.state.fileAttachments,
        ),
      );
    } else {
      this.props.dispatch(
        actions.sendMessage(
          this.props.discussion.id,
          this.state.chatInput,
          this.state.fileAttachments,
          this.props.messageActions.replying &&
            this.props.messageActions.replying.id,
        ),
      );
      if (this.props.messageActions.replying) {
        this.props.messageActions.reply(null);
      }
    }
    this.setState({ chatInput: '', fileAttachments: [] });
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
    this.props.messageActions.edit(null);
    this.props.messageActions.reply(null);
    this.setState({ chatInput: '', fileAttachments: [] });
  }

  handleAttachmentDrop(files) {
    const notAlreadyAttached = files.filter(
      file => !this.state.fileAttachments.find(fa => fa.name === file.name),
    );

    // Store the dropped/selected file.
    this.setState({
      fileAttachments: this.state.fileAttachments.concat(notAlreadyAttached),
    });

    // And in case the action menu was open, close it.
    this.setActionsOpen(false);
  }

  handleAttachmentClick() {
    this.dropzone.open();
  }

  handleAttachmentCancel = attachment => _e => {
    this.setState({
      fileAttachments: this.state.fileAttachments.filter(a => a !== attachment),
    });
  };

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
    return !this.state.chatInput && this.state.fileAttachments.length === 0;
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
        multiple
        style={{}}
      >
        <form
          onSubmit={this.handleSendChatMessage}
          className={`new-message disabled ${
            this.props.messageActions.editing ? 'editing' : ''
          } ${this.props.messageActions.replying ? 'replying' : ''}`}
        >
          {!this.props.discussion.isArchived && (
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
                <DropdownItem onClick={this.props.toggleInvitationForm}>
                  <i className="fa fa-fw fa-plus" /> Invite Person
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          )}
          <Popover
            className="reply-popover"
            placement="top-start"
            hideArrow
            isOpen={!!this.props.messageActions.replying}
            target="chatInput"
          >
            {this.props.messageActions.replying && (
              <PopoverBody>
                &#x21AA; In reply to{' '}
                {this.props.messageActions.replying.createdBy.displayName}
              </PopoverBody>
            )}
          </Popover>
          <div className="input-container" id="chatInput">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {this.state.fileAttachments.map(attachment => (
                <UploadCard
                  key={attachment.name}
                  attachment={attachment}
                  handleAttachmentCancel={this.handleAttachmentCancel}
                />
              ))}
            </div>

            <div
              className={classNames('placeholder', {
                hidden:
                  this.state.chatInput !== '' ||
                  this.props.discussion.isArchived,
              })}
            >
              Type your message here&hellip;
            </div>
            {!this.props.discussion.isArchived ? (
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
            ) : (
              <div className="message-input disabled text-danger">
                This discussion has been archived and is read-only.
              </div>
            )}
          </div>
          {(this.props.messageActions.editing ||
            this.props.messageActions.replying) && (
            <button
              type="button"
              className="btn btn-subtle btn-cancel"
              onClick={this.cancelAction}
            >
              <i className="fa fa-fw fa-times" />
            </button>
          )}
          {!this.props.discussion.isArchived && (
            <button
              type="submit"
              className="btn btn-subtle btn-send"
              disabled={this.isChatInputInvalid()}
            >
              {this.props.messageActions.editing ? (
                <i className="fa fa-fw fa-check" />
              ) : (
                <i className="fa fa-fw fa-paper-plane" />
              )}
            </button>
          )}
        </form>
        {this.state.hasFocus && (
          <div className="markdown-help">
            <strong className="markdown-sample">**Bold**</strong>
            <em className="markdown-sample">_Italics_</em>
            <span className="markdown-sample">
              ~~<strike>Strike</strike>~~
            </span>
            <span className="markdown-sample">&gt;Blockquote</span>
          </div>
        )}
      </Dropzone>
    );
  }
}

export const ConnectedChatInputForm = compose(connect(null))(ChatInput);

export const ChatInputForm = props => (
  <Provider>
    <ConnectedChatInputForm {...props} />
  </Provider>
);
