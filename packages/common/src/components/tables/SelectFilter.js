import React from 'react';
import { I18n } from '@kineticdata/react';

export const SelectFilter = props => (
  <div className="form-group">
    <label className="control-label">
      <I18n>{props.title}</I18n>
    </label>

    <I18n
      render={translate => (
        <select
          className="form-control form-control-sm"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        >
          <option value="">{translate('Any')}</option>
          {props.options.map(option => (
            <option key={option.value} value={option.value}>
              {translate(option.label)}
            </option>
          ))}
        </select>
      )}
    />
  </div>
);
