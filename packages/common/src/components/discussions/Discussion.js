import React, { Fragment } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import {
  bundle,
  Discussion as KineticDiscussion,
  MessageHistory,
} from '@kineticdata/react';
import { ParticipantsHeaderContainer } from './ParticipantsHeader';
import { ArchivedBanner } from './ArchivedBanner';
import { connect } from '../../redux/store';
import { TIME_FORMAT } from 'common/src/constants';
import { DiscussionDetails } from './DiscussionDetails';
import { LoadingMessage } from '../StateMessages';
import { types as detailsTypes } from '../../redux/modules/discussionsDetails';
import {
  DiscussionFullPageError,
  DiscussionPanelError,
} from './DiscussionError';

export const DiscussionComponent = props => (
  <div className="discussion">
    <KineticDiscussion
      id={props.id}
      invitationToken={props.invitationToken}
      profile={props.me}
      toggleMessageHistory={props.openHistory}
      toggleInvitationForm={props.openInvitations}
      components={{
        DiscussionError: props.fullPage
          ? DiscussionFullPageError
          : DiscussionPanelError,
      }}
      loader={() => (
        <Fragment>
          {props.renderHeader && (
            <div className="discussion__header">{props.renderHeader({})}</div>
          )}
          <div className="discussion__subheader">
            {!!props.handleBackClick && (
              <button
                onClick={props.handleBackClick}
                className="btn btn-link btn-back"
              >
                <span className="icon">
                  <span className="fa fa-fw fa-chevron-left" />
                </span>
                Back to Discussions
              </button>
            )}
          </div>
          <LoadingMessage title="Loading Discussion" />
        </Fragment>
      )}
      render={({ elements, discussion, canManage }) => (
        <Fragment>
          {props.renderHeader && (
            <div className="discussion__header">
              {props.renderHeader({ discussion })}
            </div>
          )}
          <div className="discussion__subheader">
            {!!props.handleBackClick && (
              <button
                onClick={props.handleBackClick}
                className="btn btn-link btn-back"
              >
                <span className="icon">
                  <span className="fa fa-fw fa-chevron-left" />
                </span>
                Back to Discussions
              </button>
            )}
            {/*<button className="btn btn-icon">
            <span className="icon">
              <span className="fa fa-users" />
              <span className="badge badge-dark">
                {discussion.participants.size}
              </span>
            </span>
          </button>*/}
            <button className="btn btn-icon" onClick={props.openDetails}>
              <span className="icon">
                <span className="fa fa-info-circle" />
              </span>
            </button>
            {!props.isFullScreen && (
              <button
                className="btn btn-icon"
                onClick={props.openInNewTab}
                title="Expand Discussion"
              >
                <span className="icon">
                  <span className="fa fa-expand" />
                </span>
              </button>
            )}
          </div>
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
              profile={props.me}
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
                  profile={props.me}
                  timeFormat={TIME_FORMAT}
                />
              </ModalBody>
            </Modal>
          </div>
        </Fragment>
      )}
    />
  </div>
);

export const mapStateToProps = (state, props) => ({
  messageHistory: state.discussionsDetails.getIn([props.id, 'messageHistory']),
  isFullScreen:
    state.router.location.pathname &&
    state.router.location.pathname.startsWith('/discussion'),
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
  openDetails: () =>
    dispatch({
      type: detailsTypes.OPEN,
      payload: { id: props.id },
    }),
  close: () =>
    dispatch({ type: detailsTypes.CLOSE, payload: { id: props.id } }),
  openInNewTab: () =>
    window.open(
      `${bundle.spaceLocation()}/#/discussions/${props.id}`,
      '_blank',
    ),
});

export const Discussion = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DiscussionComponent);
