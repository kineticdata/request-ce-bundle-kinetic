import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Avatar } from 'common';
import { isPresent } from '../helpers';
import { types } from '../redux/modules/discussionsDetails';

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
          </li>
        ))}
      {props.discussion.invitations.map(i => {
        const username = i.user ? i.user.username : i.email;
        const displayName = i.user ? i.user.username : i.email;
        const status = i.user
          ? props.userReinvites.get(i.user.username)
          : props.emailReinvites.get(i.email);
        return (
          <li key={username}>
            <Avatar size={26} username={username} />
            {displayName}
            {status === 'error' ? (
              <span className="subtext text-danger">
                <i className="fa fa-fw fa-exclamation-circle" />
                invitation failed
              </span>
            ) : status === 'success' ? (
              <span className="subtext text-success">
                <i className="fa fa-fw fa-check-circle" />
                invitation sent
              </span>
            ) : status === 'sending' ? (
              <Fragment>
                <span className="subtext">inviting</span>
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
  };
};
export const mapDispatchToProps = (dispatch, props) => {
  const id = props.discussion.id;
  return {
    openInvitations: () =>
      dispatch({ type: types.SHOW, payload: { id, view: 'invitations' } }),
    reinvite: invitation => () =>
      dispatch({ type: types.REINVITE, payload: { id, invitation } }),
  };
};

export const ParticipantsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParticipantsList);
