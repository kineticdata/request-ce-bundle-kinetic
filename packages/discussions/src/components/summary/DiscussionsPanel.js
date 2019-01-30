import React, { Fragment, Component } from 'react';
import { set, setIn } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { DiscussionsList } from './DiscussionsList';
import { Discussion } from '../Discussion';
import { actions as discussionsActions } from '../../redux/modules/discussions';

export const getDisplayClasses = props =>
  props.isModal === true
    ? 'page-panel--discussions d-flex d-md-none d-lg-none d-xl-none'
    : 'page-panel page-panel--two-fifths page-panel--scrollable page-panel--discussions d-none d-md-flex';

export class DiscussionsPanelComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialLoad: true,
      currentDiscussion: null,
      creationForm: null,
    };
  }

  handleInitialLoad = discussions => {
    if (this.state.initialLoad) {
      // If there is only 1 and the user is already a participant, auto-subscribe.
      if (discussions && discussions.size === 1) {
        const initialDiscussion = discussions.first();
        const participating = initialDiscussion.participants.find(
          p => p.user.username === this.props.me.username,
        );

        if (participating) {
          this.setState({
            currentDiscussion: initialDiscussion,
            initialLoad: false,
          });
        } else {
          this.setState({ initialLoad: false });
        }
      }
    }
  };

  handleDiscussionClear = () => this.setState({ currentDiscussion: null });
  handleDiscussionClick = discussion => _e =>
    this.setState({ currentDiscussion: discussion });

  handleToggleCreationForm = () => {
    this.setState(state => ({
      creationForm: state.creationForm
        ? null
        : {
            values: this.props.creationFields,
            errors: {},
            submitting: false,
          },
    }));
  };

  handleCreationFormFieldChange = event => {
    const name = event.target.name;
    const type = typeof this.state.creationForm.values[name];
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    this.setState(state => ({
      creationForm: setIn(state.creationForm, ['values', name], value),
    }));
  };

  handleCreationFormSubmit = event => {
    event.preventDefault();
    const errors = {};
    if (!this.state.creationForm.values.title) {
      errors.title = 'A discussion title is required';
    }
    this.setState(state => ({
      creationForm: set(state.creationForm, 'errors', errors),
    }));
    if (Object.keys(errors).length === 0) {
      this.setState(state => ({
        creationForm: set(state.creationForm, 'submitting', true),
      }));
      this.props.createDiscussion({
        ...this.state.creationForm.values,
        relatedItem: {
          type: this.props.itemType,
          key: this.props.itemKey,
        },
        onSuccess: (discussion, _relatedItem) => {
          typeof this.props.onCreated === 'function' &&
            this.props.onCreated(discussion, this.state.creationForm.values);
          this.setState({ currentDiscussion: discussion, creationForm: null });
        },
      });
    }
  };

  render() {
    const { CreationForm } = this.props;
    return (
      <Fragment>
        {this.state.currentDiscussion ? (
          <div
            className={getDisplayClasses(this.props)}
            style={{ flexGrow: '1' }}
          >
            <button
              onClick={this.handleDiscussionClear}
              className="btn btn-link btn-back"
            >
              <span className="icon">
                <span className="fa fa-fw fa-chevron-left" />
              </span>
              Back to Discussions
            </button>
            <Discussion id={this.state.currentDiscussion.id} />
          </div>
        ) : (
          <div
            className={`page-panel--discussions-recent ${getDisplayClasses(
              this.props,
            )}`}
            style={{ margin: this.props.isModal === true ? '1em' : undefined }}
          >
            <DiscussionsList
              itemType={this.props.itemType}
              itemKey={this.props.itemKey}
              onLoad={this.handleInitialLoad}
              handleCreateDiscussion={this.handleToggleCreationForm}
              handleDiscussionClick={this.handleDiscussionClick}
              me={this.props.me}
            />
          </div>
        )}
        {this.state.creationForm && (
          <Modal isOpen toggle={this.handleToggleCreationForm}>
            <ModalHeader>
              <button
                className="btn btn-link"
                onClick={this.handleToggleCreationForm}
              >
                Cancel
              </button>
              <span>Create Discussion</span>
            </ModalHeader>
            <ModalBody>
              <form
                className="modal-form"
                onSubmit={this.handleCreationFormSubmit}
              >
                <CreationForm
                  onSubmit={this.handleCreationFormSubmit}
                  onChange={this.handleCreationFormFieldChange}
                  values={this.state.creationForm.values}
                  errors={this.state.creationForm.errors}
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <button
                className="btn btn-primary"
                disabled={this.state.creationForm.submitting}
                onClick={this.handleCreationFormSubmit}
              >
                Create
              </button>
            </ModalFooter>
          </Modal>
        )}
      </Fragment>
    );
  }
}

const mapDispatchToProps = {
  createDiscussion: discussionsActions.createDiscussion,
};
export const DiscussionsPanel = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
)(DiscussionsPanelComponent);
