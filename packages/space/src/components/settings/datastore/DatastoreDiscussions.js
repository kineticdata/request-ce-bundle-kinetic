import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions as discussionsActions } from 'discussions';
import { actions } from '../../../redux/modules/settingsDatastore';
import { Discussion, DiscussionsList } from 'discussions';

export const DatastoreDiscussionsComponent = props => {
  const {
    discussionId,
    relatedDiscussions,
    createDiscussion,
    handleDiscussionClear,
    handleDiscussionClick,
    profile,
  } = props;

  return discussionId ? (
    <div className="kinops-discussions d-none d-md-flex">
      <button onClick={handleDiscussionClear} className="btn btn-link btn-back">
        <span className="icon">
          <span className="fa fa-fw fa-chevron-left" />
        </span>
        Back to Discussions
      </button>
      <Discussion
        discussionId={discussionId}
        isMobileModal
        renderClose={() => null}
      />
    </div>
  ) : relatedDiscussions.size > 0 ? (
    <div className="recent-discussions-wrapper kinops-discussions d-none d-md-flex">
      <DiscussionsList
        handleCreateDiscussion={createDiscussion}
        handleDiscussionClick={handleDiscussionClick}
        discussions={relatedDiscussions}
        me={profile}
      />
    </div>
  ) : (
    <div className="kinops-discussions d-none d-md-flex empty">
      <div className="empty-discussion">
        <h5>No discussion to display</h5>
        <p>
          <button onClick={createDiscussion} className="btn btn-link">
            Create a new discussion
          </button>
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const discussionId = state.space.settingsDatastore.currentDiscussion
    ? state.space.settingsDatastore.currentDiscussion.id
    : null;

  return {
    profile: state.app.profile,
    submission: state.space.settingsDatastore.submission,
    relatedDiscussions: state.space.settingsDatastore.relatedDiscussions,
    discussionId,
  };
};

const mapDispatchToProps = {
  createDiscussion: discussionsActions.createDiscussion,
  setCurrentDiscussion: actions.setCurrentDiscussion,
  fetchRelatedDiscussions: actions.fetchRelatedDiscussions,
  fetchSubmission: actions.fetchSubmission,
};

const createDiscussion = props => () => {
  props.createDiscussion({
    title: props.submission.label || 'Datastore Discussion',
    description: props.submission.form.name || '',
    relatedItem: {
      type: 'Datastore Submission',
      key: props.submission.id,
    },
    onSuccess: (discussion, _relatedItem) => {
      props.setCurrentDiscussion(discussion);
      props.fetchRelatedDiscussions(props.submission);
    },
  });
};

const handleDiscussionClear = props => () => props.setCurrentDiscussion(null);
const handleDiscussionClick = props => discussion => () =>
  props.setCurrentDiscussion(discussion);

export const DatastoreDiscussions = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),

  withHandlers({
    createDiscussion,
    handleDiscussionClear,
    handleDiscussionClick,
  }),
)(DatastoreDiscussionsComponent);
