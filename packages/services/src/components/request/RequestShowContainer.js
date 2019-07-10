import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import { actions } from '../../redux/modules/submission';
import { connect } from '../../redux/store';

import { RequestShow } from './RequestShow';

export const openDiscussion = props => () => props.setViewDiscussionModal(true);

export const closeDiscussion = props => () =>
  props.setViewDiscussionModal(false);

export const mapStateToProps = (state, props) => ({
  submission: state.submission.data,
  error: state.submission.error,
  listType: props.type,
  mode: props.mode,
  discussion: state.submission.discussion,
  sendMessageModalOpen: state.submission.isSendMessageModalOpen,
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
  discussionsEnabled: selectDiscussionsEnabled(state),
});

export const mapDispatchToProps = {
  clearSubmission: actions.clearSubmissionRequest,
  fetchSubmission: actions.fetchSubmissionRequest,
  startPoller: actions.startSubmissionPoller,
  stopPoller: actions.stopSubmissionPoller,
  fetchDiscussion: actions.fetchDiscussionRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('viewDiscussionModal', 'setViewDiscussionModal', false),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmission(this.props.submissionId);
      this.props.fetchDiscussion(this.props.submissionId);
      this.props.startPoller(this.props.submissionId);
    },
    componentWillUnmount() {
      this.props.clearSubmission();
      this.props.stopPoller();
    },
  }),
  withHandlers({
    openDiscussion,
    closeDiscussion,
  }),
);

export const RequestShowContainer = enhance(RequestShow);
