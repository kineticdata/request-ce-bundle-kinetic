import React from 'react';
import { List } from 'immutable';
import { I18n } from '@kineticdata/react';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const PasswordField = props => (
  <FieldWrapper {...props}>
    <I18n
      render={translate => (
        <input
          className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
          type="password"
          id={props.id}
          name={props.name}
          value={props.value}
          placeholder={translate(props.placeholder)}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          disabled={!props.enabled}
        />
      )}
    />
  </FieldWrapper>
);

PasswordField.defaultProps = {
  errors: List(),
};
