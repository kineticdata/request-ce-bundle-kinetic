import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { CatalogSearchResults } from './CatalogSearchResults';
import { displayableFormPredicate } from '../../utils';
import { recordSearchHistory } from 'common';
import { context } from '../../redux/store';

const matches = (form, term) =>
  form.name.toLowerCase().includes(term.toLowerCase()) ||
  (form.description &&
    form.description.toLowerCase().includes(term.toLowerCase()));

const mapStateToProps = (state, props) => {
  const query = props.query || '';

  return {
    query,
    forms: state.forms.data
      .filter(displayableFormPredicate)
      .filter(form => matches(form, query)),
    kappSlug: state.app.kappSlug,
    searchResultsFormExists: state.search.searchResultsFormExists,
    appLocation: state.app.location,
  };
};

const enhance = compose(
  connect(
    mapStateToProps,
    null,
    null,
    { context },
  ),
  lifecycle({
    componentDidMount() {
      recordSearchHistory({
        kappSlug: this.props.kappSlug,
        searchTerm: this.props.query,
        resultsCount: this.props.forms.size,
      });
    },
    componentDidUpdate(prevProps) {
      if (this.props.query !== prevProps.query) {
        recordSearchHistory({
          kappSlug: this.props.kappSlug,
          searchTerm: this.props.query,
          resultsCount: this.props.forms.size,
        });
      }
    },
  }),
);

export const CatalogSearchResultsContainer = enhance(CatalogSearchResults);
