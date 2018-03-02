import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { stringify } from 'query-string';
import { CatalogSearch } from './CatalogSearch';
import { actions } from '../../redux/modules/search';

const stateMapper = state => ({
  searchTerm: state.search.inputValue,
  kappSlug: state.kinops.kappSlug,
  submitHandler: props => event => {
    event.preventDefault();
    props.push(
      `/kapps/${props.kappSlug}/search?${stringify({ q: props.searchTerm })}`,
    );
  },
});

const dispatchMapper = { push, catalogSearchInput: actions.searchInputChange };

export const CatalogSearchContainer = connect(stateMapper, dispatchMapper)(
  CatalogSearch,
);
