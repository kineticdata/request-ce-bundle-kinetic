import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { Popover, PopoverBody, ModalBody, ModalFooter } from 'reactstrap';
import { types } from '../../redux/modules/discussionsDetails';
import { ParticipantsListContainer } from './ParticipantsList';
import { RelatedItemsList } from './RelatedItemsList';
import { LocalToast, LocalToastsContainer } from 'common';

export const DiscussionDetailsRootComponent = props => (
  <Fragment>
    <ModalBody>
      {props.canManage && (
        <button type="button" className="btn btn-link" onClick={props.openEdit}>
          Edit Discussion
          <i className="fa fa-fw fa-angle-right" />
        </button>
      )}
      {props.muteError ? (
        <label className="btn btn-link text-danger has-error" disabled>
          <div>Mute email updates</div>
          <div>
            <i className="fa fa-fw fa-exclamation-circle" />
            Error saving
          </div>
        </label>
      ) : (
        <label className="btn btn-link" disabled={props.muting}>
          Mute email updates
          {props.muting ? (
            <i className="fa fa-fw fa-spinner fa-spin" />
          ) : (
            <input
              type="checkbox"
              onChange={props.mute}
              checked={props.muted}
            />
          )}
        </label>
      )}
      <ParticipantsListContainer
        canManage={props.canManage}
        discussion={props.discussion}
      />
      <RelatedItemsList discussion={props.discussion} close={props.close} />
      <LocalToastsContainer>
        {props.successMessage && (
          <LocalToast
            toast={{ severity: 'success', message: props.successMessage }}
          />
        )}
      </LocalToastsContainer>
    </ModalBody>
    <ModalFooter>
      {props.leaveError ? (
        <button className="btn btn-link text-danger" disabled>
          <i className="fa fa-fw fa-exclamation-circle left" />
          Failed to leave discussion
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-link text-danger"
          onClick={props.leave}
          disabled={props.leaving || props.leaveConfirmation}
        >
          <span id="leave-discussion">
            Leave Discussion
            {props.leaving && (
              <i className="fa fa-fw fa-spin fa-spinner right" />
            )}
          </span>
        </button>
      )}
      <Popover
        target="leave-discussion"
        isOpen={props.leaveConfirmation}
        toggle={props.leaveCancel}
        placement="top"
      >
        <PopoverBody>
          <div>Are you sure?</div>
          <button className="btn btn-link" onClick={props.leaveCancel}>
            No, Stay
          </button>
          <button className="btn btn-danger" onClick={props.leaveConfirm}>
            Yes, Leave
          </button>
        </PopoverBody>
      </Popover>
    </ModalFooter>
  </Fragment>
);

export const mapStateToProps = (state, props) => {
  const id = props.discussion.id;
  return {
    successMessage: state.discussionsDetails.getIn([id, 'successMessage']),
    leaveConfirmation: state.discussionsDetails.getIn([
      id,
      'leaveConfirmation',
    ]),
    leaving: state.discussionsDetails.getIn([id, 'leaving']),
    leaveError: state.discussionsDetails.getIn([id, 'leaveError']),
    muted:
      state.discussionsDetails.getIn([id, 'muted']) ||
      props.discussion.participants
        .filter(p => p.user.username === props.profile.username)
        .map(p => p.isMuted)
        .first(),
    muting: state.discussionsDetails.getIn([id, 'muting']),
    muteError: state.discussionsDetails.getIn([id, 'muteError']),
  };
};
export const mapDispatchToProps = (dispatch, props) => {
  const id = props.discussion.id;
  const username = props.profile.username;
  const onLeave = props.onLeave;
  return {
    openEdit: () =>
      dispatch({ type: types.SHOW, payload: { id, view: 'edit' } }),
    mute: event =>
      dispatch({
        type: types.MUTE,
        payload: { id, username, isMuted: event.target.checked },
      }),
    leave: () => dispatch({ type: types.LEAVE, payload: { id } }),
    leaveConfirm: () =>
      dispatch({
        type: types.LEAVE_CONFIRM,
        payload: { id, username, onLeave },
      }),
    leaveCancel: () => dispatch({ type: types.LEAVE_CANCEL, payload: { id } }),
  };
};

export const DiscussionDetailsRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DiscussionDetailsRootComponent);
