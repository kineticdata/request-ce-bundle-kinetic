import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader } from 'reactstrap';
import { types } from '../../redux/modules/discussionsDetails';
import { DiscussionDetailsRoot } from './DiscussionDetailsRoot';
import { InvitationDialog } from './InvitationDialog';
import { DiscussionEditDialog } from './DiscussionEditDialog';

export const DiscussionDetailsComponent = props => (
  <Modal
    isOpen={!!props.view}
    toggle={props.close}
    className="discussion-details-modal"
  >
    <ModalHeader>
      <button type="button" className="btn btn-link" onClick={props.close}>
        Close
      </button>
      <span>{props.discussion.title}</span>
    </ModalHeader>
    {props.view === 'root' ? (
      <DiscussionDetailsRoot
        canManage={props.canManage}
        discussion={props.discussion}
        profile={props.profile}
        onLeave={props.onLeave}
      />
    ) : props.view === 'invitations' ? (
      <InvitationDialog discussion={props.discussion} />
    ) : props.view === 'edit' ? (
      <DiscussionEditDialog discussion={props.discussion} />
    ) : null}
  </Modal>
);

export const mapStateToProps = (state, props) => {
  const id = props.discussion.id;
  return {
    view: state.common.discussionsDetails.getIn([id, 'view']),
  };
};

export const mapDispatchToProps = (dispatch, props) => {
  const id = props.discussion.id;
  return {
    close: () => dispatch({ type: types.CLOSE, payload: { id } }),
  };
};

export const DiscussionDetails = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DiscussionDetailsComponent);
