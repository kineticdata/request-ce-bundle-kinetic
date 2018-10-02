import { connect } from 'react-redux';
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps,
} from 'recompose';
import { List } from 'immutable';

import { actions, formatMessages } from '../redux/modules/discussions';
import {
  selectors,
  actions as invitationFormActions,
} from '../redux/modules/invitationForm';
import { toastActions } from 'common';

import { Discussion } from './Discussion';

const mapStateToProps = (state, props) => {
  const discussion =
    props.discussionId &&
    state.discussions.discussions.discussions.get(props.discussionId);

  return {
    profile: state.app.profile,
    discussion,
    messages: discussion ? discussion.messages.items : List(),
    hasMoreMessages: discussion && discussion.messages.pageToken !== null,
    loadingMoreMessages: discussion && discussion.loadingMoreMessages,
    currentOpenModals: state.discussions.discussions.currentOpenModals,
    isSmallLayout: state.app.layout.get('size') === 'small',
    pageTitleInterval: state.discussions.discussions.pageTitleInterval,
    invitationValue: state.discussions.invitationForm.value,
    invitationButtonEnabled: selectors.submittable(state),
  };
};

const mapDispatchToProps = {
  joinDiscussion: actions.joinDiscussion,
  leaveDiscussion: actions.leaveDiscussion,
  revokeParticipant: actions.revokeParticipant,
  fetchMoreMessages: actions.fetchMoreMessages,
  addWarn: toastActions.addWarn,
  createDiscussion: actions.createIssue,
  openModal: actions.openModal,
  closeModal: actions.closeModal,
  createInviteDone: actions.createInviteDone,
  setDiscussionVisibility: actions.setDiscussionVisibility,
  setPageTitleInterval: actions.setPageTitleInterval,
  send: invitationFormActions.send,
  deleteMessage: actions.deleteMessage,
};

const closeCurrent = props => () => {
  props.closeModal(props.currentOpenModals.last());
  props.createInviteDone();
};
const closeAll = props => () => {
  props.closeModal();
  props.createInviteDone();
};

const handleLeave = ({
  discussionId,
  profile,
  revokeParticipant,
  onLeave,
}) => () => {
  revokeParticipant(discussionId, profile.username, onLeave);
};
const send = props => () => {
  props.send(props.discussion, props.invitationValue);
};

const handleScrollToTop = ({
  discussion,
  hasMoreMessages,
  loadingMoreMessages,
  fetchMoreMessages,
}) => () => {
  // If there are more messages to retrieve and a message fetch
  // is not currently in progress.
  if (hasMoreMessages && !loadingMoreMessages) {
    fetchMoreMessages(discussion.id);
  }
};

const handleScrollToBottom = props => () => {
  props.setUnreadMessages(false);
};

const handleScrollToMiddle = () => () => {
  // nothing to do right now.
};

const handleScrolled = ({
  handleScrollToTop,
  handleScrollToMiddle,
  handleScrollToBottom,
  setScrollPosition,
}) => position => {
  setScrollPosition(position);
  switch (position) {
    case 'top':
      handleScrollToTop();
      break;
    case 'middle':
      handleScrollToMiddle();
      break;
    case 'bottom':
      handleScrollToBottom();
      break;
    default:
      console.error('Invalid scroll position from ScrollHelper!');
  }
};

const deleteMessage = props => message => {
  props.deleteMessage(props.discussion.id, message.id);
};

export const DiscussionContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    participantsAndInvites: props.discussion
      ? props.discussion.invites
          .map(i => i.email)
          .concat(props.discussion.participants.toList().map(p => p.email))
      : List(),
  })),
  withState('formattedMessages', 'setFormattedMessages', List()),
  withState('unreadMessages', 'setUnreadMessages', false),
  withState('scrollPosition', 'setScrollPosition', 'bottom'),
  withState('editMessageId', 'setEditMessageId', null),
  withState('replyMessage', 'setReplyMessage', null),
  withHandlers(() => {
    let ref;
    let chatInput;
    return {
      registerScrollHelper: () => element => (ref = element),
      scrollToBottom: () => () => ref.scrollToBottom(),
      registerChatInput: () => element => (chatInput = element),
      editMessage: props => message => {
        props.setEditMessageId(message.id);
        props.setReplyMessage(null);
        chatInput.editMessage(message);
      },
      reply: props => message => {
        props.setEditMessageId(null);
        props.setReplyMessage(message);
        chatInput.focus();
      },
    };
  }),
  withHandlers({
    // createDiscussion,
    handleScrollToBottom,
    handleScrollToMiddle,
    handleScrollToTop,
    closeCurrent,
    closeAll,
    send,
    handleLeave,
    deleteMessage,
  }),
  withHandlers({
    handleScrolled,
  }),
  lifecycle({
    componentWillMount() {
      this.props.setFormattedMessages(formatMessages(this.props.messages));
      if (this.props.discussionId) {
        this.props.joinDiscussion(
          this.props.discussionId,
          this.props.invitationToken,
        );
        this.props.setDiscussionVisibility('visible');
      }
    },
    componentWillUnmount() {
      if (this.props.discussionId) {
        this.props.leaveDiscussion(this.props.discussionId);
      }
      if (this.props.pageTitleInterval !== null) {
        clearInterval(this.props.pageTitleInterval);
        this.props.setPageTitleInterval(null);
      }
      if (this.props.currentOpenModals.size > 0) {
        this.props.closeAll();
      }
    },
    componentWillReceiveProps(nextProps) {
      // Join a different discussion if the discussion ID has changed.
      if (this.props.discussionId !== nextProps.discussionId) {
        if (this.props.discussionId) {
          this.props.leaveDiscussion(this.props.discussionId);
        }
        if (nextProps.discussionId) {
          this.props.joinDiscussion(
            nextProps.discussionId,
            nextProps.invitationToken,
          );
        }
      }
      // Process the messages if the contents have changed.
      if (!this.props.messages.equals(nextProps.messages)) {
        this.props.setFormattedMessages(formatMessages(nextProps.messages));
        if (
          this.props.scrollPosition !== 'bottom' &&
          nextProps.messages
            // get the messages that are newer than the messages we previously
            // had, we do not care about older messages being loaded above only
            // new messages below
            .slice(0, nextProps.messages.indexOf(this.props.messages.first()))
            // if any of the new messages were not sent by the current user we
            // consider them to be unread
            .some(
              message => message.createdBy.email !== this.props.profile.email,
            )
        ) {
          this.props.setUnreadMessages(true);
        }
      }
    },
  }),
)(Discussion);
