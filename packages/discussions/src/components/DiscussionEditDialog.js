import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ModalBody, ModalFooter } from 'reactstrap';
import { toastActions } from 'common';
import { DiscussionForm, DiscussionAPI } from 'discussions-lib';
import { PeopleSelect } from './PeopleSelect';

export class DiscussionEditDialogComponent extends React.Component {
  handleSubmit = (values, completeSubmit) => {
    DiscussionAPI.updateDiscussion(this.props.discussion.id, values).then(
      response => {
        if (response.error) {
          const error = response.error.response.data.message;
          this.props.addError(`Error updating discussion. ${error}`);
          completeSubmit();
        } else {
          this.props.close();
          this.props.addSuccess('Discussion was updated.');
        }
      },
    );
  };

  render() {
    return (
      <DiscussionForm
        discussion={this.props.discussion}
        onSubmit={this.handleSubmit}
        renderOwningUsersInput={props => <PeopleSelect {...props} users />}
        renderOwningTeamsInput={props => <PeopleSelect {...props} teams />}
        render={({ formElement, buttonProps }) => (
          <Fragment>
            <ModalBody>
              <div className="modal-form">{formElement}</div>
            </ModalBody>
            <ModalFooter>
              <button
                className="btn btn-primary"
                type="button"
                {...buttonProps}
              >
                Save
              </button>
            </ModalFooter>
          </Fragment>
        )}
      />
    );
  }
}

const mapDispatchToProps = {
  addError: toastActions.addError,
  addSuccess: toastActions.addSuccess,
};

export const DiscussionEditDialog = connect(
  null,
  mapDispatchToProps,
)(DiscussionEditDialogComponent);
