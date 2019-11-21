import React from 'react';
import { I18n } from '@kineticdata/react';

export const BetweenDateFilter = ({
  value,
  name,
  title,
  onChange,
  tableOptions: { datetype = 'date' },
}) => {
  return (
    <div className="row">
      <div className="col-6">
        <div className="form-group">
          <label className="control-label">
            <I18n>Start Date</I18n>
          </label>
          <input
            className="form-control form-control-sm"
            type="date"
            name={name}
            value={value.get(0)}
            onChange={e => onChange(value.set(0, e.target.value))}
          />
        </div>
      </div>
      <div className="col-6">
        <div className="form-group">
          <label className="control-label">
            <I18n>End Date</I18n>
          </label>
          <input
            className="form-control form-control-sm"
            type="date"
            name={name}
            value={value.get(1)}
            onChange={e => onChange(value.set(1, e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};
