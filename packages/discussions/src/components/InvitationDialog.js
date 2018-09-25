import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, lifecycle } from 'recompose';
import { PeopleSelect } from './PeopleSelect';
import { actions } from '../redux/modules/invitationForm';

export const InvitationDialog = props => (
  <div className="discussion-dialog modal-form invitation-dialog">
    <form className="invitation-form" onSubmit={props.send}>
      {props.error && <p className="alert alert-danger">{props.error}</p>}
      <div className="form-group required">
        <PeopleSelect
          onChange={props.handleChange}
          value={props.value}
          users
          teams
          emails
          placeholder="Search Users…"
          disabledFn={props.disabledFn}
        />
        <p className="form-text text-muted">
          Enter a valid email address to invite a new user
        </p>
      </div>
    </form>
  </div>
);

export const mapStateToProps = (state, props) => ({
  associatedUsers: props.discussion.participants
    .concat(props.discussion.invitations.filter(invitation => invitation.user))
    .map(involvement => involvement.user.username),
  associatedEmails: props.discussion.invitations
    .filter(invitation => invitation.email)
    .map(invitation => invitation.email),
  error: state.discussions.invitationForm.error,
  value: state.discussions.invitationForm.value,
});
export const mapDispatchToProps = {
  clear: actions.clear,
  setValue: actions.setValue,
};

export const InvitationDialogContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleChange: props => event => {
      props.setValue(event.target.value);
    },
    disabledFn: props => option => {
      if (option.user) {
        return (
          props.associatedUsers.contains(option.user.username) &&
          'Already involved'
        );
      } else if (option.customOption) {
        return (
          props.associatedEmails.contains(option.label) && 'Already invited'
        );
      }
      return false;
    },
  }),
  lifecycle({
    componentWillUnmount() {
      this.props.clear();
    },
  }),
)(InvitationDialog);
