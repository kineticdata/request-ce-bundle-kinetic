import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Avatar } from 'common';
import { isPresent } from '../helpers';
import { types } from '../redux/modules/discussionsDetails';
import { Popover, PopoverBody } from 'reactstrap';

export const ParticipantsList = props => (
  <div className="participants-list-wrapper">
    <h1>
      Participants
      <button
        type="button"
        className="btn btn-icon"
        onClick={props.openInvitations}
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
            className={isPresent(props.discussion, p.username) ? 'present' : ''}
            key={p.email}
          >
            <Avatar size={26} username={p.username} />
            {p.displayName}
            {props.kicks.get(p.username) === 'error' ? (
              <span className="subtext text-danger">
                <i className="fa fa-fw fa-exclamation-circle" />
                kick failed
              </span>
            ) : props.kicks.get(p.username) === 'kicking' ? (
              <span className="subtext text-danger">
                <button className="btn btn-link" disabled>
                  <i className="fa fa-fw fa-spin fa-spinner" />
                </button>
              </span>
            ) : (
              <Fragment>
                <span className="subtext">
                  <button
                    id="kick-participant"
                    className="btn btn-link"
                    onClick={props.kick(p)}
                  >
                    <i className="fa fa-fw fa-trash" />
                  </button>
                </span>
                <Popover
                  target="kick-participant"
                  isOpen={props.kicks.get(p.username) === 'confirming'}
                  toggle={props.kickCancel(p)}
                  placement="top"
                >
                  <PopoverBody>
                    <div>Are you sure?</div>
                    <button
                      className="btn btn-link"
                      onClick={props.kickCancel(p)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={props.kickConfirm(p)}
                    >
                      Kick
                    </button>
                  </PopoverBody>
                </Popover>
              </Fragment>
            )}
          </li>
        ))}
      {props.discussion.invitations.map(i => {
        const username = i.user ? i.user.username : i.email;
        const displayName = i.user ? i.user.username : i.email;
        const reinviteStatus = i.user
          ? props.userReinvites.get(i.user.username)
          : props.emailReinvites.get(i.email);
        const uninviteStatus = i.user
          ? props.userUninvites.get(i.user.username)
          : props.emailUninvites.get(i.email);
        const pending = reinviteStatus || uninviteStatus;
        return (
          <li key={username}>
            <Avatar size={26} username={username} />
            {displayName}
            {reinviteStatus === 'error' ? (
              <span className="subtext text-danger">
                <i className="fa fa-fw fa-exclamation-circle" />
                invitation failed
              </span>
            ) : uninviteStatus === 'error' ? (
              <span className="subtext text-danger">
                <i className="fa fa-fw fa-exclamation-circle" />
                uninvitation failed
              </span>
            ) : reinviteStatus === 'success' ? (
              <span className="subtext text-success">
                <i className="fa fa-fw fa-check-circle" />
                invitation sent
              </span>
            ) : uninviteStatus === 'success' ? (
              <span className="subtext text-success">
                <i className="fa fa-fw fa-check-circle" />
                invitation removed
              </span>
            ) : pending && pending !== 'confirming' ? (
              <Fragment>
                <span className="subtext">{pending}</span>
                <button className="btn btn-link" disabled>
                  <i className="fa fa-fw fa-spin fa-spinner" />
                </button>
              </Fragment>
            ) : (
              <Fragment>
                <span className="subtext">invited</span>
                <button className="btn btn-link" onClick={props.reinvite(i)}>
                  <i className="fa fa-fw fa-refresh" />
                </button>
                <button
                  id="remove-invitation"
                  className="btn btn-link text-danger"
                  onClick={props.uninvite(i)}
                >
                  <i className="fa fa-fw fa-close" />
                </button>
                <Popover
                  target="remove-invitation"
                  isOpen={uninviteStatus === 'confirming'}
                  toggle={props.uninviteCancel(i)}
                  placement="top"
                >
                  <PopoverBody>
                    <div>Are you sure?</div>
                    <button
                      className="btn btn-link"
                      onClick={props.uninviteCancel(i)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={props.uninviteConfirm(i)}
                    >
                      Uninvite
                    </button>
                  </PopoverBody>
                </Popover>
              </Fragment>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

export const mapStateToProps = (state, props) => {
  const id = props.discussion.id;
  return {
    userReinvites: state.discussions.discussionsDetails.getIn(
      [id, 'reinvites', 'user'],
      Map(),
    ),
    emailReinvites: state.discussions.discussionsDetails.getIn(
      [id, 'reinvites', 'email'],
      Map(),
    ),
    userUninvites: state.discussions.discussionsDetails.getIn(
      [id, 'uninvites', 'user'],
      Map(),
    ),
    emailUninvites: state.discussions.discussionsDetails.getIn(
      [id, 'uninvites', 'email'],
      Map(),
    ),
    kicks: state.discussions.discussionsDetails.getIn([id, 'kicks'], Map()),
  };
};
export const mapDispatchToProps = (dispatch, props) => {
  const id = props.discussion.id;
  return {
    openInvitations: () =>
      dispatch({ type: types.SHOW, payload: { id, view: 'invitations' } }),
    reinvite: invitation => () =>
      dispatch({ type: types.REINVITE, payload: { id, invitation } }),
    uninvite: invitation => () =>
      dispatch({ type: types.UNINVITE, payload: { id, invitation } }),
    uninviteCancel: invitation => () =>
      dispatch({ type: types.UNINVITE_CANCEL, payload: { id, invitation } }),
    uninviteConfirm: invitation => () =>
      dispatch({ type: types.UNINVITE_CONFIRM, payload: { id, invitation } }),
    kick: participant => () =>
      dispatch({ type: types.KICK, payload: { id, participant } }),
    kickCancel: participant => () =>
      dispatch({ type: types.KICK_CANCEL, payload: { id, participant } }),
    kickConfirm: participant => () =>
      dispatch({ type: types.KICK_CONFIRM, payload: { id, participant } }),
  };
};

export const ParticipantsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParticipantsList);
