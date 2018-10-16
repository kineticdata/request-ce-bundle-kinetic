import React from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { List, Map } from 'immutable';
import { PeopleSelect } from './PeopleSelect';
import { connect } from 'react-redux';

export const InvitationFormComponent = props =>
  props.render({
    formElement: (
      <form className="invitation-form" onSubmit={props.handleSubmit}>
        <div className="form-group required">
          <label>Invitees</label>
          <PeopleSelect
            id="invitees"
            onChange={props.handleChange}
            value={props.values.get('invitees')}
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
        <div className="form-group">
          <label htmlFor="message">Message for Invitees</label>
          <textarea
            name="message"
            id="message"
            onChange={props.handleChange}
            value={props.values.get('message')}
          />
        </div>
      </form>
    ),
    buttonProps: {
      onClick: props.handleSubmit,
      disabled:
        props.saving ||
        (props.required && props.values.get('invitees').length === 0),
    },
  });

const mapStateToProps = state => ({ profile: state.app.profile });

const mapProps = props => ({
  associatedUsers: props.discussions
    ? props.discussion.participants
        .concat(
          props.discussion.invitations.filter(invitation => invitation.user),
        )
        .map(involvement => involvement.user.username)
    : List([props.profile.username]),
  associatedEmails: props.discussions
    ? props.discussion.invitations
        .filter(invitation => invitation.email)
        .map(invitation => invitation.email)
    : List(),
});

const handleChange = props => event => {
  const field = event.target.id;
  const value = event.target.value;
  props.setValues(values => values.set(field, value));
};

const handleSubmit = props => event => {
  event.preventDefault();
  props.setSaving(true);
  if (typeof props.onSubmit === 'function') {
    props.onSubmit(props.values.toJS(), () => props.setSaving(false));
  }
};

const disabledFn = props => option => {
  if (option.user) {
    return (
      props.associatedUsers.contains(option.user.username) && 'Already involved'
    );
  } else if (option.customOption) {
    return props.associatedEmails.contains(option.label) && 'Already invited';
  }
  return false;
};

export const InvitationForm = compose(
  connect(mapStateToProps),
  withProps(mapProps),
  withState('saving', 'setSaving', false),
  withState('values', 'setValues', Map({ invitees: [], message: '' })),
  withHandlers({ handleChange, handleSubmit, disabledFn }),
)(InvitationFormComponent);
