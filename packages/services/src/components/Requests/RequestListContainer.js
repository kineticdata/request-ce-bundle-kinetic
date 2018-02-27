import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { RequestList } from './RequestList';
import * as constants from '../../constants';
import { actions as submissionsActions } from '../../redux/modules/submissions';

const mapStateToProps = (state, props) => ({
  submissions: state.submissions.data,
  hasNextPage: !!state.submissions.next,
  hasPreviousPage: !state.submissions.previous.isEmpty(),
  counts: state.submissionCounts.data,
  type: props.match.params.type,
});

const mapDispatchToProps = {
  fetchSubmissions: submissionsActions.fetchSubmissions,
  fetchNextPage: submissionsActions.fetchNextPage,
  fetchPreviousPage: submissionsActions.fetchPreviousPage,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(props => ({
    coreState:
      props.type === 'Open' ? constants.CORE_STATE_SUBMITTED : props.type,
  })),
  withHandlers({
    handleNextPage: props => () => props.fetchNextPage(props.coreState),
    handlePreviousPage: props => () => props.fetchPreviousPage(props.coreState),
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmissions(this.props.coreState);
    },
    componentWillUpdate(nextProps) {
      if (this.props.coreState !== nextProps.coreState) {
        this.props.fetchSubmissions(nextProps.coreState);
      }
    },
  }),
);

export const RequestListContainer = enhance(RequestList);
