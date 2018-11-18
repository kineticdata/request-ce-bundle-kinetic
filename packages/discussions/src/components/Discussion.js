import React, { Fragment } from 'react';
import { Modal } from 'reactstrap';
import { List, Map } from 'immutable';
import { DiscussionEditDialog } from './DiscussionEditDialog';
import { ParticipantsDialogContainer } from './ParticipantsDialog';
import { InvitationDialog } from './InvitationDialog';
import {
  Discussion as KineticDiscussion,
  MessageHistory,
  DiscussionAPI,
} from 'discussions-lib';
import { ParticipantsHeaderContainer } from './ParticipantsHeader';
import { ArchivedBanner } from './ArchivedBanner';
import { connect } from 'react-redux';

const titles = Map({
  edit: 'Edit Discussion',
  participants: 'All Participants',
  invitations: 'Invite Participants',
});

const DiscussionLoader = props => (
  <div className="discussion is-loading">Loading...</div>
);

const ModalContent = ({ modal, ...props }) => (
  <Fragment>
    <div className="modal-header">
      <h4 className="modal-title">
        <button type="button" className="btn btn-link" onClick={props.close}>
          Close
        </button>
        <span>{titles.get(modal.type, 'Discussion')}</span>
        {props.onLeave && modal.type === 'participants' && (
          <button
            type="button"
            className="btn btn-link text-danger"
            onClick={props.onLeave}
          >
            Leave
          </button>
        )}
      </h4>
    </div>
    {modal.type === 'edit' ? (
      <DiscussionEditDialog {...props} />
    ) : modal.type === 'participants' ? (
      <ParticipantsDialogContainer {...props} />
    ) : modal.type === 'invitations' ? (
      <InvitationDialog {...props} />
    ) : modal.type === 'history' ? (
      <MessageHistory {...props} message={modal.data} />
    ) : null}
  </Fragment>
);

export class DiscussionComponent extends React.Component {
  state = { modals: List() };

  open = type => data => {
    this.setState(state => ({ modals: state.modals.push({ type, data }) }));
  };

  close = all => () => {
    all
      ? this.setState({ modals: List() })
      : this.setState(state => ({ modals: state.modals.pop() }));
  };

  handleLeave = async () => {
    await DiscussionAPI.removeParticipant(
      this.props.id,
      this.props.profile.username,
    );
    if (typeof this.props.onLeave === 'function') {
      this.props.onLeave();
    }
  };

  render() {
    return (
      <KineticDiscussion
        id={this.props.id}
        invitationtoken={this.props.invitationToken}
        profile={this.props.profile}
        toggleMessageHistory={this.open('history')}
        toggleInvitationForm={this.open('invitations')}
        render={({ elements, discussion, canManage }) => (
          <div className="kinops-discussions">
            <div className="messages">{elements.messages}</div>
            <ParticipantsHeaderContainer
              discussion={discussion}
              canManage={canManage}
              open={this.open}
            />
            {discussion.isArchived && (
              <ArchivedBanner canManage={canManage} open={this.open('edit')} />
            )}
            {elements.viewUnreadButton}
            {elements.chatInput}
            {!this.state.modals.isEmpty() && (
              <Modal isOpen toggle={this.close(true)}>
                <ModalContent
                  modal={this.state.modals.last()}
                  discussion={discussion}
                  open={this.open}
                  close={this.close(false)}
                  onLeave={this.props.onLeave && this.handleLeave}
                />
              </Modal>
            )}
          </div>
        )}
      />
    );
  }
}

export const Discussion = connect(state => ({
  profile: state.app.profile,
}))(DiscussionComponent);
