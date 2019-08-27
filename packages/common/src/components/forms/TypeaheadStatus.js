import React from 'react';

export const TypeaheadStatus = props => (
  <div>
    {props.info && (
      <div className="status info">
        {props.info}
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
        {props.warning}
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
              See <strong>{label}</strong> results for "{value}"
            </span>
            <span className="count">{count}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
