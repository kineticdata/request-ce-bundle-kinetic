import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { push } from 'connected-react-router';
import { CoreAPI } from 'react-kinetic-core';
import { CatalogSearch } from './CatalogSearch';
import { actions } from '../../redux/modules/search';

const mapStateToProps = state => ({
  searchTerm: state.services.search.inputValue,
  kappSlug: state.app.config.kappSlug,
  searchReFormExists: state.services.search.searchResultsFormExists,
  submitHandler: props => event => {
    event.preventDefault();
    props.push(`/kapps/${props.kappSlug}/search/${props.searchTerm}`);
  },
});

const mapDispatchToProps = {
  push,
  searchResultsFormExists: actions.searchResultsFormExists,
  catalogSearchInput: actions.searchInputChange,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    async componentDidMount() {
      if (!this.props.searchResFormExists) {
        const { form } = await CoreAPI.fetchForm({
          datastore: true,
          formSlug: 'search-results',
        });
        if (form) {
          this.props.searchResultsFormExists(true);
        } else {
          this.props.searchResultsFormExists(false);
        }
      }
    },
  }),
);

export const CatalogSearchContainer = enhance(CatalogSearch);
