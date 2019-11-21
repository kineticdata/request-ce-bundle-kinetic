import React from 'react';
import { I18n } from '@kineticdata/react';

const FilterTextField = ({ filter }) => (
  <div className="form-group">
    <label>
      <I18n>{filter.get('title')}</I18n>
    </label>
    <input
      className="form-control input-sm"
      type="text"
      value={filter.get('value')}
      onChange={e => filter.get('onChange')(e.target.value)}
    />
  </div>
);

const FilterBooleanField = ({ filter }) => (
  <div className="form-group">
    <label>
      <I18n>{filter.get('title')}</I18n>
    </label>
    <select
      className="form-control form-control-sm"
      value={filter.get('value')}
      onChange={e => filter.get('onChange')(e.target.value)}
    >
      <option />
      <option value="true">
        <I18n>Yes</I18n>
      </option>
      <option value="false">
        <I18n>No</I18n>
      </option>
    </select>
  </div>
);

export const generateFilterControl = ({
  textFields = [],
  booleanFields = [],
}) => ({ filters, onSearch, columnSet }) => (
  <form onSubmit={onSearch}>
    {filters
      .sort(
        (a, b) =>
          columnSet.indexOf(a.get('column')) -
          columnSet.indexOf(b.get('column')),
      )
      .map(
        filter =>
          textFields.includes(filter.get('column')) ? (
            <FilterTextField filter={filter} key={filter.get('column')} />
          ) : booleanFields.includes(filter.get('column')) ? (
            <FilterBooleanField filter={filter} key={filter.get('column')} />
          ) : null,
      )
      .filter(filter => filter !== null)}
    <button className="btn btn-sm btn-secondary pull-right" type="submit">
      <I18n>Search</I18n>
    </button>
  </form>
);
