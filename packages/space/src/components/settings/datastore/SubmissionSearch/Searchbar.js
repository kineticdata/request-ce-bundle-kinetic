import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Col,
} from 'reactstrap';

import { List } from 'immutable';

import { IndexPart } from '../../../../records';
import { actions } from '../../../../redux/modules/settingsDatastore';

const OPERATIONS = [
  'Equal To',
  'Starts With',
  'All',
  'Is Greater Than',
  'Is Less Than',
  'Is Greater Than or Equal',
  'Is Less Than or Equal',
  'Is Between',
];
const EQUALS_OPERATION = 'Equal To';
const DEFAULT_PLACEHOLDER =
  'Searching by any field that matches the value entered here...';

const EqualsOperation = ({
  part,
  handleIndexPartInput,
  handleAddIndexPartInput,
  handleAddIndexPartEnter,
  handleRemoveIndexPartInput,
}) => {
  return (
    <div>
      {part.value.values.map((v, index) => (
        <div className="index-part-values-group" key={index}>
          <Input readOnly className="index-part-value" value={v} />
          <button
            onClick={handleRemoveIndexPartInput(part, v)}
            className="btn btn-link"
          >
            <span className="fa fa-fw fa-remove" />
          </button>
        </div>
      ))}
      <div className="index-part-values-group">
        <Input
          className="index-part-value"
          value={part.value.input}
          innerRef={input => input && input.focus()}
          onKeyPress={handleAddIndexPartEnter(part)}
          onChange={handleIndexPartInput(part)}
        />
        <Button color="link" onClick={handleAddIndexPartInput(part)}>
          <span className="fa fa-fw fa-plus" />
        </Button>
      </div>
    </div>
  );
};

const SingleOperation = ({ part, handleIndexPartInput }) => (
  <div className="index-part-values-group">
    <input
      className="index-part-value"
      ref={input => input && input.focus()}
      value={part.value.input}
      onChange={handleIndexPartInput(part)}
    />
  </div>
);

const BetweenOperation = ({ part, handleIndexPartBetween }) => (
  <div className="index-part-values-group operation-between">
    <Input
      className="index-part-value"
      value={part.value.values.get(0)}
      innerRef={input => input && input.focus()}
      onChange={handleIndexPartBetween(part, 0)}
    />
    <span>to</span>
    <Input
      className="index-part-value"
      value={part.value.values.get(1)}
      onChange={handleIndexPartBetween(part, 1)}
    />
  </div>
);

const IndexSelector = ({
  simpleSearchActive,
  setIndexHandler,
  setSimpleSearchParam,
  searchParams,
  indexDefinitions,
  simpleSearchParam,
  placeholderText,
}) => (
  <div className="index-selector">
    <Col sm={2}>
      <strong>Search By:</strong>
    </Col>
    <Col sm={simpleSearchActive ? 4 : 10}>
      <Input
        className="index-chooser-select"
        onChange={e => setIndexHandler(e.target.value)}
        value={searchParams.index ? searchParams.index.name : 'all-fields'}
        type="select"
        name="Search By"
        id="index-chooser"
      >
        <option value="all-fields">All fields that start with</option>
        {indexDefinitions.map(index => (
          <option key={index.name} value={index.name}>
            {index.name}
          </option>
        ))}
      </Input>
    </Col>
    {simpleSearchActive && (
      <Col sm={6}>
        <Input
          aria-label="Search"
          innerRef={input => input && input.focus()}
          onKeyPress={handleInputKeypress}
          id="simple-search-term2"
          name="simple-search-term"
          onChange={e => setSimpleSearchParam(e.target.value)}
          value={simpleSearchParam}
          placeholder={placeholderText}
          disabled={!simpleSearchActive}
        />
      </Col>
    )}
  </div>
);

const IndexPartSelector = ({
  part,
  previousPartOperations,
  handleIndexPartOperation,
  handleIndexPartInput,
  handleAddIndexPartInput,
  handleAddIndexPartEnter,
  handleRemoveIndexPartInput,
  handleIndexPartBetween,
}) => (
  <div className="index-part">
    <Col sm={2}>
      <span className="index-part-label">{part.name}</span>
    </Col>
    <Col sm={4}>
      <Input
        className="index-part-operation"
        type="select"
        name={`${part.name} Operation`}
        id={`${part.name}-operation`}
        value={part.operation}
        onChange={e => handleIndexPartOperation(part, e.target.value)}
      >
        {OPERATIONS.filter(
          operation =>
            !previousPartOperations.some(opp => opp !== EQUALS_OPERATION) ||
            operation === 'All',
        ).map(operation => (
          <option key={operation} value={operation}>
            {operation}
          </option>
        ))}
      </Input>
    </Col>
    <Col sm={6}>
      <span className="index-part-values">
        {part.operation === 'Equal To' ? (
          <EqualsOperation
            part={part}
            handleIndexPartInput={handleIndexPartInput}
            handleAddIndexPartInput={handleAddIndexPartInput}
            handleAddIndexPartEnter={handleAddIndexPartEnter}
            handleRemoveIndexPartInput={handleRemoveIndexPartInput}
          />
        ) : part.operation === 'Is Between' ? (
          <BetweenOperation
            part={part}
            handleIndexPartBetween={handleIndexPartBetween}
          />
        ) : part.operation !== 'All' ? (
          <SingleOperation
            part={part}
            handleIndexPartInput={handleIndexPartInput}
          />
        ) : null}
      </span>
    </Col>
  </div>
);

const SearchbarComponent = ({
  indexDefinitions,
  setIndexHandler,
  handleResetSearch,
  toggleSimpleSearch,
  simpleSearchParam,
  setSimpleSearchParam,
  handleSearchSubmissions,
  handleInputKeypress,
  dropdownOpen,
  handleOpenDropdown,
  searchParams,
  searching,
  advancedSearchOpen,
  handleIndexPartOperation,
  handleIndexPartBetween,
  handleIndexPartInput,
  handleAddIndexPartInput,
  handleAddIndexPartEnter,
  handleRemoveIndexPartInput,
  toggleAdvancedSearchOpen,
  simpleSearchActive,
  placeholderText,
}) => (
  <div className="datastore-searchbar">
    <InputGroup size="lg" className="simple-search-input-group">
      <Input
        aria-label="Search"
        innerRef={input => input && input.focus()}
        onKeyPress={handleInputKeypress}
        id="simple-search-term"
        name="simple-search-term"
        className={advancedSearchOpen ? 'advanced-open' : ''}
        onChange={e => setSimpleSearchParam(e.target.value)}
        value={simpleSearchParam}
        placeholder={placeholderText}
        disabled={!simpleSearchActive}
      />
      <InputGroupAddon
        style={{ display: advancedSearchOpen ? 'none' : '' }}
        addonType="append"
      >
        <Button
          color="none"
          className="advanced-dropdown-caret"
          onClick={toggleAdvancedSearchOpen}
        >
          <i className="fa fa-fw fa-caret-down" />
        </Button>
      </InputGroupAddon>
      <InputGroupAddon addonType="append">
        <Button
          disabled={searching}
          className={advancedSearchOpen ? 'advanced-open' : ''}
          onClick={handleSearchSubmissions}
        >
          <i className="fa fa-fw fa-search" />
        </Button>
      </InputGroupAddon>
    </InputGroup>
    <div
      style={{ display: advancedSearchOpen ? '' : 'none' }}
      className="advanced-dropdown-wrapper"
    >
      <div className="advanced-dropdown-header">
        <h5>Advanced Search</h5>
        <button
          onClick={toggleAdvancedSearchOpen}
          type="button"
          className="close"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <IndexSelector
        simpleSearchActive={simpleSearchActive}
        setIndexHandler={setIndexHandler}
        setSimpleSearchParam={setSimpleSearchParam}
        searchParams={searchParams}
        indexDefinitions={indexDefinitions}
        simpleSearchParam={simpleSearchParam}
        placeholderText={placeholderText}
      />
      {!simpleSearchActive && <hr />}
      {searchParams.index &&
        searchParams.indexParts.map((part, i) => {
          const previousPartOperations = searchParams.indexParts
            .map(p => p.operation)
            .slice(0, i);
          return (
            <IndexPartSelector
              key={part.name}
              part={part}
              previousPartOperations={previousPartOperations}
              handleIndexPartOperation={handleIndexPartOperation}
              handleIndexPartInput={handleIndexPartInput}
              handleAddIndexPartInput={handleAddIndexPartInput}
              handleAddIndexPartEnter={handleAddIndexPartEnter}
              handleRemoveIndexPartInput={handleRemoveIndexPartInput}
              handleIndexPartBetween={handleIndexPartBetween}
            />
          );
        })}
      <div className="row justify-content-end">
        <button className="btn btn-link" onClick={handleResetSearch}>
          Reset
        </button>
        <Button
          disabled={searching}
          color="primary"
          onClick={handleSearchSubmissions}
        >
          Apply
        </Button>
      </div>
    </div>
  </div>
);

export const mapStateToProps = state => ({
  simpleSearchActive: state.settingsDatastore.simpleSearchActive,
  form: state.settingsDatastore.currentForm,
  indexDefinitions: state.settingsDatastore.currentForm
    ? List(state.settingsDatastore.currentForm.indexDefinitions).filter(
        d => d.status === 'Built',
      )
    : [],
  searchParams: state.settingsDatastore.searchParams,
  indexParts: state.settingsDatastore.searchParams.indexParts,
  simpleSearchParam: state.settingsDatastore.simpleSearchParam,
  searching: state.settingsDatastore.searching,
});

export const mapDispatchToProps = {
  fetchSubmissionsSimple: actions.fetchSubmissionsSimple,
  fetchSubmissionsAdvanced: actions.fetchSubmissionsAdvanced,
  toggleSimpleSearch: actions.toggleSimpleSearch,
  setSimpleSearchParam: actions.setSimpleSearchParam,
  resetSearchParams: actions.resetSearchParams,
  setIndex: actions.setIndex,
  setIndexParts: actions.setIndexParts,
  setIndexPartOperation: actions.setIndexPartOperation,
  setIndexPartBetween: actions.setIndexPartBetween,
  setIndexPartInput: actions.setIndexPartInput,
  addIndexPartInput: actions.addIndexPartInput,
  removeIndexPartInput: actions.removeIndexPartInput,
};

const handleSearchSubmissions = ({
  fetchSubmissionsSimple,
  fetchSubmissionsAdvanced,
  simpleSearchActive,
}) => e => {
  e.preventDefault();
  if (simpleSearchActive) {
    fetchSubmissionsSimple();
  } else {
    fetchSubmissionsAdvanced();
  }
};

const handleInputKeypress = ({
  fetchSubmissions,
  fetchSubmissionsSimple,
  fetchSubmissionsAdvanced,
  simpleSearchActive,
}) => e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (simpleSearchActive) {
      fetchSubmissionsSimple();
    } else {
      fetchSubmissionsAdvanced();
    }
  }
};

const toggleAdvancedSearchOpen = ({
  advancedSearchOpen,
  setAdvancedSearchOpen,
}) => () => setAdvancedSearchOpen(!advancedSearchOpen);

const setIndexHandler = ({
  setIndex,
  setIndexLookup,
  setIndexParts,
  form,
  indexDefinitions,
  setAdvancedSearchOpen,
  toggleSimpleSearch,
  simpleSearchActive,
  resetSearchParams,
  setPlaceholderText,
}) => val => {
  resetSearchParams();
  setIndexLookup('');
  if (val === 'all-fields') {
    if (!simpleSearchActive) {
      toggleSimpleSearch();
    }
    setPlaceholderText(DEFAULT_PLACEHOLDER);
  } else {
    if (simpleSearchActive) {
      toggleSimpleSearch();
    }
    const index = indexDefinitions.find(indexDef => indexDef.name === val);
    const parts = List(
      index.parts.map((part, i) =>
        IndexPart({
          name: part,
          operation: i === 0 ? 'Equal To' : 'All',
        }),
      ),
    );
    setPlaceholderText(`Searching by ${index.name}...`);
    setIndex(index);
    setIndexLookup(val);
    setIndexParts(parts);
  }
};

const handleIndexPartOperation = ({ setIndexPartOperation }) => (
  part,
  operation,
) => setIndexPartOperation(part, operation);

const handleIndexPartInput = ({ setIndexPartInput }) => part => e =>
  setIndexPartInput(part, e.target.value);

const handleIndexPartBetween = ({ setIndexPartBetween }) => (
  part,
  field,
) => e => setIndexPartBetween(part, field, e.target.value);

const handleAddIndexPartEnter = ({ addIndexPartInput }) => part => e => {
  if (e.key === 'Enter') {
    addIndexPartInput(part);
  }
};
const handleAddIndexPartInput = ({ addIndexPartInput }) => part => () =>
  addIndexPartInput(part);

const handleRemoveIndexPartInput = ({ removeIndexPartInput }) => (
  part,
  value,
) => () => removeIndexPartInput({ part, value: value });

const handleResetSearch = ({
  resetSearchParams,
  setIndexLookup,
  setAdvancedSearchOpen,
  setPlaceholderText,
}) => () => {
  setPlaceholderText(DEFAULT_PLACEHOLDER);
  resetSearchParams();
  setIndexLookup('');
  setAdvancedSearchOpen(false);
};

export const Searchbar = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('advancedSearchOpen', 'setAdvancedSearchOpen', false),
  withState('indexLookup', 'setIndexLookup', ''),
  withState('placeholderText', 'setPlaceholderText', DEFAULT_PLACEHOLDER),
  withHandlers({
    handleSearchSubmissions,
    handleResetSearch,
    handleInputKeypress,
    toggleAdvancedSearchOpen,
    setIndexHandler,
    handleIndexPartOperation,
    handleIndexPartInput,
    handleIndexPartBetween,
    handleAddIndexPartInput,
    handleAddIndexPartEnter,
    handleRemoveIndexPartInput,
  }),
)(SearchbarComponent);
