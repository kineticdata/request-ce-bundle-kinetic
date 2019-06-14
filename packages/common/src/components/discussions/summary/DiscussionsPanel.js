import React, { Fragment, Component } from 'react';
import { set, setIn } from 'immutable';
import { connect } from '../../../redux/store';
import { compose } from 'recompose';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { DiscussionsList } from './DiscussionsList';
import { Discussion } from '../Discussion';
import { actions as discussionsActions } from '../../../redux/modules/discussions';
import { actions as panelActions } from '../../../redux/modules/discussionsPanel';

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

  handleDiscussionClear = () => {
    this.setState({ currentDiscussion: null });
    this.props.fetchRelatedDiscussionsRequest({
      type: this.props.itemType,
      key: this.props.itemKey,
    });
  };
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

  componentDidMount() {
    this.props.fetchRelatedDiscussionsRequest({
      type: this.props.itemType,
      key: this.props.itemKey,
      loadCallback: this.handleInitialLoad,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.itemType !== prevProps.itemType ||
      this.props.itemKey !== prevProps.itemKey
    ) {
      this.setState({
        initialLoad: true,
        currentDiscussion: null,
        creationForm: null,
      });
      this.props.fetchRelatedDiscussionsRequest({
        type: this.props.itemType,
        key: this.props.itemKey,
        loadCallback: this.handleInitialLoad,
      });
    }
  }

  render() {
    const { CreationForm } = this.props;
    return (
      <Fragment>
        <div
          className={`page-panel page-panel--discussions ${
            !!this.props.isModal
              ? 'd-md-none'
              : 'page-panel--two-fifths d-none d-md-flex'
          }`}
        >
          {this.state.currentDiscussion ? (
            <Discussion
              id={this.state.currentDiscussion.id}
              me={this.props.me}
              handleBackClick={this.handleDiscussionClear}
              renderHeader={({ discussion }) => (
                <span>
                  {discussion
                    ? discussion.title
                    : this.state.currentDiscussion.title}
                </span>
              )}
            />
          ) : (
            <DiscussionsList
              discussions={this.props.discussions}
              handleCreateDiscussionClick={this.handleToggleCreationForm}
              handleDiscussionClick={this.handleDiscussionClick}
              me={this.props.me}
            />
          )}
        </div>
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
  fetchRelatedDiscussionsRequest: panelActions.fetchRelatedDiscussionsRequest,
  createDiscussion: discussionsActions.createDiscussion,
};

const mapStateToProps = state => ({
  discussions: state.discussionsPanel.relatedDiscussions,
});

export const DiscussionsPanel = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DiscussionsPanelComponent);
