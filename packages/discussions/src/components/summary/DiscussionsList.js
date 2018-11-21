import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Utils } from 'common';
import { DiscussionCard } from './DiscussionCard';
import { DiscussionContainer } from '../DiscussionContainer';
import { actions as listActions } from '../../redux/modules/discussionsList';
import { actions as discussionsActions } from '../../redux/modules/discussions';

export class DiscussionsPanel extends Component {
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
    const params = {
      ...this.props.creationParams(),
      relatedItem: {
        type: this.props.itemType,
        key: this.props.itemKey,
      },
      onSuccess: (discussion, _relatedItem) => {
        props.setCurrentDiscussion(discussion);
      },
    };
    console.log(this.props);
    this.props.createDiscussion(params);
  };

  render() {
    return this.state.currentDiscussion ? (
      <div className="kinops-discussions d-none d-md-flex">
        <button
          onClick={this.handleDiscussionClear}
          className="btn btn-link btn-back"
        >
          <span className="icon">
            <span className="fa fa-fw fa-chevron-left" />
          </span>
          Back to Discussions
        </button>
        <DiscussionContainer
          discussionId={this.state.currentDiscussion.id}
          isMobileModal
          renderClose={() => null}
        />
      </div>
    ) : (
      <div className="recent-discussions-wrapper kinops-discussions d-none d-md-flex">
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

export const DiscussionsListComponent = ({
  handleCreateDiscussion,
  handleDiscussionClick,
  discussions,
  me,
}) => {
  // const discussionGroup = Utils.getGroupedDiscussions(discussions);
  return discussions && discussions.size > 0 ? (
    <Fragment>
      <button onClick={handleCreateDiscussion} className="btn btn-inverse">
        New Discussion
      </button>

      {Utils.getGroupedDiscussions(discussions)
        .map((discussions, dateGroup) => (
          <div className="messages" key={dateGroup}>
            <div className="date">
              <hr />
              <span>{dateGroup}</span>
              <hr />
            </div>
            {discussions.map(discussion => (
              <DiscussionCard
                key={discussion.id}
                me={me}
                discussion={discussion}
                onDiscussionClick={handleDiscussionClick}
              />
            ))}
          </div>
        ))
        .toList()}
    </Fragment>
  ) : (
    <div className="empty-discussion">
      <h5>No discussion to display</h5>
      <p>
        <button onClick={handleCreateDiscussion} className="btn btn-link">
          Create a new discussion
        </button>
      </p>
    </div>
  );
};

const mapDispatchToProps = {
  fetchRelatedDiscussions: listActions.fetchRelatedDiscussions,
  createDiscussion: discussionsActions.createDiscussion,
};

const mapStateToProps = state => ({
  discussions: state.discussions.discussionsList.relatedDiscussions,
});
export const DiscussionsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchRelatedDiscussions(
        this.props.itemType,
        this.props.itemKey,
        this.props.onLoad,
      );
    },
  }),
)(DiscussionsListComponent);