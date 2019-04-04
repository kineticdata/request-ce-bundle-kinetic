import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalFooter } from 'reactstrap';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { push } from 'connected-react-router';
import { actions } from '../../redux/modules/submission';
import { context } from '../../redux/store';

const SendMessageModalComponent = props => {
  const title =
    props.actionType === 'comment' ? 'Start Discussion' : 'Request to Cancel';

  const placeholder =
    props.actionType === 'comment'
      ? 'Add a message for the fulfillment team'
      : "Let the fulfillment team know why you'd like to cancel";
  return (
    <Modal size="lg" isOpen toggle={props.close}>
      <div className="modal-header">
        <h4 className="modal-title">
          <button onClick={props.close} type="button" className="btn btn-link">
            Cancel
          </button>
          <span>{title}</span>
        </h4>
      </div>
      <div className="modal-body">
        <div className="modal-form">
          <textarea
            className="form-control"
            type="textarea"
            placeholder={placeholder}
            value={props.comment}
            onChange={e => props.setComment(e.target.value)}
          />
          <br />
          <p className="text-center">
            Once submitted, the fulfillment team will be in touch shortly!
          </p>
        </div>
      </div>
      <ModalFooter>
        <button
          type="button"
          className="btn btn-primary"
          onClick={props.submit}
        >
          Continue
        </button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = state => ({
  profile: state.app.profile,
  actionType: state.submission.sendMessageType,
  discussions: state.submission.discussions,
});

export const mapDispatchToProps = {
  setModalOpen: actions.setSendMessageModalOpen,
  sendMessage: actions.sendMessage,
  push,
};

const close = props => () => props.setModalOpen(false);

const submit = props => () => {
  props.sendMessage(props.comment);
};

export const SendMessageModal = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('comment', 'setComment', ''),
  withHandlers({ close, submit }),
  lifecycle({
    componentWillUnmount() {
      this.props.close();
    },
  }),
)(SendMessageModalComponent);
