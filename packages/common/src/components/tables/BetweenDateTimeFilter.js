import React from 'react';
import { I18n } from '@kineticdata/react';
import moment from 'moment';

const placeholder = `Enter date, e.g. ${moment().format('MM/DD/YYYY hh:mm A')}`;

export const BetweenDateTimeFilter = ({ value, name, title, onChange }) => {
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="form-group">
          <label className="control-label">
            <I18n>Start Date</I18n>
          </label>
          <input
            className="form-control form-control-sm"
            type="datetime-local"
            placeholder={placeholder}
            name={name}
            value={value.get(0)}
            onChange={e => onChange(value.set(0, e.target.value))}
          />
        </div>
      </div>
      <div className="col-sm-12">
        <div className="form-group">
          <label className="control-label">
            <I18n>End Date</I18n>
          </label>
          <input
            className="form-control form-control-sm"
            type="datetime-local"
            name={name}
            placeholder={placeholder}
            value={value.get(1)}
            onChange={e => onChange(value.set(1, e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};
