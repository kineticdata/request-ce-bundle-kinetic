import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import {
  Button,
  Input,
  InputGroup,
} from 'reactstrap';

import { actions } from '../../../../redux/modules/settingsDatastore';

import { AdvancedSearch } from './AdvancedSearch';

const SimpleSearchComponent = ({
  handleResetSearch,
  toggleSimpleSearch,
  simpleSearchParam,
  setSimpleSearchParam,
  handleSearchSubmissions,
  handleInputKeypress,
  dropdownOpen,
  handleOpenDropdown,
}) => (
  <div>
    <div className="search-lookup-reset">
      <button className="btn btn-link" onClick={handleResetSearch}>
        Reset
      </button>
    </div>
    <div className="search-lookup">
      <InputGroup size="lg" className="datastore-search-bar">
        <Input
          aria-label="Search"
          autoFocus
          onKeyPress={handleInputKeypress}
          id="simple-search-term"
          name="simple-search-term"
          onChange={e => setSimpleSearchParam(e.target.value)}
          value={simpleSearchParam}
          placeholder="Enter search term"
        />
        <div className="input-group-append">
          <Button outline color="secondary" onClick={handleSearchSubmissions}>
            Search
          </Button>
          <Button
            onClick={handleOpenDropdown}
            color="secondary"
            className="dropdown-toggle dropdown-toggle-split"
            outline
          />
        </div>
      </InputGroup>
    </div>
    <div
      style={{display: dropdownOpen ? '' : 'none'}}
      className="advanced-search-dropdown"
    >
      <AdvancedSearch />
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
  if (e.key === 'Enter') {
    fetchSubmissions();
  }
};

const handleResetSearch = ({ resetSearchParams }) => () => {
  resetSearchParams();
};

const handleOpenDropdown = ({ dropdownOpen, setDropdownOpen }) => () =>
  setDropdownOpen(!dropdownOpen);

export const SimpleSearch = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('dropdownOpen', 'setDropdownOpen', false),
  withHandlers({
    handleSearchSubmissions,
    handleResetSearch,
    handleInputKeypress,
    handleOpenDropdown,
  }),
)(SimpleSearchComponent);
