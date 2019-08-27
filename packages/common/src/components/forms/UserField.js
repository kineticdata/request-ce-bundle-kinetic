import React from 'react';
import { UserSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { FieldWrapper } from './FieldWrapper';
import classNames from 'classnames';

const Input = props => <input {...props.inputProps} className="form-control" />;

const SelectionsContainer = ({ children, selections, multiple }) => (
  <table className="table table-hover table-striped table-without-margin">
    <thead>
      <tr>
        <th>Username</th>
        <th>Display Name</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      {multiple && selections.isEmpty() ? (
        <tr>
          <td colSpan={3}>
            <em>No users selected.</em>
          </td>
        </tr>
      ) : (
        children
      )}
    </tbody>
  </table>
);

const Selection = ({ selection, edit, remove }) => (
  <tr className={`selection ${remove ? 'multi' : ''}`}>
    <td>
      <div className="large">{selection.get('username') || 'New User'}</div>
    </td>
    <td>
      <div className="large">{selection.get('displayName') || 'New User'}</div>
    </td>
    <td>
      {edit ? (
        <button className="btn btn-sm btn-subtle" onClick={edit}>
          <i className="fa fa-fw fa-pencil" />
        </button>
      ) : (
        <button className="btn btn-sm btn-danger" onClick={remove}>
          <i className="fa fa-fw fa-times" />
        </button>
      )}
    </td>
  </tr>
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

export const UserField = props => (
  <FieldWrapper {...props}>
    <UserSelect
      components={{ Input, Selection, Status, Suggestion }}
      textMode
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
    />
  </FieldWrapper>
);

export const UserMultiField = props => (
  <FieldWrapper {...props} omitLabel>
    <h5>
      <span
        className={classNames({
          'form-helper-popover': !!props.helpText,
        })}
        id={`${props.name}-helpTarget`}
      >
        {props.label}
      </span>
    </h5>
    <UserSelect
      components={{
        Input,
        Selection,
        SelectionsContainer,
        Status,
        Suggestion,
        SuggestionsContainer,
      }}
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
