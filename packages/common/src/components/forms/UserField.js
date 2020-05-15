import React from 'react';
import { UserSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { FieldWrapper } from './FieldWrapper';
import classNames from 'classnames';

const Input = props => <input {...props.inputProps} className="form-control" />;

const SelectionsContainer = ({ selections, input, multiple }) => (
  <div className={classNames('kinetic-typeahead', { multi: multiple })}>
    {selections}
    {input}
  </div>
);

const Selection = ({ selection, remove }) => {
  const input = (
    <input
      className="form-control"
      type="text"
      disabled
      value={selection.get('username')}
    />
  );
  return remove ? (
    <div className="input-group selection">
      {input}
      {remove && (
        <div className="input-group-append">
          <button
            className="btn btn-sm btn-danger pull-right"
            onClick={remove}
            type="button"
          >
            <i className="fa fa-fw fa-times" />
          </button>
        </div>
      )}
    </div>
  ) : (
    input
  );
};

const SingleSelection = ({ selection, disabled, edit, focusRef, remove }) => (
  <div
    className="selection single form-control-plaintext"
    onClick={edit}
    onKeyDown={edit}
    role="button"
    ref={focusRef}
    tabIndex={0}
  >
    {selection ? selection.get('username') : <em>None</em>}
    {selection &&
      !disabled && (
        <button
          className="btn btn-subtle btn-xs"
          onClick={remove}
          type="button"
        >
          <i className="fa fa-fw fa-times" />
        </button>
      )}
  </div>
);

const Suggestion = ({ suggestion, active }) => (
  <div className={`suggestion ${active ? 'active' : ''}`}>
    <div className="large">{suggestion.get('displayName') || 'New User'}</div>
    <div className="small">
      {suggestion.get('username') || suggestion.get('email')}
    </div>
  </div>
);

const SuggestionsContainer = ({ open, children, containerProps }) => (
  <div {...containerProps} className={`suggestions ${open ? 'open' : ''}`}>
    {children}
  </div>
);

const components = {
  Input,
  SelectionsContainer,
  Selection,
  Status,
  SuggestionsContainer,
  Suggestion,
};

const singleComponents = {
  ...components,
  Selection: SingleSelection,
};

export const UserField = props => (
  <FieldWrapper {...props}>
    <UserSelect
      components={singleComponents}
      textMode
      id={props.id}
      value={props.value}
      allowNew={true}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
    />
  </FieldWrapper>
);

export const UserMultiField = props => (
  <FieldWrapper {...props}>
    <UserSelect
      components={components}
      multiple
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
    />
  </FieldWrapper>
);
