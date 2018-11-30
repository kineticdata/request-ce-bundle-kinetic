import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { Avatar } from 'common';
import { actions } from '../redux/modules/discussions';

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
        .toList()
        .sortBy(p => p.name)
        .map(p => (
          <li className={`${p.present ? 'present' : ''}`} key={p.email}>
            <Avatar size={26} username={p.email} />
            {p.name}
          </li>
        ))}
      {props.discussion.invites.map(invite => (
        <li key={invite.email}>
          <Avatar size={26} username={invite.email} />
          {invite.email} <span className="subtext">invited</span>
        </li>
      ))}
    </ul>
  </div>
);

export const mapDispatchToProps = {
  openModal: actions.openModal,
};

export const ParticipantsDialogContainer = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  withHandlers({
    openInvitation: props => () =>
      props.openModal(props.discussion.issue.guid, 'invitation'),
  }),
)(ParticipantsDialog);
