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

const Selection = ({ selection, edit, remove }) => {
  const input = (
    <input
      className="form-control"
      type="text"
      disabled
      value={selection.get('username')}
    />
  );
  return edit || remove ? (
    <div className="input-group selection">
      {input}
      {edit && (
        <div className="input-group-append">
          <button
            className="btn btn-sm btn-subtle"
            onClick={edit}
            type="button"
          >
            <span className="sr-only">Edit</span>
            <i className="fa fa-fw fa-pencil" />
          </button>
        </div>
      )}
      {remove && (
        <div className="input-group-append">
          <button
            className="btn btn-sm btn-danger pull-right"
            onClick={remove}
            type="button"
          >
            <span className="sr-only">Remove</span>
            <i className="fa fa-fw fa-times" />
          </button>
        </div>
      )}
    </div>
  ) : (
    input
  );
};

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

export const UserField = props => (
  <FieldWrapper {...props}>
    <UserSelect
      components={components}
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
