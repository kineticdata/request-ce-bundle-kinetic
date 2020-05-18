import React from 'react';
import { UserSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { FieldWrapper } from './FieldWrapper';
import classNames from 'classnames';
import { getIn } from 'immutable';

const Input = props => (
  <input
    {...props.inputProps}
    className="form-control"
    placeholder={getIn(props, ['inputProps', 'selection', 'username'], '')}
  />
);

const SelectionsContainer = ({ selections, input, multiple }) => (
  <div className={classNames('kinetic-typeahead', { multi: multiple })}>
    {selections}
    {input}
  </div>
);

const Selection = ({ selection, remove }) => (
  <div className="input-group selection">
    <input
      className="form-control"
      type="text"
      disabled
      value={selection.get('username')}
    />
    <div className="input-group-append">
      <button className="btn btn-sm btn-clear" onClick={remove} type="button">
        <span className="sr-only">Remove</span>
        <i className="fa fa-fw fa-times" />
      </button>
    </div>
  </div>
);

const SingleSelection = ({ selection, disabled, edit, focusRef, remove }) => (
  <div className="input-group selection">
    <input
      className="form-control"
      type="text"
      value={selection ? selection.get('username') : ''}
      onChange={() => {}}
      onFocus={e => e.target.click()}
      onClick={edit}
      disabled={disabled}
    />
    {selection &&
      !disabled && (
        <div className="input-group-append">
          <button
            className="btn btn-sm btn-clear"
            onClick={remove}
            type="button"
          >
            <span className="sr-only">Remove</span>
            <i className="fa fa-fw fa-times" />
          </button>
        </div>
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
