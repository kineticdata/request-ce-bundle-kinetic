import React, { Fragment } from 'react';
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
import {
  DiscussionFullPageError,
  DiscussionPanelError,
} from './DiscussionError';

export const DiscussionComponent = props => (
  <KineticDiscussion
    id={props.id}
    invitationToken={props.invitationToken}
    profile={props.profile}
    toggleMessageHistory={props.openHistory}
    toggleInvitationForm={props.openInvitations}
    components={{
      DiscussionError: props.fullPage
        ? DiscussionFullPageError
        : DiscussionPanelError,
    }}
    render={({ elements, discussion, canManage }) => (
      <Fragment>
        {props.renderHeader && props.renderHeader({ discussion })}
        <div className="discussion__content">
          <div className="discussion__messages">{elements.messages}</div>
          <ParticipantsHeaderContainer discussion={discussion} />
          {discussion.isArchived && (
            <ArchivedBanner canManage={canManage} open={props.openEdit} />
          )}
          {elements.viewUnreadButton}
          {elements.chatInput}
          <DiscussionDetails
            canManage={canManage}
            discussion={discussion}
            profile={props.profile}
            onLeave={props.onLeave}
          />
          <Modal isOpen={!!props.messageHistory} toggle={props.close}>
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
      </Fragment>
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
