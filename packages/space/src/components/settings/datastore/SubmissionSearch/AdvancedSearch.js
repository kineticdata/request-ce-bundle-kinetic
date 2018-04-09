import React from 'react';

import { List } from 'immutable';
import { connect } from 'react-redux';
import { lifecycle, compose, withHandlers, withState } from 'recompose';
import { Input } from 'reactstrap';

import { actions } from '../../../../redux/modules/settingsDatastore';

import { IndexPart } from '../../../../records';

const PARAM_CRITERIAS = [
  'All',
  'Starts With',
  'Is Equal To',
  'Is Greater Than',
  'Is Less Than',
  'Is Greater Than or Equal',
  'Is Less Than or Equal',
  'Between',
];

const EqualsCriteria = ({
  part,
  handleIndexPartInput,
  handleAddIndexPartInput,
}) => {
  return (
    <div>
      {part.value.values.map((v, index) => (
        <div className="index-part-values-group" key={index}>
          <input readOnly className="index-part-value" value={v} />
          <button className="btn btn-link">
            <span className="fa fa-fw fa-remove" />
          </button>
        </div>
      ))}
      <div className="index-part-values-group">
        <input
          className="index-part-value"
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
  <div className="index-part-values-group">
    <input
      className="index-part-value"
      value={part.value.input}
      onChange={handleIndexPartInput(part)}
    />
  </div>
);

const BetweenCriteria = ({ part, handleIndexPartBetween }) => (
  <div
    className="index-part-values-group"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <input
      className="index-part-value"
      value={part.value.values.get(0)}
      onChange={handleIndexPartBetween(part, 0)}
    />
    <span>to</span>
    <input
      className="index-part-value"
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
  <div className="advanced-search-content">
    <h5>Advanced Search</h5>
    <div className="index-chooser">
      <span className="index-chooser-label">Look up by:</span>
      <Input
        className="index-chooser-select"
        onChange={e => setIndexHandler(e.target.value)}
        value={indexLookup}
        type="select"
        name="Search By"
        id="index-chooser"
      >
        <option/>
        {indexDefinitions.map(index => (
          <option key={index.name} value={index.name}>
            {index.name}
          </option>
        ))}
      </Input>
    </div>
    <hr/>
    {searchParams.index &&
      searchParams.indexParts.map(part => (
        <div className="index-part" key={part.name}>
          <span className="index-part-label">{part.name}</span>
            <Input
              className="index-part-operation"
              type="select"
              name={`${part.name} Operation`}
              id={`${part.name}-operation`}
              value={part.criteria}
              onChange={e => handleIndexPartCriteria(part, e.target.value)}
            >
              {PARAM_CRITERIAS.map(criteria => (
                <option key={criteria} value={criteria}>
                  {criteria}
                </option>
              ))}
            </Input>
            <span className="index-part-values">
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
      <button className="btn btn-primary advanced-search-button" onClick={handleSearchSubmissions}>Search</button>
  </div>
);

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.currentFormLoading,
  form: state.settingsDatastore.currentForm,
  indexDefinitions: state.settingsDatastore.currentForm
    ? state.settingsDatastore.currentForm.indexDefinitions.filter(
        d => d.status === 'Built',
      )
    : [],
  searchParams: state.settingsDatastore.searchParams,
  indexParts: state.settingsDatastore.searchParams.indexParts,
  pageTokens: state.settingsDatastore.pageTokens,
  nextPageToken: state.settingsDatastore.nextPageToken,
  simpleSearchActive: state.settingsDatastore.simpleSearchActive,
});

export const mapDispatchToProps = {
  fetchSubmissions: actions.fetchSubmissionsAdvanced,
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

const handleIndexPartCriteria = ({ setIndexPartCriteria }) => (
  part,
  criteria,
) => setIndexPartCriteria(part, criteria);

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
