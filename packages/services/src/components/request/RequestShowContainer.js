import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';

import { actions } from '../../redux/modules/submission';
import { context } from '../../redux/store';

import { RequestShow } from './RequestShow';

export const openDiscussion = props => () => props.setViewDiscussionModal(true);

export const closeDiscussion = props => () =>
  props.setViewDiscussionModal(false);

export const mapStateToProps = (state, props) => ({
  submission: state.submission.data,
  listType: props.type,
  mode: props.mode,
  discussion: state.submission.discussion,
  sendMessageModalOpen: state.submission.isSendMessageModalOpen,
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
});

export const mapDispatchToProps = {
  clearSubmission: actions.clearSubmission,
  fetchSubmission: actions.fetchSubmission,
  startPoller: actions.startSubmissionPoller,
  stopPoller: actions.stopSubmissionPoller,
  fetchDiscussion: actions.fetchDiscussion,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
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
