import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions as discussionsActions } from 'discussions';
import { actions } from '../../redux/modules/queue';
import { QueueItemDiscussions } from './QueueItemDiscussions';

const mapStateToProps = state => {
  const discussionId = state.queue.queue.currentDiscussion
    ? state.queue.queue.currentDiscussion.id
    : null;

  return {
    profile: state.app.profile,
    queueItem: state.queue.queue.currentItem,
    kappSlug: state.app.config.kappSlug,
    discussionId,
    relatedDiscussions: state.queue.queue.relatedDiscussions,
  };
};

const mapDispatchToProps = {
  createDiscussion: discussionsActions.createDiscussion,
  setCurrentItem: actions.setCurrentItem,
  setCurrentDiscussion: actions.setCurrentDiscussion,
};

const handleCreateDiscussion = props => () => {
  const owningTeams = [{ name: props.queueItem.values['Assigned Team'] }];
  const owningUsers = [
    {
      username:
        props.queueItem.values['Assigned Individual'] || props.profile.username,
    },
  ];

  props.createDiscussion({
    title: props.queueItem.label || 'Queue Discussion',
    description: props.queueItem.values['Details'] || '',
    relatedItem: {
      type: 'Submission',
      key: props.queueItem.id,
    },
    owningUsers,
    owningTeams,
    onSuccess: (discussion, _relatedItem) => {
      props.setCurrentDiscussion(discussion);
    },
  });
};

const handleDiscussionClick = props => discussion => () =>
  props.setCurrentDiscussion(discussion);

const handleDiscussionClear = props => () => props.setCurrentDiscussion(null);

export const QueueItemDiscussionsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),

  withHandlers({
    handleCreateDiscussion,
    handleDiscussionClick,
    handleDiscussionClear,
  }),
)(QueueItemDiscussions);
