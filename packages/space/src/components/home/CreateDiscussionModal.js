import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalFooter } from 'reactstrap';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { push } from 'connected-react-router';
import {
  DiscussionForm,
  InvitationForm,
  createDiscussion,
  sendInvites,
} from '@kineticdata/react';
import { toastActions } from 'common';
import { actions } from '../../redux/modules/spaceApp';
import { PeopleSelect } from 'discussions/src/components/PeopleSelect';
import { I18n } from '../../../../app/src/I18nProvider';

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

const mapStateToProps = state => ({
  profile: state.app.profile,
});

export const mapDispatchToProps = {
  setModalOpen: actions.setCreateDiscussionModalOpen,
  addError: toastActions.addError,
  addSuccess: toastActions.addSuccess,
  push,
};

const close = props => () => props.setModalOpen(false);
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
      props.addSuccess('Successfully created discussion and sent invitations.');
    } else {
      props.addSuccess('Successfully created discussion.');
      props.addError('There was an error inviting users and/or teams.');
    }
    props.push(`/discussions/${discussion.id}`);
    props.close();
  } else {
    props.addError(error.response.data.message);
    completeSubmit();
  }
};

export const CreateDiscussionModal = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('step', 'setStep', 'discussion'),
  withState('discussion', 'setDiscussion', null),
  withHandlers({ close, back, next }),
  withHandlers({ submit }),
  lifecycle({
    componentWillUnmount() {
      this.props.close();
    },
  }),
)(CreateDiscussionModalComponent);
