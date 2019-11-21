import React from 'react';
import { I18n } from '@kineticdata/react';

export const TypeaheadStatus = props => (
  <div>
    {props.info && (
      <div className="status info">
        <I18n>{props.info}</I18n>
        {props.clearFilterField && (
          <button className="btn btn-sm" onClick={props.clearFilterField}>
            <i className="fa fa-fw fa-remove" />
          </button>
        )}
      </div>
    )}
    {props.warning && (
      <div className="status warning">
        <i className="fa fa-fw fa-exclamation-triangle" />
        <I18n>{props.warning}</I18n>
      </div>
    )}
    {props.filterFieldOptions && (
      <ul className="search-actions">
        {props.filterFieldOptions.map(({ count, label, onClick, value }, i) => (
          <li
            className="suggestion"
            key={i}
            role="button"
            tabIndex={0}
            onClick={onClick}
          >
            <i className="fa fa-fw fa-search" />
            <span>
              <I18n>See</I18n>{' '}
              <strong>
                <I18n>{label}</I18n>
              </strong>{' '}
              <I18n>results for</I18n> "{value}"
            </span>
            <span className="count">{count}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
