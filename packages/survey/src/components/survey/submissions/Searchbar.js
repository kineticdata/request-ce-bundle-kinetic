import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { Button, Input, InputGroup, InputGroupAddon, Col } from 'reactstrap';
import { List } from 'immutable';
import { IndexPart } from '../../../records';
import { actions } from '../../../redux/modules/surveys';
import { context } from '../../../redux/store';
import { AutoFocusInput } from './AutoFocusInput';
import { I18n } from '@kineticdata/react';

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

const EqualsOperationComponent = ({
  part,
  handleIndexPartInput,
  handleAdd,
  handleAddIndexPartEnter,
  handleRemoveIndexPartInput,
  registerComponent,
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
        <AutoFocusInput
          className="index-part-value"
          value={part.value.input}
          onKeyPress={handleAddIndexPartEnter(part)}
          onChange={handleIndexPartInput(part)}
          innerRef={registerComponent}
        />
        <Button color="link" onClick={handleAdd(part)}>
          <span className="fa fa-fw fa-plus" />
        </Button>
      </div>
    </div>
  );
};
const EqualsOperation = compose(
  withHandlers(() => {
    let input;

    return {
      registerComponent: () => ref => (input = ref),
      handleAdd: ({ handleAddIndexPartInput }) => part => e => {
        handleAddIndexPartInput(part)(e);
        input.focus();
      },
    };
  }),
)(EqualsOperationComponent);

const SingleOperation = ({ part, handleIndexPartInput }) => (
  <div className="index-part-values-group">
    <Input
      className="index-part-value"
      autoFocus
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
      autoFocus
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
      <strong>
        <I18n>Search By:</I18n>
      </strong>
    </Col>
    <Col sm={simpleSearchActive ? 4 : 10}>
      <I18n
        render={translate => (
          <Input
            className="index-chooser-select"
            onChange={e => setIndexHandler(e.target.value)}
            value={searchParams.index ? searchParams.index.name : 'all-fields'}
            type="select"
            name="Search By"
            id="index-chooser"
          >
            <option value="all-fields">
              {translate('All fields that start with')}
            </option>
            {indexDefinitions.map(index => (
              <option key={index.name} value={index.name}>
                {translate(index.name)}
              </option>
            ))}
          </Input>
        )}
      />
    </Col>
    {simpleSearchActive && (
      <Col sm={6}>
        <I18n
          render={translate => (
            <AutoFocusInput
              aria-label="Search"
              onKeyPress={handleInputKeypress}
              id="simple-search-term2"
              name="simple-search-term"
              onChange={e => setSimpleSearchParam(e.target.value)}
              value={simpleSearchParam}
              placeholder={translate(placeholderText)}
              disabled={!simpleSearchActive}
            />
          )}
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
      <span className="index-part-label">
        <I18n>{part.name}</I18n>
      </span>
    </Col>
    <Col sm={4}>
      <I18n
        render={translate => (
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
                {translate(operation)}
              </option>
            ))}
          </Input>
        )}
      />
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
            key={`${part.operation}-${part.name}`}
            part={part}
            handleIndexPartInput={handleIndexPartInput}
          />
        ) : null}
      </span>
    </Col>
  </div>
);

const DirectionSelector = ({ sortDirection, setSortDirection }) => (
  <div className="direction-selector">
    <Col sm={2}>
      <strong>
        <I18n>Sort Direction:</I18n>
      </strong>
    </Col>
    <Col sm={10}>
      <I18n
        render={translate => (
          <Input
            className="sort-direction-select"
            onChange={e => setSortDirection(e.target.value)}
            value={sortDirection}
            type="select"
            name="Sort Direction"
            id="sort-direction-chooser"
          >
            <option value="ASC">{translate('Ascending')}</option>
            <option value="DESC">{translate('Descending')}</option>
          </Input>
        )}
      />
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
  hasStartedSearching,
  placeholderText,
  sortDirection,
  setSortDirection,
}) => (
  <div className="datastore-searchbar">
    <InputGroup size="lg" className="simple-search-input-group">
      <I18n
        render={translate => (
          <AutoFocusInput
            aria-label="Search"
            onKeyPress={handleInputKeypress}
            id="simple-search-term"
            name="simple-search-term"
            className={advancedSearchOpen ? 'advanced-open' : ''}
            onChange={e => setSimpleSearchParam(e.target.value)}
            value={simpleSearchParam}
            placeholder={translate(placeholderText)}
            disabled={!simpleSearchActive}
          />
        )}
      />
      <InputGroupAddon
        style={{ display: advancedSearchOpen ? 'none' : '' }}
        addonType="append"
      >
        {(!simpleSearchActive || hasStartedSearching) && (
          <Button
            color="none"
            className="advanced-dropdown-caret"
            onClick={handleResetSearch}
          >
            <i className="fa fa-fw fa-times text-danger" />
          </Button>
        )}
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
    {advancedSearchOpen && (
      <div className="advanced-dropdown-wrapper">
        <div className="advanced-dropdown-header">
          <h5>
            <I18n>Advanced Search</I18n>
          </h5>
          <button
            onClick={toggleAdvancedSearchOpen}
            type="button"
            className="close"
            aria-label="Close"
          >
            <span aria-hidden="true">
              <i className="fa fa-caret-up" />
            </span>
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
        {!simpleSearchActive && <hr />}
        <DirectionSelector
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
        <div className="row justify-content-end">
          <button className="btn btn-link" onClick={handleResetSearch}>
            <I18n>Reset</I18n>
          </button>
          <Button
            disabled={searching}
            color="primary"
            onClick={handleSearchSubmissions}
          >
            <I18n>Apply</I18n>
          </Button>
        </div>
      </div>
    )}
  </div>
);

export const mapStateToProps = state => ({
  simpleSearchActive: state.surveys.simpleSearchActive,
  advancedSearchOpen: state.surveys.advancedSearchOpen,
  form: state.surveys.currentForm,
  indexDefinitions: state.surveys.currentForm
    ? List(state.surveys.currentForm.indexDefinitions)
        .filter(d => d.status === 'Built')
        .map(d => {
          d.name = d.name.replace(':UNIQUE', '');
          return d;
        })
    : [],
  searchParams: state.surveys.searchParams,
  indexParts: state.surveys.searchParams.indexParts,
  simpleSearchParam: state.surveys.simpleSearchParam,
  searching: state.surveys.searching,
  hasStartedSearching: state.surveys.hasStartedSearching,
  sortDirection: state.surveys.sortDirection,
});

export const mapDispatchToProps = {
  fetchSubmissionsSimple: actions.fetchSubmissionsSimple,
  fetchSubmissionsAdvanced: actions.fetchSubmissionsAdvanced,
  setSimpleSearch: actions.setSimpleSearch,
  toggleSimpleSearch: actions.toggleSimpleSearch,
  setAdvancedSearchOpen: actions.setAdvancedSearchOpen,
  setSimpleSearchParam: actions.setSimpleSearchParam,
  resetSearchParams: actions.resetSearchParams,
  setIndex: actions.setIndex,
  setIndexParts: actions.setIndexParts,
  setIndexPartOperation: actions.setIndexPartOperation,
  setIndexPartBetween: actions.setIndexPartBetween,
  setIndexPartInput: actions.setIndexPartInput,
  addIndexPartInput: actions.addIndexPartInput,
  removeIndexPartInput: actions.removeIndexPartInput,
  setSortDirection: actions.setSortDirection,
  clearPageTokens: actions.clearPageTokens,
};

const handleSearchSubmissions = ({
  fetchSubmissionsSimple,
  fetchSubmissionsAdvanced,
  simpleSearchActive,
  clearPageTokens,
}) => e => {
  e.preventDefault();
  clearPageTokens();
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
  setSimpleSearch,
  simpleSearchActive,
  resetSearchParams,
  setPlaceholderText,
}) => val => {
  resetSearchParams();
  setIndexLookup('');

  if (val === 'all-fields') {
    setSimpleSearch(true);
    setPlaceholderText(DEFAULT_PLACEHOLDER);
  } else {
    setSimpleSearch(false);
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
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
  lifecycle({
    componentWillMount() {
      if (this.props.searchParams.index) {
        this.props.setPlaceholderText(
          `Searching by ${this.props.searchParams.index.name}...`,
        );
      }
      if (
        !this.props.hasStartedSearching &&
        this.props.formSlug === (this.props.form && this.props.form.slug) &&
        this.props.form.defaultSearchIndex
      ) {
        this.props.setSimpleSearch(false);
        const index = this.props.form.indexDefinitions.find(
          indexDef =>
            indexDef.name === this.props.form.defaultSearchIndex.index,
        );
        const parts = List(
          index.parts.map((part, i) =>
            IndexPart({ name: part, operation: 'All' }),
          ),
        );
        this.props.setPlaceholderText(`Searching by ${index.name}...`);
        this.props.setIndex(index);
        this.props.setIndexLookup(index.name);
        this.props.setIndexParts(parts);
        this.props.setSortDirection(
          this.props.form.defaultSearchIndex.direction,
        );
        this.props.fetchSubmissionsAdvanced();
      }
    },
  }),
)(SearchbarComponent);
