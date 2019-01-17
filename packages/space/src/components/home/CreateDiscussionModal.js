import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalFooter } from 'reactstrap';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { actions } from '../../redux/modules/spaceApp';
import { I18n } from '../../../../app/src/I18nProvider';

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
          <I18n>Close</I18n>
        </button>
        <span>
          <I18n>New Discussion</I18n>
        </span>
      </h4>
    </div>
    <div className="modal-body">
      <div className="modal-form">
        <form>
          <div className="discussions-input-container">
            <div className="form-group required">
              <label className="field-label">
                <I18n>Name</I18n>
              </label>
              <I18n
                render={translate => (
                  <input
                    name="title"
                    type="text"
                    onChange={handleFieldChange}
                    value={fieldValues.title}
                    placeholder={translate('Name of the discussion')}
                  />
                )}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="field-label">
              <I18n>Description</I18n>
            </label>
            <I18n
              render={translate => (
                <textarea
                  name="description"
                  value={fieldValues.description}
                  onChange={handleFieldChange}
                  placeholder={translate('Description for easier searching')}
                />
              )}
            />
          </div>
          <h1 className="section__title">
            <I18n>Invite Members</I18n>
          </h1>
          <div className="form-group">
            <label className="field-label">
              <I18n>Invite member(s)</I18n>{' '}
            </label>
            <I18n
              render={translate => (
                <textarea
                  name="members"
                  value={fieldValues.members}
                  onChange={handleFieldChange}
                  placeholder={translate(
                    'Comma separated list of email addresses',
                  )}
                />
              )}
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
        <I18n>Create Discussion</I18n>
      </button>
    </ModalFooter>
  </Modal>
);

export const mapStateToProps = state => ({
  fieldValues: {},
  isOpen: state.space.spaceApp.isCreateDiscussionModalOpen,
});

export const mapDispatchToProps = {
  createDiscussion: actions.createDiscussion,
  setModalOpen: actions.setCreateDiscussionModalOpen,
};

export const CreateDiscussionModal = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
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
      props.createDiscussion({
        title: props.fieldValues.title,
        description: props.fieldValues.description,
        members: props.fieldValues.members,
      });
    },
    handleToggle: props => event => {
      props.setModalOpen(!props.isOpen);
    },
  }),
)(CreateDiscussionModalComponent);
