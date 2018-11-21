import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ModalBody, ModalFooter } from 'reactstrap';
import { toastActions } from 'common';
import { DiscussionForm } from './DiscussionForm';
import { actions } from '../redux/modules/discussions';
import { updateDiscussion } from '../discussionApi';

export class DiscussionEditDialogComponent extends React.Component {
  handleSubmit = (values, completeSubmit) => {
    updateDiscussion(this.props.discussion.id, values, this.props.token).then(
      response => {
        if (response.error) {
          const error = response.error.response.data.message;
          this.props.addError(`Error updating discussion. ${error}`);
          completeSubmit();
        } else {
          this.props.closeModal();
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

const mapStateToProps = state => ({
  token: state.discussions.socket.token,
});

const mapDispatchToProps = {
  closeModal: actions.closeModal,
  addError: toastActions.addError,
  addSuccess: toastActions.addSuccess,
};

export const DiscussionEditDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DiscussionEditDialogComponent);
