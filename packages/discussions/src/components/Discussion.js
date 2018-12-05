import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import {
  Discussion as KineticDiscussion,
  MessageHistory,
} from 'discussions-lib';
import { ParticipantsHeaderContainer } from './ParticipantsHeader';
import { ArchivedBanner } from './ArchivedBanner';
import { connect } from 'react-redux';
import { DiscussionDetails } from './DiscussionDetails';
import { types as detailsTypes } from '../redux/modules/discussionsDetails';

export const DiscussionComponent = props => (
  <KineticDiscussion
    id={props.id}
    invitationtoken={props.invitationToken}
    profile={props.profile}
    toggleMessageHistory={props.openHistory}
    toggleInvitationForm={props.openInvitations}
    render={({ elements, discussion, canManage }) => (
      <div className="kinops-discussions">
        <div className="messages">{elements.messages}</div>
        <ParticipantsHeaderContainer discussion={discussion} />
        {discussion.isArchived && (
          <ArchivedBanner canManage={canManage} open={props.openEdit} />
        )}
        {elements.viewUnreadButton}
        {elements.chatInput}
        <DiscussionDetails
          discussion={discussion}
          profile={props.profile}
          onLeave={props.onLeave}
        />
        <Modal isOpen={props.messageHistory} toggle={props.close}>
          <ModalHeader>
            <button
              type="button"
              className="btn btn-link"
              onClick={props.close}
            >
              Close
            </button>
            <span>Message History</span>
          </ModalHeader>
          <ModalBody>
            <MessageHistory
              discussion={discussion}
              message={props.messageHistory}
            />
          </ModalBody>
        </Modal>
      </div>
    )}
  />
);

export const mapStateToProps = (state, props) => ({
  profile: state.app.profile,
  messageHistory: state.discussions.discussionsDetails.getIn([
    props.id,
    'messageHistory',
  ]),
});
export const mapDispatchToProps = (dispatch, props) => ({
  openEdit: () =>
    dispatch({
      type: detailsTypes.OPEN,
      payload: { id: props.id, view: 'edit' },
    }),
  openInvitations: () =>
    dispatch({
      type: detailsTypes.OPEN,
      payload: { id: props.id, view: 'invitations' },
    }),
  openHistory: message =>
    dispatch({
      type: detailsTypes.OPEN_HISTORY,
      payload: { id: props.id, message },
    }),
  close: () =>
    dispatch({ type: detailsTypes.CLOSE, payload: { id: props.id } }),
});

export const Discussion = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DiscussionComponent);
