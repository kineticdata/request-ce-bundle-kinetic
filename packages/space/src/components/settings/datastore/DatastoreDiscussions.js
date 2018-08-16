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
  const discussionId = state.space.settingsDatastore.submission
    ? state.space.settingsDatastore.submission.values['Discussion Id']
    : null;

  return {
    submission: state.space.settingsDatastore.submission,
    discussionId,
  };
};

const mapDispatchToProps = {
  createDiscussion: discussionsActions.createIssue,
  joinDiscussion: discussionsActions.joinDiscussion,
  fetchSubmission: actions.fetchSubmission,
};

const createDiscussion = props => () => {
  props.createDiscussion(
    props.submission.label || 'Datastore Discussion',
    props.submission.form.name || '',
    props.submission,
    null,
    (issue, submission) => {
      props.fetchSubmission(submission.id);
      props.joinDiscussion(issue.guid);
    },
    true,
  );
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
