import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions as discussionsActions } from 'discussions';
import { actions } from '../../redux/modules/queue';
import { QueueItemDiscussions } from './QueueItemDiscussions';

const mapStateToProps = state => {
  const discussionId = state.queue.queue.currentItem
    ? state.queue.queue.currentItem.values['Discussion Id']
    : null;

  return {
    queueItem: state.queue.queue.currentItem,
    discussionId,
  };
};

const mapDispatchToProps = {
  createDiscussion: discussionsActions.createIssue,
  joinDiscussion: discussionsActions.joinDiscussion,
  setCurrentItem: actions.setCurrentItem,
};

const createDiscussion = props => () => {
  props.createDiscussion(
    props.queueItem.label || 'Queue Discussion',
    props.queueItem.values['Details'] || '',
    props.queueItem,
    null,
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
