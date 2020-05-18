import React from 'react';
import { I18n, StaticSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';
import { Map, getIn } from 'immutable';

const Input = props => (
  <input
    {...props.inputProps}
    className="form-control"
    placeholder={getIn(props, ['inputProps', 'selection', 'label'], '')}
  />
);

const SelectionsContainer = ({ input, selections }) => (
  <div className="kinetic-typeahead">
    {selections}
    {input}
  </div>
);

const Selection = ({ selection, disabled, edit, focusRef, remove }) => (
  <div className="input-group selection">
    <input
      className="form-control"
      type="text"
      value={selection ? selection.get('label') : ''}
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
    <div className="large">
      <I18n>{suggestion.get('label')}</I18n>
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

export const SelectField = props => {
  const {
    typeahead,
    allowNew,
    minSearchLength,
  } = props.renderAttributes.toJS();

  return (
    <FieldWrapper {...props}>
      {typeahead ? (
        <StaticSelect
          components={components}
          id={props.id}
          value={
            props.value
              ? props.options.find(
                  option =>
                    option.get('value') === props.value ||
                    option.get('label') === props.value,
                ) || Map({ label: props.value, value: props.value })
              : null
          }
          options={props.options}
          search={props.search}
          allowNew={allowNew}
          minSearchLength={minSearchLength}
          onChange={value => props.onChange(value ? value.get('value') : '')}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          placeholder={props.placeholder}
        />
      ) : (
        <I18n
          render={translate => (
            <select
              className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
              id={props.id}
              name={props.name}
              value={props.value}
              onBlur={props.onBlur}
              onChange={props.onChange}
              onFocus={props.onFocus}
            >
              <option value="">{translate(props.placeholder) || ''}</option>
              {props.options.map((option, i) => (
                <option value={option.get('value')} key={i}>
                  {option.get('label')
                    ? translate(option.get('label'))
                    : option.get('value')}
                </option>
              ))}
            </select>
          )}
        />
      )}
    </FieldWrapper>
  );
};
