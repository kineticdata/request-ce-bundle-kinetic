import React from 'react';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const SelectField = props => (
  <FieldWrapper {...props}>
    <select
      className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
      id={props.id}
      name={props.name}
      value={props.value}
      onBlur={props.onBlur}
      onChange={props.onChange}
      onFocus={props.onFocus}
    >
      <option value="">
        {(!props.value &&
          !props.touched &&
          !props.focused &&
          props.placeholder) ||
          ''}
      </option>
      {props.options.map((option, i) => (
        <option value={option.get('value')} key={i}>
          {option.get('label') ? option.get('label') : option.get('value')}
        </option>
      ))}
    </select>
  </FieldWrapper>
);
