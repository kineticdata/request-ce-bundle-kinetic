import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { CatalogSearch } from './CatalogSearch';
import { actions } from '../../redux/modules/search';
import { context } from '../../redux/store';

const mapStateToProps = state => ({
  searchTerm: state.search.inputValue,
  kappSlug: state.app.kappSlug,
  submitHandler: props => event => {
    event.preventDefault();
    props.push(`/kapps/${props.kappSlug}/search/${props.searchTerm}`);
  },
});

const mapDispatchToProps = {
  push,
  catalogSearchInput: actions.searchInputChange,
};

export const CatalogSearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { context },
)(CatalogSearch);
