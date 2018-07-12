import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { actions } from '../redux/modules/discussions';

export const InvitationDialog = props => (
  <div className="discussion-dialog modal-form invitation-dialog">
    <form className="invitation-form" onSubmit={props.createInvitation}>
      <div className="form-group required">
        <label htmlFor="invitation-email-address" className="field-label">
          Invitee's Email
        </label>
        <input
          type="text"
          placeholder="Email address"
          id="invitation-email-address"
          onChange={props.setEmail}
          value={props.email}
        />
        <div
          className="invalid-feedback"
          style={{ display: props.inviteExists ? 'block' : 'none' }}
        >
          This email address has already been invited
        </div>
      </div>
      <div className="form-group required">
        <label htmlFor="invitation-note" className="field-label">
          Add a note
        </label>
        <textarea
          className="required"
          placeholder="Notes for participant"
          id="invitation-note"
          onChange={props.setNotes}
          value={props.notes}
        />
        <small>This note will be sent as part of the invitation.</small>
      </div>
    </form>
  </div>
);

export const mapStateToProps = state => ({
  email: state.discussions.discussions.invitationFields.get('email') || '',
  notes: state.discussions.discussions.invitationFields.get('notes') || '',
});
export const mapDispatchToProps = {
  setInvitationField: actions.setInvitationField,
};

export const InvitationDialogContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('inviteExists', 'setInviteExists', false),
  withHandlers({
    setEmail: props => event => {
      props.participantsAndInvites.includes(event.target.value)
        ? props.setInviteExists(true)
        : props.setInviteExists(false);
      props.setInvitationField('email', event.target.value);
    },
    setNotes: props => event =>
      props.setInvitationField('notes', event.target.value),
  }),
  lifecycle({
    componentWillUnmount() {
      this.props.setInvitationField('email', '');
      this.props.setInvitationField('notes', '');
    },
  }),
)(InvitationDialog);
