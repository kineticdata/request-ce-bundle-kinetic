import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions } from 'react-kinops-discussions';

import { QueueItemDiscussions } from './QueueItemDiscussions';

const mapStateToProps = state => {
  const discussionId = state.queue.currentItem
    ? state.queue.currentItem.values['Discussion Id']
    : null;

  return {
    queueItem: state.queue.currentItem,
    discussionId,
  };
};

const mapDispatchToProps = {
  createDiscussion: actions.createIssue,
};

const createDiscussion = props => () => {
  props.createDiscussion(
    props.queueItem.label || 'Queue Discussion',
    props.queueItem.values['Details'] || '',
    props.queueItem,
    (issue, submission) => {
      props.setCurrentItem(submission);
      props.joinDiscussion(issue.guid);
    },
  );
};

export const QueueItemDiscussionsContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),

  withHandlers({
    createDiscussion,
  }),
)(QueueItemDiscussions);
