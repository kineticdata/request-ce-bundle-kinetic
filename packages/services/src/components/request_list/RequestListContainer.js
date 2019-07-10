import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { RequestList } from './RequestList';
import * as constants from '../../constants';
import { actions as submissionsActions } from '../../redux/modules/submissions';
import { actions as submissionCountActions } from '../../redux/modules/submissionCounts';
import { connect } from '../../redux/store';

const mapStateToProps = (state, props) => ({
  submissions: state.submissions.data,
  error: state.submissions.error,
  paging: state.submissions.paging,
  hasPreviousPage: state.submissions.previousPageTokens.size > 0,
  hasNextPage: !!state.submissions.nextPageToken,
  pageIndexStart:
    state.submissions.previousPageTokens.size * state.submissions.limit +
    (state.submissions.data && state.submissions.data.size > 0 ? 1 : 0),
  pageIndexEnd:
    state.submissions.previousPageTokens.size * state.submissions.limit +
    ((state.submissions.data && state.submissions.data.size) || 0),
  counts: state.submissionCounts.data,
  type: props.type,
  appLocation: state.app.location,
});

const mapDispatchToProps = {
  fetchSubmissions: submissionsActions.fetchSubmissionsRequest,
  fetchNextPage: submissionsActions.fetchSubmissionsNext,
  fetchPreviousPage: submissionsActions.fetchSubmissionsPrevious,
  fetchCurrentPage: submissionsActions.fetchSubmissionsCurrent,
  fetchSubmissionCountsRequest:
    submissionCountActions.fetchSubmissionCountsRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    coreState:
      props.type === 'Open' ? constants.CORE_STATE_SUBMITTED : props.type,
  })),
  withHandlers({
    handleNextPage: props => () => props.fetchNextPage(),
    handlePreviousPage: props => () => props.fetchPreviousPage(),
    refreshPage: props => () => props.fetchCurrentPage(),
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchSubmissions({ coreState: this.props.coreState });
    },
    componentDidUpdate(prevProps) {
      if (this.props.coreState !== prevProps.coreState) {
        this.props.fetchSubmissions({ coreState: this.props.coreState });
        this.props.fetchSubmissionCountsRequest();
      }
    },
  }),
);

export const RequestListContainer = enhance(RequestList);
