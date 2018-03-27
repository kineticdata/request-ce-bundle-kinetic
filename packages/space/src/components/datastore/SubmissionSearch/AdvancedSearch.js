import React from 'react';

import { List } from 'immutable';
import { connect } from 'react-redux';
import { lifecycle, compose, withHandlers, withState } from 'recompose';
import classNames from 'classnames';
import Autocomplete from 'react-autocomplete';

import {
  actions,
  IndexPart,
  DATASTORE_LIMIT,
} from '../../../redux/modules/datastore';

const PARAM_CRITERIAS = [
  'All',
  'Between',
  'Is Equal To',
  'Is Greater Than',
  'Is Less Than',
  'Is Greater Than or Equal',
  'Is Less Than or Equal',
];

const EqualsCriteria = ({
  part,
  handleIndexPartInput,
  handleAddIndexPartInput,
}) => {
  return (
    <div>
      {part.value.values.map((v, index) => (
        <div className="search-lookup-param-group" key={index}>
          <input className="search-lookup-input" value={v} />
          <button className="btn btn-link">
            <span className="fa fa-fw fa-remove" />
          </button>
        </div>
      ))}
      <div className="search-lookup-param-group">
        <input
          className="search-lookup-input"
          value={part.value.input}
          onChange={handleIndexPartInput(part)}
        />
        <button
          className="btn btn-link"
          onClick={handleAddIndexPartInput(part)}
        >
          <span className="fa fa-fw fa-plus" />
        </button>
      </div>
    </div>
  );
};

const SingleCriteria = ({ part, handleIndexPartInput }) => (
  <div className="search-lookup-param-group">
    <input
      className="search-lookup-input"
      value={part.value.input}
      onChange={handleIndexPartInput(part)}
    />
  </div>
);

const BetweenCriteria = ({ part, handleIndexPartBetween }) => (
  <div
    className="search-lookup-param-group"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <input
      className="search-lookup-input"
      value={part.value.values.get(0)}
      onChange={handleIndexPartBetween(part, 0)}
    />
    <span>to</span>
    <input
      className="search-lookup-input"
      value={part.value.values.get(1)}
      onChange={handleIndexPartBetween(part, 1)}
    />
  </div>
);

const AdvancedSearchComponent = ({
  indexDefinitions,
  searchParams,
  handleResetSearch,
  shouldItemRender,
  setIndexHandler,
  indexLookup,
  setIndexLookup,
  indexParts,
  handleIndexPartCriteria,
  handleIndexPartInput,
  handleIndexPartBetween,
  handleAddIndexPartInput,
  handleSearchSubmissions,
  pageTokens,
  nextPageToken,
  toggleSimpleSearch,
}) => (
  <div>
    <div className="search-lookup">
      <strong>Look up by</strong>
      <div className="search-lookup-select">
        <Autocomplete
          shouldItemRender={shouldItemRender}
          renderItem={(item, isHighlighted) => (
            <div
              key={`${item.name}-${item.unique}`}
              className={classNames('item', {
                'item-highlighted': isHighlighted,
              })}
            >
              {item.name}
            </div>
          )}
          value={indexLookup}
          items={indexDefinitions}
          getItemValue={item => item.name}
          onChange={e => setIndexLookup(e.target.value)}
          onSelect={setIndexHandler}
        />
      </div>
      <div className="search-lookup-reset">
        <button className="btn btn-link" onClick={handleResetSearch}>
          Reset
        </button>
        <button className="btn btn-link" onClick={toggleSimpleSearch}>
          Simple Search
        </button>
      </div>
    </div>

    {searchParams.index &&
      searchParams.indexParts.map(part => (
        <div className="search-lookup-param" key={part.name}>
          <span className="search-lookup-param-name">{part.name}</span>
          <div className="search-lookup-param-select search-lookup-select">
            <Autocomplete
              getItemValue={val => val}
              shouldItemRender={() => true}
              renderItem={(item, isHighlighted) => (
                <div
                  className={classNames('item', {
                    'item-highlighted': isHighlighted,
                  })}
                >
                  {item}
                </div>
              )}
              items={PARAM_CRITERIAS}
              value={part.criteria}
              onSelect={handleIndexPartCriteria(part)}
            />
          </div>
          <span className="search-lookup-params">
            {part.criteria === 'Is Equal To' ? (
              <EqualsCriteria
                part={part}
                handleIndexPartInput={handleIndexPartInput}
                handleAddIndexPartInput={handleAddIndexPartInput}
              />
            ) : part.criteria === 'Between' ? (
              <BetweenCriteria
                part={part}
                handleIndexPartBetween={handleIndexPartBetween}
              />
            ) : part.criteria !== 'All' ? (
              <SingleCriteria
                part={part}
                handleIndexPartInput={handleIndexPartInput}
              />
            ) : null}
          </span>
        </div>
      ))}
    <div className="search-lookup-fotter">
      {(pageTokens.size > 0 || nextPageToken !== null) && (
        <span className="search-lookup-error">
          {`The Datastore contains too many records to display at one time.
      Please enter additional search criteria to narrow down the
      results, or use the buttons below the table to navigate between
      chunks of ${DATASTORE_LIMIT} records.`}
        </span>
      )}
      <button
        className="btn btn-primary btn-search-lookup"
        onClick={handleSearchSubmissions}
      >
        Search
      </button>
    </div>
  </div>
);

export const mapStateToProps = state => ({
  loading: state.datastore.currentFormLoading,
  form: state.datastore.currentForm,
  indexDefinitions: state.datastore.currentForm
    ? state.datastore.currentForm.indexDefinitions.filter(
        d => d.status === 'Built',
      )
    : [],
  searchParams: state.datastore.searchParams,
  indexParts: state.datastore.searchParams.indexParts,
  pageTokens: state.datastore.pageTokens,
  nextPageToken: state.datastore.nextPageToken,
  simpleSearchActive: state.datastore.simpleSearchActive,
});

export const mapDispatchToProps = {
  fetchSubmissions: actions.fetchSubmissions,
  setIndex: actions.setIndex,
  setIndexParts: actions.setIndexParts,
  setIndexPartCriteria: actions.setIndexPartCriteria,
  setIndexPartBetween: actions.setIndexPartBetween,
  setIndexPartInput: actions.setIndexPartInput,
  handleIndexPartInput: actions.handleIndexPartInput,
  addIndexPartInput: actions.addIndexPartInput,
  resetSearchParams: actions.resetSearchParams,
  toggleSimpleSearch: actions.toggleSimpleSearch,
};

const shouldItemRender = () => (item, value) => {
  const val = typeof item === 'string' ? item : item.name;
  return val.toUpperCase().includes(value.toUpperCase());
};

const setIndexHandler = ({
  setIndex,
  setIndexLookup,
  setIndexParts,
  form,
  indexDefinitions,
}) => val => {
  const index = indexDefinitions.find(indexDef => indexDef.name === val);
  const parts = List(
    index.parts.map(part =>
      IndexPart({
        name: part,
        criteria: 'All',
      }),
    ),
  );
  setIndex(val);
  setIndexLookup(val);
  setIndexParts(parts);
};

const handleIndexPartCriteria = ({
  setIndexPartCriteria,
}) => part => criteria => setIndexPartCriteria(part, criteria);

const handleIndexPartInput = ({ setIndexPartInput }) => part => e =>
  setIndexPartInput(part, e.target.value);

const handleIndexPartBetween = ({ setIndexPartBetween }) => (
  part,
  field,
) => e => setIndexPartBetween(part, field, e.target.value);

const handleAddIndexPartInput = ({ addIndexPartInput }) => part => () =>
  addIndexPartInput(part);

const handleSearchSubmissions = ({ fetchSubmissions }) => e => {
  e.preventDefault();
  fetchSubmissions();
};

const handleResetSearch = ({ resetSearchParams, setIndexLookup }) => () => {
  resetSearchParams();
  setIndexLookup('');
};

export const AdvancedSearch = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('indexLookup', 'setIndexLookup', ''),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({
    shouldItemRender,
    setIndexHandler,
    handleIndexPartCriteria,
    handleIndexPartInput,
    handleIndexPartBetween,
    handleAddIndexPartInput,
    handleSearchSubmissions,
    handleResetSearch,
  }),
  lifecycle({
    componentWillUnmount() {
      this.props.resetSearchParams();
    },
  }),
)(AdvancedSearchComponent);
