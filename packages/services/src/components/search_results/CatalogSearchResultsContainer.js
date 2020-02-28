import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
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
    limit: state.forms.limit,
    paging: state.forms.paging,
    hasPreviousPage: state.forms.previousPageTokens.size > 0,
    hasNextPage: !!state.forms.nextPageToken,
    pageIndexStart:
      state.forms.previousPageTokens.size * state.forms.limit +
      (state.forms.data && state.forms.data.size > 0 ? 1 : 0),
    pageIndexEnd:
      state.forms.previousPageTokens.size * state.forms.limit +
      ((state.forms.data && state.forms.data.size) || 0),
    searchableForms: state.servicesApp.searchableForms,
  };
};

const mapDispatchToProps = {
  fetchFormsRequest: actions.fetchFormsRequest,
  fetchFormsNext: actions.fetchFormsNext,
  fetchFormsPrevious: actions.fetchFormsPrevious,
};

const matches = (form, term) =>
  form.name.toLowerCase().includes(term.toLowerCase()) ||
  (form.description &&
    form.description.toLowerCase().includes(term.toLowerCase())) ||
  (form.keywords &&
    form.keywords.some(keyword =>
      keyword.toLowerCase().includes(term.toLowerCase()),
    ));

const searchClientSideForms = props => (offset = 0) => {
  if (props.searchableForms) {
    return props.searchableForms
      .filter(form => matches(form, props.query))
      .toJS()
      .slice(offset, offset + props.limit);
  }
  return [];
};

const countClientSideForms = props => () => {
  if (props.searchableForms) {
    return props.searchableForms.filter(form => matches(form, props.query))
      .size;
  }
  return 0;
};

const loadNextHandler = props => () => {
  if (props.hasNextPage) {
    props.clientSideSearch
      ? props.setClientSideSearch({
          count: props.clientSideSearch.count,
          data: props.searchClientSideForms(
            props.clientSideSearch.offset + props.limit,
          ),
          offset: props.clientSideSearch.offset + props.limit,
        })
      : props.fetchFormsNext();
  }
};

const loadPreviousHandler = props => () => {
  if (props.hasPreviousPage) {
    props.clientSideSearch
      ? props.setClientSideSearch({
          count: props.clientSideSearch.count,
          data: props.searchClientSideForms(
            Math.max(props.clientSideSearch.offset - props.limit, 0),
          ),
          offset: Math.max(props.clientSideSearch.offset - props.limit, 0),
        })
      : props.fetchFormsPrevious();
  }
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    searchClientSideForms,
    countClientSideForms,
  }),
  withState(
    'clientSideSearch',
    'setClientSideSearch',
    props =>
      props.searchableForms
        ? {
            count: props.countClientSideForms(),
            data: props.searchClientSideForms(),
            offset: 0,
          }
        : null,
  ),
  withProps(
    props =>
      props.clientSideSearch
        ? {
            hasPreviousPage: props.clientSideSearch.offset > 0,
            hasNextPage:
              props.clientSideSearch.count >
              props.clientSideSearch.offset + props.limit,
            pageIndexStart:
              props.clientSideSearch.offset +
              (props.clientSideSearch.data.length ? 1 : 0),
            pageIndexEnd:
              props.clientSideSearch.offset +
              props.clientSideSearch.data.length,
          }
        : {},
  ),
  withHandlers({
    loadNextHandler,
    loadPreviousHandler,
  }),
  lifecycle({
    componentDidMount() {
      !this.props.clientSideSearch &&
        this.props.fetchFormsRequest({ query: this.props.query });
    },
    componentDidUpdate(prevProps) {
      if (this.props.query !== prevProps.query) {
        if (this.props.clientSideSearch) {
          this.props.setClientSideSearch({
            count: this.props.countClientSideForms(),
            data: this.props.searchClientSideForms(),
            offset: 0,
          });
        } else {
          this.props.fetchFormsRequest({ query: this.props.query });
        }
      }
    },
  }),
);

export const CatalogSearchResultsContainer = enhance(CatalogSearchResults);
