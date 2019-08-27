import React from 'react';
import { I18n } from '@kineticdata/react';

export const BooleanFilter = props => (
  <div className="form-group">
    <label className="control-label">
      <I18n>{props.title}</I18n>
    </label>

    <select
      className="form-control form-control-sm"
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
    >
      <option />
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  </div>
);
