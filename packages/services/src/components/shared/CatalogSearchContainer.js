import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { CatalogSearch } from './CatalogSearch';
import { actions } from '../../redux/modules/search';

const mapStateToProps = state => ({
  searchTerm: state.services.search.inputValue,
  kappSlug: state.app.config.kappSlug,
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
)(CatalogSearch);
