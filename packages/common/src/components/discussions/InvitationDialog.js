import React, { Fragment } from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { InvitationForm } from '@kineticdata/react';
import { PeopleSelect } from './PeopleSelect';
import { types } from '../../redux/modules/discussionsDetails';

export const InvitationDialogComponent = props => (
  <InvitationForm
    discussion={props.discussion}
    profile={props.profile}
    required
    onSubmit={props.invite}
    renderInviteesInput={props => (
      <PeopleSelect {...props} users teams emails placeholder="Search Users…" />
    )}
    render={({ formElement, submit, invalid }) => (
      <Fragment>
        <ModalBody>
          <button
            type="button"
            className="btn btn-link back"
            onClick={props.goBack}
          >
            <i className="fa fa-fw fa-chevron-left" /> Back
          </button>
          <div className="discussion-dialog modal-form invitation-dialog">
            {props.error && (
              <div className="text-danger">
                <h6>Failed to invite the following</h6>
                <ul>{props.error.map(e => <li key={e}>{e}</li>)}</ul>
              </div>
            )}
            {formElement}
          </div>
        </ModalBody>
        <ModalFooter>
          {props.error ? (
            <button type="button" className="btn btn-danger" disabled>
              <i className="fa fa-fw fa-exclamation-circle" />
              Error
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              disabled={props.sending || invalid}
              onClick={submit}
            >
              Send
              {props.sending && <i className="fa fa-fw fa-spin fa-spinner" />}
            </button>
          )}
        </ModalFooter>
      </Fragment>
    )}
  />
);

const mapStateToProps = (state, props) => {
  const id = props.discussion.id;
  return {
    profile: state.app.profile,
    sending: state.common.discussionsDetails.getIn([id, 'sending']),
    error: state.common.discussionsDetails.getIn([id, 'errorMessage']),
  };
};

export const mapDispatchToProps = (dispatch, props) => {
  const discussion = props.discussion;
  const id = discussion.id;
  return {
    goBack: () => dispatch({ type: types.SHOW, payload: { id, view: 'root' } }),
    invite: values =>
      dispatch({ type: types.INVITE, payload: { id, discussion, values } }),
  };
};

export const InvitationDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InvitationDialogComponent);
