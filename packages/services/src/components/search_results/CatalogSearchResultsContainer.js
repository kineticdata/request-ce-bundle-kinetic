import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { CatalogSearchResults } from './CatalogSearchResults';
import { displayableFormPredicate } from '../../utils';
import { searchHistoryActions } from 'common';

const matches = (form, term) =>
  form.name.toLowerCase().includes(term.toLowerCase()) ||
  (form.description &&
    form.description.toLowerCase().includes(term.toLowerCase()));

const mapStateToProps = (state, props) => {
  const query = props.match.params.query || '';

  return {
    query,
    forms: state.services.forms.data
      .filter(displayableFormPredicate)
      .filter(form => matches(form, query)),
    kappSlug: state.app.config.kappSlug,
    searchResultsFormExists: state.services.search.searchResultsFormExists,
  };
};

const mapDispatchToProps = {
  recordSearchHistory: searchHistoryActions.recordSearchHistory,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.recordSearchHistory({
        kappSlug: this.props.kappSlug,
        searchTerm: this.props.query,
        resultsCount: this.props.forms.size,
      });
    },
    componentDidUpdate(prevProps) {
      if (this.props.query !== prevProps.query) {
        this.props.recordSearchHistory({
          kappSlug: this.props.kappSlug,
          searchTerm: this.props.query,
          resultsCount: this.props.forms.size,
        });
      }
    },
  }),
);

export const CatalogSearchResultsContainer = enhance(CatalogSearchResults);
