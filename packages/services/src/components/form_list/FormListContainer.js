import { FormList } from './FormList';
import { actions } from '../../redux/modules/forms';
import { connect } from '../../redux/store';
import { compose, lifecycle, withHandlers } from 'recompose';

const mapStateToProps = state => ({
  error: state.forms.error,
  forms: state.forms.data,
  paging: state.forms.paging,
  hasPreviousPage: state.forms.previousPageTokens.size > 0,
  hasNextPage: !!state.forms.nextPageToken,
  pageIndexStart:
    state.forms.previousPageTokens.size * state.forms.limit +
    (state.forms.data && state.forms.data.size > 0 ? 1 : 0),
  pageIndexEnd:
    state.forms.previousPageTokens.size * state.forms.limit +
    ((state.forms.data && state.forms.data.size) || 0),
});

const mapDispatchToProps = {
  fetchFormsRequest: actions.fetchFormsRequest,
  fetchFormsNext: actions.fetchFormsNext,
  fetchFormsPrevious: actions.fetchFormsPrevious,
};

const loadNextHandler = props => () => {
  if (props.hasNextPage) {
    props.fetchFormsNext();
  }
};

const loadPreviousHandler = props => () => {
  if (props.hasPreviousPage) {
    props.fetchFormsPrevious();
  }
};

export const FormListContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    loadNextHandler,
    loadPreviousHandler,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchFormsRequest({ limit: 24 });
    },
  }),
)(FormList);
