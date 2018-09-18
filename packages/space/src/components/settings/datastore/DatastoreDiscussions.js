import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions as discussionsActions } from 'discussions';
import { actions } from '../../../redux/modules/settingsDatastore';
import { Discussion } from 'discussions';

export const DatastoreDiscussionsComponent = props => {
  const { discussionId, createDiscussion } = props;

  return discussionId ? (
    <Discussion
      discussionId={discussionId}
      isMobileModal
      renderClose={() => null}
    />
  ) : (
    <div className="kinops-discussions d-none d-md-flex">
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
    submission: state.space.settingsDatastore.submission,
    discussionId,
  };
};

const mapDispatchToProps = {
  createDiscussion: discussionsActions.createDiscussion,
  setCurrentDiscussion: actions.setCurrentDiscussion,
  fetchSubmission: actions.fetchSubmission,
};

const createDiscussion = props => () => {
  props.createDiscussion({
    title: props.submission.label || 'Datastore Discussion',
    description: props.submission.form.name || '',
    relatedItem: {
      type: 'Datastore Submission',
      key: `${props.submission.form.slug}/${props.submission.id}`,
    },
    onSuccess: (discussion, _relatedItem) => {
      props.setCurrentDiscussion(discussion);
    },
  });
};

export const DatastoreDiscussions = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),

  withHandlers({
    createDiscussion,
  }),
)(DatastoreDiscussionsComponent);
