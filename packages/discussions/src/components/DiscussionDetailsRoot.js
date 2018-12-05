import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Popover, PopoverBody, ModalBody, ModalFooter } from 'reactstrap';
import { types } from '../redux/modules/discussionsDetails';
import { ParticipantsListContainer } from './ParticipantsList';
import { SectionToast } from 'common/src/components/SectionToast';

export const DiscussionDetailsRootComponent = props => (
  <Fragment>
    <ModalBody>
      <button type="button" className="btn btn-link" onClick={props.openEdit}>
        Edit Discussion
        <i className="fa fa-fw fa-angle-right" />
      </button>
      <label className="btn btn-link">
        Mute email updates
        <input type="checkbox" onChange={props.mute} />
      </label>
      {false && (
        <label className="btn btn-link" disabled>
          Mute email updates
          <i className="fa fa-fw fa-spinner fa-spin" />
        </label>
      )}
      {false && (
        <label className="btn btn-link text-danger has-error" disabled>
          <div>Mute email updates</div>
          <div>
            <i className="fa fa-fw fa-exclamation-circle" />
            Error saving
          </div>
        </label>
      )}
      <ParticipantsListContainer discussion={props.discussion} />
      {props.successMessage && (
        <SectionToast>{props.successMessage}</SectionToast>
      )}
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
    successMessage: state.discussions.discussionsDetails.getIn([
      id,
      'successMessage',
    ]),
    leaveConfirmation: state.discussions.discussionsDetails.getIn([
      id,
      'leaveConfirmation',
    ]),
    leaving: state.discussions.discussionsDetails.getIn([id, 'leaving']),
    leaveError: state.discussions.discussionsDetails.getIn([id, 'leaveError']),
  };
};
export const mapDispatchToProps = (dispatch, props) => {
  const id = props.discussion.id;
  const username = props.profile.username;
  const onLeave = props.onLeave;
  return {
    openEdit: () =>
      dispatch({ type: types.SHOW, payload: { id, view: 'edit' } }),
    mute: () => console.log('muting not supported yet...'),
    clearSuccessMessage: () =>
      dispatch({ type: types.CLEAR_SUCCESS, payload: { id } }),
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
