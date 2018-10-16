import React, { Fragment } from 'react';
import { compose, withHandlers } from 'recompose';
import { ModalBody, ModalFooter } from 'reactstrap';
import { toastActions } from 'common';
import { connect } from 'react-redux';
import { actions } from '../redux/modules/discussions';
import { sendInvites } from '../discussion_api';
import { InvitationForm } from './InvitationForm';

export const InvitationDialogComponent = props => (
  <InvitationForm
    discussion={props.discussion}
    required
    onSubmit={props.handleSubmit}
    render={({ formElement, buttonProps }) => (
      <Fragment>
        <ModalBody>
          <div className="discussion-dialog modal-form invitation-dialog">
            {formElement}
          </div>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary" {...buttonProps}>
            Send Invite
          </button>
        </ModalFooter>
      </Fragment>
    )}
  />
);

const mapStateToProps = state => ({
  token: state.discussions.socket.token,
});

const mapDispatchToProps = {
  closeModal: actions.closeModal,
  addError: toastActions.addError,
  addSuccess: toastActions.addSuccess,
};

export const InvitationDialog = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleSubmit: props => async (values, completeSubmit) => {
      const responses = await sendInvites(
        props.token,
        props.discussion,
        values,
      );
      if (responses.filter(response => response.error).length > 0) {
        props.addError('There was an error inviting users and/or teams');
        completeSubmit();
      } else {
        props.addSuccess('Successfully sent invitations');
        props.closeModal('invitation');
      }
    },
  }),
)(InvitationDialogComponent);
