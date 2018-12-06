import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { DiscussionsList } from './DiscussionsList';
import { Discussion } from '../Discussion';
import { actions as discussionsActions } from '../../redux/modules/discussions';

export const getDisplayClasses = props =>
  props.isModal === true
    ? 'kinops-discussions d-flex d-md-none d-lg-none d-xl-none'
    : 'kinops-discussions d-none d-md-flex';

export class DiscussionsPanelComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialLoad: true,
      currentDiscussion: null,
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
  handleDiscussionCreate = () => {
    const additionalParams =
      typeof this.props.creationParams === 'function'
        ? this.props.creationParams()
        : {};
    const params = {
      ...additionalParams,
      relatedItem: {
        type: this.props.itemType,
        key: this.props.itemKey,
      },
      onSuccess: (discussion, _relatedItem) => {
        this.setState({ currentDiscussion: discussion });
      },
    };
    this.props.createDiscussion(params);
  };

  render() {
    return this.state.currentDiscussion ? (
      <div className={getDisplayClasses(this.props)} style={{ flexGrow: '1' }}>
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
        className={`recent-discussions-wrapper ${getDisplayClasses(
          this.props,
        )}`}
        style={{ margin: this.props.isModal === true ? '1em' : undefined }}
      >
        <DiscussionsList
          itemType={this.props.itemType}
          itemKey={this.props.itemKey}
          onLoad={this.handleInitialLoad}
          handleCreateDiscussion={this.handleDiscussionCreate}
          handleDiscussionClick={this.handleDiscussionClick}
          me={this.props.me}
        />
      </div>
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
