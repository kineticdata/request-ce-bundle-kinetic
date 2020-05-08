import React from 'react';
import { FormSelect, I18n } from '@kineticdata/react';
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
      value={selection.get('slug')}
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
    <div className="large">
      <I18n>{suggestion.get('name')}</I18n>{' '}
      <small>{`<${suggestion.get('slug')}>`}</small>
    </div>
    <div className="small">
      <I18n>{suggestion.get('description')}</I18n>
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

export const FormField = props => (
  <FieldWrapper {...props}>
    <FormSelect
      components={components}
      textMode
      id={props.id}
      value={props.value}
      options={props.options}
      search={props.search}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
    />
  </FieldWrapper>
);

export const FormMultiField = props => (
  <FieldWrapper {...props}>
    <FormSelect
      components={components}
      multiple
      id={props.id}
      value={props.value}
      options={props.options}
      search={props.search}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
    />
  </FieldWrapper>
);
