import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Avatar from 'react-avatar';
import { toastActions } from 'common';
import { actions } from '../redux/modules/discussions';
import { isPresent } from '../helpers';
import { resendInvite } from '../discussion_api';

export const ParticipantsDialog = props => (
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
        .sortBy(p => p.name)
        .map(p => (
          <li
            className={isPresent(props.discussion, p.username) ? 'present' : ''}
            key={p.email}
          >
            <Avatar size={26} email={p.email} name={p.displayName} round />
            {p.displayName}
          </li>
        ))}
      {props.discussion.invitations.map(i => (
        <li key={i.user ? i.user.username : i.email}>
          <Avatar size={26} round email={i.user ? i.user.email : i.email} />
          {i.user ? i.user.displayName : i.email}{' '}
          <span className="subtext">invited</span>
          <button className="subtext btn btn-link" onClick={props.reinvite(i)}>
            (<span className="text-danger">send a reminder?</span>)
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export const mapStateToProps = state => ({
  token: state.discussions.socket.token,
});

export const mapDispatchToProps = {
  openModal: actions.openModal,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const ParticipantsDialogContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    openInvitation: props => () =>
      props.openModal(props.discussion.id, 'invitation'),
    reinvite: props => invitation => async () => {
      const { invitation: updatedInvitation, error } = await resendInvite({
        discussionId: props.discussion.id,
        username: invitation.user && invitation.user.username,
        email: invitation.email,
        token: props.token,
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
