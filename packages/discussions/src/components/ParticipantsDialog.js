import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { toastActions } from 'common';
import { Avatar } from 'common';
import { isPresent } from '../helpers';
import { DiscussionAPI } from 'discussions-lib';
import { ModalBody } from 'reactstrap';

export const ParticipantsDialog = props => (
  <ModalBody>
    <div className="discussion-dialog modal-form participants-dialog">
      <h1>
        Participants
        <button
          type="button"
          className="btn btn-icon"
          onClick={props.openInvitation}
        >
          <i className="fa fa-fw fa-plus" />
        </button>
      </h1>
      <ul className="participants-list">
        {props.discussion.participants
          .map(p => p.user)
          .filter(p => !p.unknown)
          .sortBy(p => p.name)
          .map(p => (
            <li
              className={
                isPresent(props.discussion, p.username) ? 'present' : ''
              }
              key={p.email}
            >
              <Avatar size={26} username={p.username} />
              {p.displayName}
            </li>
          ))}
        {props.discussion.invitations.map(i => (
          <li key={i.user ? i.user.username : i.email}>
            <Avatar size={26} username={i.user ? i.user.username : i.email} />
            {i.user ? i.user.displayName : i.email}{' '}
            <span className="subtext">invited</span>
            <button
              className="subtext btn btn-link"
              onClick={props.reinvite(i)}
            >
              (<span className="text-danger">send a reminder?</span>)
            </button>
          </li>
        ))}
      </ul>
    </div>
  </ModalBody>
);

export const mapDispatchToProps = {
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const ParticipantsDialogContainer = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  withHandlers({
    openInvitation: props => props.open('invitations'),
    reinvite: props => invitation => async () => {
      const {
        invitation: updatedInvitation,
        error,
      } = await DiscussionAPI.resendInvite({
        discussionId: props.discussion.id,
        username: invitation.user && invitation.user.username,
        email: invitation.email,
      });
      if (updatedInvitation) {
        props.addSuccess('Successfully sent reminder.');
      } else {
        props.addError(
          `Failed to send reminder. ${
            error ? error.response.data.message : ''
          }`,
        );
      }
    },
  }),
)(ParticipantsDialog);
