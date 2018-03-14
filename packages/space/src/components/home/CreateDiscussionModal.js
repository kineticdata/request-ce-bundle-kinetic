import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalFooter } from 'reactstrap';
import { compose, lifecycle, withHandlers, withState } from 'recompose';

import { actions } from '../../redux/modules/app';

const CreateDiscussionModalComponent = ({
  fieldValues,
  isOpen,
  handleFieldChange,
  handleSubmit,
  handleToggle,
}) => (
  <Modal size="lg" isOpen={isOpen} toggle={handleToggle}>
    <div className="modal-header">
      <h4 className="modal-title">
        <button onClick={handleToggle} type="button" className="btn btn-link">
          Close
        </button>
        <span>Create Discussion</span>
      </h4>
    </div>
    <div className="modal-body">
      <div className="modal-form">
        <form>
          <div className="discussions-input-container">
            <div className="form-group required">
              <label>Name</label>
              <input
                name="title"
                type="text"
                onChange={handleFieldChange}
                value={fieldValues.title}
                placeholder="Short simple name"
              />
            </div>
          </div>
          <div className="form-group required">
            <label>Description</label>
            <textarea
              name="description"
              value={fieldValues.description}
              placeholder="Long description for easier searching"
            />
          </div>
          <h1 className="section-title">Invite Members</h1>
          <div className="form-group required">
            <label>Invite member(s) </label>
            <textarea
              name="invite-members"
              value={fieldValues.members}
              placeholder="Search for a user to add by Name, Username, or Email"
            />
          </div>
        </form>
      </div>
    </div>
    <ModalFooter>
      <button
        type="button"
        className="btn btn-primary"
        disabled={fieldValues.title === ''}
        onClick={handleSubmit}
      >
        Create Discussion
      </button>
    </ModalFooter>
  </Modal>
);

export const mapStateToProps = state => ({
  fieldValues: {},
  isOpen: state.app.isCreateDiscussionModalOpen,
});

export const mapDispatchToProps = {
  createDiscussion: actions.createDiscussion,
  setModalOpen: actions.setCreateDiscussionModalOpen,
};

export const CreateDiscussionModal = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    /*
     * Do this so that navigating away from the parent page (causing an unmount)
     * resets the is modal open value.  This ensures that the modal is not open
     * after navigating away and then hitting the 'back' button.
     */
    componentWillUnmount() {
      this.props.setModalOpen(false);
    },
  }),
  withState('fieldValues', 'setFieldValues', { title: '' }),
  withHandlers({
    handleFieldChange: props => ({ target: { name, value } }) => {
      props.setFieldValues({ ...props.fieldValues, [name]: value });
    },
    handleSubmit: props => event => {
      props.createDiscussion(props.fieldValues.title);
    },
    handleToggle: props => event => {
      props.setModalOpen(!props.isOpen);
    },
  }),
)(CreateDiscussionModalComponent);
