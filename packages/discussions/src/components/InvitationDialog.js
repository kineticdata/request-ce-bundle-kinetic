import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { actions } from '../redux/modules/discussions';

export const InvitationDialog = props => (
  <div className="discussion-dialog modal-form invitation-dialog">
    <form className="invitation-form" onSubmit={props.createInvitation}>
      {props.error && <p className="alert alert-danger">{props.error}</p>}
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="invitation-type"
          id="invitation-type-username"
          value="username"
          onChange={props.setType}
          checked={props.type === 'username'}
        />
        <label className="form-check-label" htmlFor="invitation-type-username">
          By Username
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="invitation-type"
          id="invitation-type-email"
          value="email"
          onChange={props.setType}
          checked={props.type === 'email'}
        />
        <label className="form-check-label" htmlFor="invitation-type-email">
          By Email
        </label>
      </div>

      <div className="form-group required">
        <label htmlFor="invitation-value" className="field-label">
          Invitee's {props.type === 'username' ? 'Username' : 'Email'}
        </label>
        <input
          type="text"
          id="invitation-value"
          onChange={props.setValue}
          value={props.value}
        />
      </div>
    </form>
  </div>
);

export const mapStateToProps = state => ({
  type: state.discussions.discussions.invitationFields.get('type'),
  value: state.discussions.discussions.invitationFields.get('value'),
  error: state.discussions.discussions.invitationError,
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
    setType: props => event =>
      props.setInvitationField('type', event.target.value),
    setValue: props => event => {
      props.participantsAndInvites.includes(event.target.value)
        ? props.setInviteExists(true)
        : props.setInviteExists(false);
      props.setInvitationField('value', event.target.value);
    },
  }),
  lifecycle({
    componentWillUnmount() {
      this.props.setInvitationField('type', 'username');
      this.props.setInvitationField('value', '');
    },
  }),
)(InvitationDialog);
