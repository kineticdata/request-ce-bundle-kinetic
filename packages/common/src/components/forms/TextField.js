import React from 'react';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const TextField = props => (
  <FieldWrapper {...props}>
    <input
      className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
      type="text"
      id={props.id}
      name={props.name}
      value={props.value}
      onBlur={props.onBlur}
      onChange={props.onChange}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
      disabled={!props.enabled}
    />
  </FieldWrapper>
);
