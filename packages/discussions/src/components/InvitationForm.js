import React from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { PeopleSelect } from './PeopleSelect';

export const InvitationFormComponent = props =>
  props.render({
    formElement: (
      <form className="invitation-form" onSubmit={props.handleSubmit}>
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
    ),
    buttonProps: {
      onClick: props.handleSubmit,
      disabled: !props.dirty || props.saving,
    },
  });

const mapProps = props => ({
  associatedUsers: props.discussion.participants
    .concat(props.discussion.invitations.filter(invitation => invitation.user))
    .map(involvement => involvement.user.username),
  associatedEmails: props.discussion.invitations
    .filter(invitation => invitation.email)
    .map(invitation => invitation.email),
});

const handleChange = props => event => {
  props.setDirty(true);
  props.setValue(event.target.value);
};

const handleSubmit = props => event => {
  event.preventDefault();
  props.setSaving(true);
  if (typeof props.onSubmit === 'function') {
    props.onSubmit(props.value, () => props.setSaving(false));
  }
};

const disabledFn = props => option => {
  return false;
  if (option.user) {
    return (
      props.associatedUsers.contains(option.user.username) && 'Already involved'
    );
  } else if (option.customOption) {
    return props.associatedEmails.contains(option.label) && 'Already invited';
  }
};

export const InvitationForm = compose(
  withProps(mapProps),
  withState('dirty', 'setDirty', false),
  withState('saving', 'setSaving', false),
  withState('value', 'setValue', []),
  withHandlers({ handleChange, handleSubmit, disabledFn }),
)(InvitationFormComponent);
