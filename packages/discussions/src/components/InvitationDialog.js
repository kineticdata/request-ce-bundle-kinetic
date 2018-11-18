import React, { Fragment } from 'react';
import { compose, withHandlers } from 'recompose';
import { ModalBody, ModalFooter } from 'reactstrap';
import { toastActions } from 'common';
import { connect } from 'react-redux';
import { InvitationForm, DiscussionAPI } from 'discussions-lib';
import { PeopleSelect } from './PeopleSelect';

export const InvitationDialogComponent = props => (
  <InvitationForm
    discussion={props.discussion}
    profile={props.profile}
    required
    onSubmit={props.handleSubmit}
    renderInviteesInput={props => (
      <PeopleSelect {...props} users teams emails placeholder="Search Users…" />
    )}
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
  profile: state.app.profile,
});

const mapDispatchToProps = {
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
      const responses = await DiscussionAPI.sendInvites(
        props.discussion,
        values,
      );
      if (responses.filter(response => response.error).length > 0) {
        props.addError('There was an error inviting users and/or teams');
        completeSubmit();
      } else {
        props.addSuccess('Successfully sent invitations');
        props.close();
      }
    },
  }),
)(InvitationDialogComponent);
