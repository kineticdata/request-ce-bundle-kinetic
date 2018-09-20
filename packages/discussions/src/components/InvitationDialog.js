import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import {
  Highlighter,
  Menu,
  MenuItem,
  Token,
  Typeahead,
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import { actions } from '../redux/modules/invitationForm';

const EMAIL_PATTERN = /^.+@.+\..+$/;

const UserMenuItem = props => (
  <MenuItem option={props.option} position={props.position}>
    <Highlighter search={props.text}>{props.option.label}</Highlighter>
    <div>
      <small>{props.option.user.username}</small>
    </div>
  </MenuItem>
);

const TeamMenuItem = props => (
  <MenuItem option={props.option} position={props.position}>
    <Highlighter search={props.text}>{props.option.label}</Highlighter>
    <div>
      <small>Team</small>
    </div>
  </MenuItem>
);

const EmailMenuItem = props => {
  const validEmail = props.text.match(EMAIL_PATTERN);
  return (
    <MenuItem
      option={props.option}
      position={props.position}
      disabled={!validEmail}
    >
      {validEmail ? (
        <Fragment>
          <strong>Add email</strong>: {props.text}
        </Fragment>
      ) : (
        `Invalid email address: ${props.text}`
      )}
    </MenuItem>
  );
};

const renderMenu = (results, props) => (
  <Menu {...props}>
    {results.map((option, i) => {
      const CurrentMenuItem = option.user
        ? UserMenuItem
        : option.team
          ? TeamMenuItem
          : EmailMenuItem;
      return (
        <CurrentMenuItem
          key={i}
          option={option}
          position={i}
          text={props.text}
        />
      );
    })}
  </Menu>
);

const renderToken = (option, props, index) => (
  <Token
    key={index}
    onRemove={props.onRemove}
    className={option.user ? 'user' : option.team ? 'team' : 'new'}
  >
    {option.label}
  </Token>
);

export const InvitationDialog = props => (
  <div className="discussion-dialog modal-form invitation-dialog">
    <form
      className="invitation-form"
      onSubmit={props.send}
      // style={{ minHeight: '350px' }}
    >
      {props.error && <p className="alert alert-danger">{props.error}</p>}
      <div className="form-group required">
        <Typeahead
          labelKey="label"
          allowNew
          multiple
          newSelectionPrefix="Invite new user by email: "
          options={props.list}
          onChange={props.handleChange}
          selected={props.value}
          renderMenu={renderMenu}
          renderToken={renderToken}
          placeholder="Search Users…"
        />
        <p className="form-text text-muted">
          Enter a valid email address to invite a new user
        </p>
      </div>
    </form>
  </div>
);

export const mapStateToProps = state => ({
  error: state.discussions.invitationForm.error,
  list: state.discussions.invitationForm.users
    .map(user => ({ label: user.displayName || user.username, user }))
    .concat(
      state.discussions.invitationForm.teams.map(team => ({
        label: team.name,
        team,
      })),
    )
    .sortBy(item => item.label)
    .toJS(),
  value: state.discussions.invitationForm.value,
});
export const mapDispatchToProps = {
  clear: actions.clear,
  loadUsersTeams: actions.loadUsersTeams,
  setValue: actions.setValue,
};

export const InvitationDialogContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('inviteExists', 'setInviteExists', false),
  withHandlers({
    handleChange: props => props.setValue,
  }),
  lifecycle({
    componentWillMount() {
      this.props.loadUsersTeams();
    },
    componentWillUnmount() {
      this.props.clear();
    },
  }),
)(InvitationDialog);
