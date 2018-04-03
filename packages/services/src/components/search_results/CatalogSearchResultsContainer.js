import { connect } from 'react-redux';
import { parse } from 'query-string';
import { CatalogSearchResults } from './CatalogSearchResults';
import { displayableFormPredicate } from '../../utils';

const matches = (form, term) =>
  form.name.toLowerCase().includes(term.toLowerCase()) ||
  (form.description &&
    form.description.toLowerCase().includes(term.toLowerCase()));

const mapStateToProps = (state, props) => {
  const query = parse(props.location.search).q;
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
