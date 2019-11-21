import React from 'react';
import { I18n, StaticSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';
import { Map } from 'immutable';

const Input = props => <input {...props.inputProps} className="form-control" />;

const SelectionsContainer = ({ input }) => (
  <div className="kinetic-typeahead">{input}</div>
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
  Status,
  SuggestionsContainer,
  Suggestion,
};

export const SelectField = props => {
  const {
    typeahead,
    allowNew,
    alwaysRenderSuggestions,
    minSearchLength,
  } = props.renderAttributes.toJS();

  return (
    <FieldWrapper {...props}>
      {typeahead ? (
        <StaticSelect
          components={components}
          textMode
          id={props.id}
          value={props.options.find(
            option =>
              option.get('value') === props.value ||
              option.get('label') === props.value,
          )}
          options={props.options}
          search={props.search}
          allowNew={allowNew}
          alwaysRenderSuggestions={alwaysRenderSuggestions}
          minSearchLength={minSearchLength}
          onChange={value =>
            props.onChange(Map.isMap(value) ? value.get('value') : value)
          }
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
