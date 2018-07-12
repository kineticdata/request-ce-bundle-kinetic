import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { LoadMoreMessages } from './LoadMoreMessagesContainer';
import { MessagesDateContainer } from './MessagesDate';
import { ChatInputForm } from './ChatInputForm';
import { ScrollHelper } from './ScrollHelper';
import { ParticipantsHeaderContainer } from './ParticipantsHeader';
import { ParticipantsDialogContainer } from './ParticipantsDialog';
import { InvitationDialogContainer } from './InvitationDialog';
import { VisibilityHelper } from './VisibilityHelper';

const Messages = ({
  discussion,
  handleScrolled,
  profile,
  formattedMessages,
  unreadMessages,
  registerScrollHelper,
  scrollToBottom,
}) => (
  <div className="messages">
    <ScrollHelper ref={registerScrollHelper} onScrollTo={handleScrolled}>
      <LoadMoreMessages discussion={discussion} />
      {formattedMessages.map(messagesForDate => (
        <MessagesDateContainer
          key={messagesForDate.first().first().created_at}
          messages={messagesForDate}
          profile={profile}
        />
      ))}
    </ScrollHelper>
    <ParticipantsHeaderContainer discussion={discussion} />
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
);

const DiscussionModal = props => {
  const {
    discussion,
    currentOpenModals,
    closeCurrent,
    closeAll,
    // createDiscussion,
    createInvitation,
    invitationButtonEnabled,
    participantsAndInvites,
    // isSmallLayout,
    isModal,
    renderClose,
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
              {currentOpenModals.last() === 'invitation' ? 'Cancel' : 'Close'}
            </button>
          )}
          <span>
            {currentOpenModals.last() === 'discussion'
              ? 'Discussion'
              : currentOpenModals.last() === 'participants'
                ? 'All Participants'
                : 'Invite Participants'}
          </span>
        </h4>
      </div>
      {currentOpenModals.last() === 'participants' ? (
        <ModalBody>
          <ParticipantsDialogContainer discussion={discussion} />
        </ModalBody>
      ) : currentOpenModals.last() === 'invitation' ? (
        <ModalBody>
          <InvitationDialogContainer
            discussion={discussion}
            createInvitation={createInvitation}
            participantsAndInvites={participantsAndInvites}
          />
        </ModalBody>
      ) : currentOpenModals.last() === 'discussion' ? (
        <ModalBody className="kinops-discussions-modal-body">
          <Messages {...props} />
          <ChatInputForm discussion={discussion} />
        </ModalBody>
      ) : (
        <div>Nothing to display</div>
      )}
      {currentOpenModals.last() === 'invitation' && (
        <ModalFooter>
          <button
            type="button"
            className="btn btn-primary"
            onClick={createInvitation}
            disabled={!invitationButtonEnabled}
          >
            Send Invite
          </button>
        </ModalFooter>
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
  } = props;

  if (discussion && isModal) {
    return (
      <div className="kinops-discussions d-none d-md-flex">
        <DiscussionModal {...props} />
      </div>
    );
  } else if (discussion && isMobileModal) {
    return (
      <div className="kinops-discussions d-none d-md-flex">
        {!isSmallLayout && <Messages {...props} />}
        {!isSmallLayout && <ChatInputForm discussion={discussion} />}
        <DiscussionModal {...props} />
      </div>
    );
  }

  return discussion ? (
    <div className="kinops-discussions">
      <VisibilityHelper onChange={setDiscussionVisibility}>
        <Messages {...props} />
      </VisibilityHelper>
      <ChatInputForm discussion={discussion} />
      <DiscussionModal {...props} />
    </div>
  ) : null;
};
