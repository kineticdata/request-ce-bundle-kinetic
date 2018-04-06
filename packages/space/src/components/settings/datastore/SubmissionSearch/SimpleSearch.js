import React from 'react';

import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';

import { actions } from '../../../../redux/modules/settingsDatastore';

const SimpleSearchComponent = ({
  handleResetSearch,
  toggleSimpleSearch,
  simpleSearchParam,
  setSimpleSearchParam,
  handleSearchSubmissions,
  handleInputKeypress
}) => (
  <div className="search-lookup">
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text">Enter Search Term</span>
      </div>
      <input
        type="text"
        ref={input => input && input.focus()}
        onKeyPress={handleInputKeypress}
        id="simple-search-term"
        name="simple-search-term"
        onChange={e => setSimpleSearchParam(e.target.value)}
        value={simpleSearchParam}
        className="form-control"
        placeholder="Enter search term"
      />
    </div>
    <div className="input-group-append">
      <button onClick={handleSearchSubmissions} className="btn btn-primary" type="button">Search</button>
    </div>
    <div className="search-lookup-reset">
      <button className="btn btn-link" onClick={handleResetSearch}>
        Reset
      </button>
      <button className="btn btn-link" onClick={toggleSimpleSearch}>
        Advanced Search
      </button>
    </div>
  </div>
);

export const mapStateToProps = state => ({
  simpleSearchParam: state.settingsDatastore.simpleSearchParam,
});

export const mapDispatchToProps = {
  fetchSubmissions: actions.fetchSubmissionsSimple,
  toggleSimpleSearch: actions.toggleSimpleSearch,
  setSimpleSearchParam: actions.setSimpleSearchParam,
  resetSearchParams: actions.resetSearchParams,
};

const handleSearchSubmissions = ({ fetchSubmissions }) => e => {
  e.preventDefault();
  fetchSubmissions();

};

const handleInputKeypress = ({ fetchSubmissions }) => e => {
  if(e.key === 'Enter'){
    fetchSubmissions();
  }
}

const handleResetSearch = ({ resetSearchParams }) => () => {
  resetSearchParams();
};

export const SimpleSearch = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({
    handleSearchSubmissions,
    handleResetSearch,
    handleInputKeypress
  }),
)(SimpleSearchComponent);
