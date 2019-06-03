import React, { Fragment } from 'react';
import { Modal, ModalFooter } from 'reactstrap';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import {
  DiscussionForm,
  InvitationForm,
  createDiscussion,
  sendInvites,
} from '@kineticdata/react';
import { addToast, addToastAlert } from 'common';
import { PeopleSelect } from './PeopleSelect';
import { I18n } from '@kineticdata/react';

const CreateDiscussionModalComponent = props => (
  <Modal size="lg" isOpen toggle={props.close}>
    <div className="modal-header">
      <h4 className="modal-title">
        <button
          onClick={props.step === 'discussion' ? props.close : props.back}
          type="button"
          className="btn btn-link"
        >
          {props.step === 'discussion' ? (
            <I18n>Cancel</I18n>
          ) : (
            <I18n>Back</I18n>
          )}
        </button>
        <span>
          <I18n>New Discussion</I18n>
        </span>
      </h4>
    </div>
    {/* We always render the Discussion/Invitation form components and hide/show
        their contents when switching between steps to preserve the state of the
        forms throughout */}
    <DiscussionForm
      onSubmit={props.next}
      defaults={{ owningUsers: [{ username: props.profile.username }] }}
      renderOwningUsersInput={props => <PeopleSelect {...props} users />}
      renderOwningTeamsInput={props => <PeopleSelect {...props} teams />}
      render={({ formElement, buttonProps }) =>
        props.step === 'discussion' && (
          <Fragment>
            <div className="modal-body">
              <div className="modal-form">{formElement}</div>
            </div>
            <ModalFooter>
              <button
                type="button"
                className="btn btn-primary"
                {...buttonProps}
              >
                <I18n>Continue</I18n>
              </button>
            </ModalFooter>
          </Fragment>
        )
      }
    />
    <InvitationForm
      onSubmit={props.submit}
      profile={props.profile}
      renderInviteesInput={props => (
        <I18n
          render={translate => (
            <PeopleSelect
              {...props}
              users
              teams
              emails
              placeholder={translate('Search Users…')}
            />
          )}
        />
      )}
      render={({ formElement, buttonProps }) =>
        props.step === 'invitations' && (
          <Fragment>
            <div className="modal-body">
              <div className="modal-form">{formElement}</div>
            </div>
            <ModalFooter>
              <button
                type="button"
                className="btn btn-primary"
                {...buttonProps}
              >
                <I18n>Submit</I18n>
              </button>
            </ModalFooter>
          </Fragment>
        )
      }
    />
  </Modal>
);

const back = props => () => props.setStep('discussion');
const next = props => (values, completeSubmit) => {
  props.setDiscussion(values);
  props.setStep('invitations');
  completeSubmit();
};
const submit = props => async (values, completeSubmit) => {
  const { discussion, error } = await createDiscussion({
    ...props.discussion,
  });
  if (discussion) {
    const responses = await sendInvites(discussion, values);
    if (!responses.some(response => response.error)) {
      addToast('Successfully created discussion and sent invitations.');
    } else {
      addToast('Successfully created discussion.');
      addToastAlert('There was an error inviting users and/or teams.');
    }
    if (typeof props.onSuccess === 'function') {
      props.onSuccess(discussion);
    }
    props.close();
  } else {
    addToastAlert(error.message);
    completeSubmit();
  }
};

export const CreateDiscussionModal = compose(
  withState('step', 'setStep', 'discussion'),
  withState('discussion', 'setDiscussion', null),
  withHandlers({ back, next }),
  withHandlers({ submit }),
  lifecycle({
    componentWillUnmount() {
      this.props.close();
    },
  }),
)(CreateDiscussionModalComponent);
