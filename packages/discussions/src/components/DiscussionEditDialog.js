import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ModalBody, ModalFooter } from 'reactstrap';
import { DiscussionForm } from '@kineticdata/react';
import { PeopleSelect } from './PeopleSelect';
import { types } from '../redux/modules/discussionsDetails';

export const DiscussionEditDialogComponent = props => (
  <DiscussionForm
    discussion={props.discussion}
    onSubmit={props.handleSubmit}
    renderOwningUsersInput={props => <PeopleSelect {...props} users />}
    renderOwningTeamsInput={props => <PeopleSelect {...props} teams />}
    render={({ formElement, dirty, invalid, submit }) => (
      <Fragment>
        <ModalBody>
          <button
            type="button"
            className="btn btn-link back"
            onClick={props.goBack}
          >
            <i className="fa fa-fw fa-chevron-left" /> Back
          </button>
          <div className="modal-form">
            {props.errorMessage && (
              <p className="text-danger">{props.errorMessage}</p>
            )}
            {formElement}
          </div>
        </ModalBody>
        <ModalFooter>
          {props.errorMessage && !props.saving && !dirty ? (
            <button className="btn btn-danger" type="submit" disabled>
              <i className="fa fa-fw fa-exclamation-circle" />
              &nbsp;Failed
            </button>
          ) : (
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!dirty || invalid || props.saving}
              onClick={submit}
            >
              Save&nbsp;
              {props.saving && <i className="fa fa-fw fa-spin fa-spinner" />}
            </button>
          )}
        </ModalFooter>
      </Fragment>
    )}
  />
);

export const mapStateToProps = (state, props) => {
  const id = props.discussion.id;
  return {
    saving: state.discussions.discussionsDetails.getIn([id, 'saving']),
    errorMessage: state.discussions.discussionsDetails.getIn([
      id,
      'errorMessage',
    ]),
  };
};

export const mapDispatchToProps = (dispatch, props) => {
  const id = props.discussion.id;
  return {
    goBack: () => dispatch({ type: types.SHOW, payload: { id, view: 'root' } }),
    handleSubmit: discussion =>
      dispatch({ type: types.SAVE, payload: { id, discussion } }),
  };
};

export const DiscussionEditDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DiscussionEditDialogComponent);
