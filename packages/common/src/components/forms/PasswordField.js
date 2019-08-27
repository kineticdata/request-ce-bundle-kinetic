import React from 'react';
import { List } from 'immutable';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const PasswordField = props => (
  <FieldWrapper {...props}>
    <input
      className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
      type="password"
      id={props.id}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      onBlur={props.onBlur}
      onChange={props.onChange}
      onFocus={props.onFocus}
      disabled={!props.enabled}
    />
  </FieldWrapper>
);

PasswordField.defaultProps = {
  errors: List(),
};
