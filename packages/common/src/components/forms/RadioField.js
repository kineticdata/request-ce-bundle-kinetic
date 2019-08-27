import React from 'react';
import { FieldWrapper } from './FieldWrapper';
import classNames from 'classnames';

export const RadioField = props => (
  <FieldWrapper {...props} omitLabel>
    <legend
      className={classNames('col-form-label', {
        'form-helper-popover': !!props.helpText,
      })}
      id={`${props.name}-helpTarget`}
    >
      {props.label}
      {props.required && <abbr title="required">*</abbr>}
    </legend>
    {props.options.map(option => (
      <div className="form-check form-check-inline" key={option.get('value')}>
        <input
          className="form-check-input"
          id={`${props.name}-${option.get('value')}`}
          name={props.name}
          type="radio"
          value={option.get('value')}
          checked={props.value === option.get('value')}
          onChange={props.onChange}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
        />
        <label
          htmlFor={`${props.name}-${option.get('value')}`}
          className="form-check-label"
        >
          {option.get('label')}
        </label>
      </div>
    ))}
  </FieldWrapper>
);
