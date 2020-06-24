import { CatalogSearch } from './CatalogSearch';
import { actions } from '../../redux/modules/search';
import { connect } from '../../redux/store';

const mapStateToProps = (state, props) => ({
  searchTerm: state.search.inputValue,
  kappSlug: state.app.kappSlug,
  submitHandler: props => event => {
    event.preventDefault();
    props.onSearch(props.searchTerm);
  },
});

const mapDispatchToProps = {
  catalogSearchInput: actions.searchInputChange,
};

export const CatalogSearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CatalogSearch);
