import React from 'react';
import { I18n } from '@kineticdata/react';

export const TextFilter = ({ value, name, title, onChange }) => (
  <div className="form-group">
    <label className="control-label">
      <I18n>{title}</I18n>
    </label>
    <input
      className="form-control form-control-sm"
      type="text"
      name="name"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);
