import { compose, lifecycle, withHandlers } from 'recompose';
import { CatalogSearchResults } from './CatalogSearchResults';
import { connect } from '../../redux/store';
import { actions } from '../../redux/modules/forms';

const mapStateToProps = (state, props) => {
  const query = props.query || '';

  return {
    query,
    error: state.forms.error,
    forms: state.forms.data,
    appLocation: state.app.location,
    paging: state.forms.paging,
    hasPreviousPage: state.forms.previousPageTokens.size > 0,
    hasNextPage: !!state.forms.nextPageToken,
    pageIndexStart:
      state.forms.previousPageTokens.size * state.forms.limit +
      (state.forms.data && state.forms.data.size > 0 ? 1 : 0),
    pageIndexEnd:
      state.forms.previousPageTokens.size * state.forms.limit +
      ((state.forms.data && state.forms.data.size) || 0),
  };
};

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

const enhance = compose(
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
      this.props.fetchFormsRequest({ query: this.props.query });
    },
    componentDidUpdate(prevProps) {
      if (this.props.query !== prevProps.query) {
        this.props.fetchFormsRequest({ query: this.props.query });
      }
    },
  }),
);

export const CatalogSearchResultsContainer = enhance(CatalogSearchResults);
