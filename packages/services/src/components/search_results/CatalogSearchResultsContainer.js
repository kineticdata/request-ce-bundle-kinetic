import { connect } from 'react-redux';
import { CatalogSearchResults } from './CatalogSearchResults';
import { displayableFormPredicate } from '../../utils';

const matches = (form, term) =>
  form.name.toLowerCase().includes(term.toLowerCase()) ||
  (form.description &&
    form.description.toLowerCase().includes(term.toLowerCase()));

const mapStateToProps = (state, props) => {
  const query = props.match.params.query || '';
  return {
    query,
    forms: state.forms.data
      .filter(displayableFormPredicate)
      .filter(form => matches(form, query)),
  };
};

export const CatalogSearchResultsContainer = connect(mapStateToProps)(
  CatalogSearchResults,
);
