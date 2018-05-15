import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, lifecycle } from 'recompose';
import { actions } from '../redux/modules/discussions';

export const InvitationDialog = props => (
  <div className="discussion-dialog modal-form invitation-dialog">
    <form className="invitation-form" onSubmit={props.createInvitation}>
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
      <p className="help-block">Sent to email to new participant</p>
      <label htmlFor="invitation-note" className="field-label">
        Add a note
      </label>
      <textarea
        placeholder="Notes for participant"
        id="invitation-note"
        onChange={props.setNotes}
        value={props.notes}
      />
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
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    setEmail: props => event =>
      props.setInvitationField('email', event.target.value),
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
