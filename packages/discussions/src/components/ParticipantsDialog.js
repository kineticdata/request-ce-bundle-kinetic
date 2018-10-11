import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Avatar from 'react-avatar';
import { actions } from '../redux/modules/discussions';
import { isPresent } from '../helpers';

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
      {props.discussion.invitations.map(
        i =>
          i.user ? (
            <li key={i.user.username}>
              <Avatar size={26} round email={i.user.email} />
              {i.user.displayName} <span className="subtext">invited</span>
              <span className="subtext">
                (<span className="text-danger">send a reminder?</span>)
              </span>
            </li>
          ) : (
            <li key={i.email}>
              <Avatar size={26} round email={i.email} />
              {i.email} <span className="subtext">invited</span>
              <span className="subtext">
                (<span className="text-danger">send a reminder?</span>)
              </span>
            </li>
          ),
      )}
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
      props.openModal(props.discussion.id, 'invitation'),
  }),
)(ParticipantsDialog);
