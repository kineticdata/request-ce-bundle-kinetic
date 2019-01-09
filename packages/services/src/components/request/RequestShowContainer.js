import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';

import { actions } from '../../redux/modules/submission';
import { RequestShow } from './RequestShow';

export const openDiscussion = props => () => props.setViewDiscussionModal(true);

export const closeDiscussion = props => () =>
  props.setViewDiscussionModal(false);

export const mapStateToProps = (state, props) => ({
  submission: state.services.submission.data,
  listType: props.match.params.type,
  mode: props.match.params.mode,
  hasDiscussion: state.services.submission.discussion !== null,
  sendMessageModalOpen: state.services.submission.isSendMessageModalOpen,
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
  ),
  withState('viewDiscussionModal', 'setViewDiscussionModal', false),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmission(this.props.match.params.submissionId);
      this.props.fetchDiscussion(this.props.match.params.submissionId);
      this.props.startPoller(this.props.match.params.submissionId);
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
