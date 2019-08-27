import React from 'react';
import { I18n } from '@kineticdata/react';

export const SelectFilter = props => (
  <div className="form-group">
    <label className="control-label">
      <I18n>{props.title}</I18n>
    </label>

    <select
      className="form-control form-control-sm"
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
    >
      <option value="">Any</option>
      {props.options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
