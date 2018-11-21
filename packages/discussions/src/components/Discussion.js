import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { LoadMoreMessages } from './LoadMoreMessagesContainer';
import { MessagesDateContainer } from './MessagesDate';
import { ChatInputForm } from './ChatInputForm';
import { ScrollHelper } from './ScrollHelper';
import { ParticipantsHeaderContainer } from './ParticipantsHeader';
import { ParticipantsDialogContainer } from './ParticipantsDialog';
import { InvitationDialog } from './InvitationDialog';
import { DiscussionEditDialog } from './DiscussionEditDialog';
import { VisibilityHelper } from './VisibilityHelper';
import { MessageVersionsModal } from './message_history/MessageVersionsModal';
import { ArchivedBanner } from './ArchivedBanner';

export const MessageActionsContext = React.createContext();

const Messages = ({
  discussion,
  handleScrolled,
  profile,
  formattedMessages,
  unreadMessages,
  registerScrollHelper,
  scrollToBottom,
  deleteMessage,
  editMessage,
  editMessageId,
  reply,
  replyMessage,
  viewMessageVersions,
  canManage,
}) => (
  <MessageActionsContext.Provider
    value={{
      deleteMessage,
      editMessage,
      editMessageId,
      reply,
      replyMessage,
      viewMessageVersions,
    }}
  >
    <div className="messages">
      <ScrollHelper ref={registerScrollHelper} onScrollTo={handleScrolled}>
        <LoadMoreMessages discussion={discussion} />
        {formattedMessages.map(messagesForDate => (
          <MessagesDateContainer
            discussion={discussion}
            key={messagesForDate.first().first().createdAt}
            messages={messagesForDate}
            profile={profile}
          />
        ))}
      </ScrollHelper>
      <ParticipantsHeaderContainer
        discussion={discussion}
        canManage={canManage}
      />
      {discussion.isArchived && (
        <ArchivedBanner discussion={discussion} canManage={canManage} />
      )}
      {unreadMessages && (
        <button
          type="button"
          className="btn btn-primary more-messages"
          onClick={scrollToBottom}
        >
          New messages
          <i className="fa fa-fw fa-arrow-down" />
        </button>
      )}
    </div>
  </MessageActionsContext.Provider>
);

const getModalTitle = modalName => {
  switch (modalName) {
    case 'discussion':
      return 'Discussion';
    case 'participants':
      return 'All Participants';
    case 'invitation':
      return 'Invite Participants';
    case 'edit':
      return 'Edit Discussion';
    default:
      return null;
  }
};

const isModalSubmittable = modalName =>
  ['invitation', 'edit'].indexOf(modalName) !== -1;

const DiscussionModal = props => {
  const {
    discussion,
    currentOpenModals,
    closeCurrent,
    closeAll,
    // createDiscussion,
    participantsAndInvites,
    // isSmallLayout,
    isModal,
    renderClose,
    handleLeave,
    leavable,
    registerChatInput,
    editMessageId,
    setEditMessageId,
    replyMessage,
    setReplyMessage,
  } = props;
  return (
    <Modal
      isOpen={isModal || !currentOpenModals.isEmpty()}
      toggle={closeAll}
      size="md"
    >
      <div className="modal-header">
        <h4 className="modal-title">
          {currentOpenModals.isEmpty() ? (
            renderClose()
          ) : (
            <button
              type="button"
              className="btn btn-link"
              onClick={closeCurrent}
            >
              {isModalSubmittable(currentOpenModals.last())
                ? 'Cancel'
                : 'Close'}
            </button>
          )}
          <span>{getModalTitle(currentOpenModals.last())}</span>
          {leavable &&
            currentOpenModals.last() === 'participants' && (
              <button
                type="button"
                className="btn btn-link text-danger"
                onClick={handleLeave}
              >
                Leave
              </button>
            )}
        </h4>
      </div>
      {currentOpenModals.last() === 'participants' ? (
        <ModalBody>
          <ParticipantsDialogContainer discussion={discussion} />
        </ModalBody>
      ) : currentOpenModals.last() === 'invitation' ? (
        <InvitationDialog
          discussion={discussion}
          participantsAndInvites={participantsAndInvites}
        />
      ) : currentOpenModals.last() === 'discussion' ? (
        <ModalBody className="kinops-discussions-modal-body">
          <Messages {...props} />
          <ChatInputForm
            discussion={discussion}
            registerChatInput={registerChatInput}
            editMessageId={editMessageId}
            setEditMessageId={setEditMessageId}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
          />
        </ModalBody>
      ) : currentOpenModals.last() === 'edit' ? (
        <DiscussionEditDialog discussion={discussion} />
      ) : (
        <div />
      )}
    </Modal>
  );
};

export const Discussion = props => {
  const {
    discussion,
    isModal,
    isMobileModal,
    isSmallLayout,
    setDiscussionVisibility,
    registerChatInput,
    editMessageId,
    setEditMessageId,
    replyMessage,
    setReplyMessage,
    viewMessageVersions,
    viewingMessageVersions,
  } = props;

  if (discussion && isModal) {
    return (
      <div className="kinops-discussions d-none d-md-flex">
        <DiscussionModal {...props} />
      </div>
    );
  } else if (discussion && isMobileModal) {
    return (
      <div>
        {!isSmallLayout && <Messages {...props} />}
        {!isSmallLayout && (
          <ChatInputForm
            discussion={discussion}
            registerChatInput={registerChatInput}
            editMessageId={editMessageId}
            setEditMessageId={setEditMessageId}
          />
        )}
        <DiscussionModal {...props} />
        <MessageVersionsModal
          discussion={discussion}
          message={viewingMessageVersions}
          close={() => viewMessageVersions(null)}
        />
      </div>
    );
  }

  return discussion ? (
    <div className="kinops-discussions">
      <VisibilityHelper onChange={setDiscussionVisibility}>
        <Messages {...props} />
      </VisibilityHelper>
      <ChatInputForm
        discussion={discussion}
        registerChatInput={registerChatInput}
        editMessageId={editMessageId}
        setEditMessageId={setEditMessageId}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
      />
      <DiscussionModal {...props} />
      <MessageVersionsModal
        discussion={discussion}
        message={viewingMessageVersions}
        close={() => viewMessageVersions(null)}
      />
    </div>
  ) : null;
};
