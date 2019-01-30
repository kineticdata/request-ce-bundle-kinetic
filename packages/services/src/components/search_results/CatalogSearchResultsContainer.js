import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { CatalogSearchResults } from './CatalogSearchResults';
import { displayableFormPredicate } from '../../utils';
import { Utils } from 'common';

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

const enhance = compose(
  connect(mapStateToProps),
  lifecycle({
    componentDidMount() {
      if (this.props.searchResultsFormExists) {
        Utils.recordSearch(
          this.props.kappSlug,
          this.props.query,
          this.props.forms,
        );
      }
    },
    componentWillReceiveProps(nextProp) {
      if (
        nextProp.searchResultsFormExists &&
        this.props.query !== nextProp.query
      ) {
        Utils.recordSearch(nextProp.kappSlug, nextProp.query, nextProp.forms);
      }
    },
  }),
);

export const CatalogSearchResultsContainer = enhance(CatalogSearchResults);
