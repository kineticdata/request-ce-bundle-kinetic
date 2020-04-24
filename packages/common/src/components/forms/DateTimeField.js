import React from 'react';
import { I18n } from '@kineticdata/react';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const DateField = props => (
  <FieldWrapper {...props}>
    <I18n
      render={translate => (
        <input
          className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
          type="date"
          id={props.id}
          name={props.name}
          value={props.value}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          placeholder={translate(props.placeholder)}
          disabled={!props.enabled}
        />
      )}
    />
  </FieldWrapper>
);

export const DateTimeField = props => (
  <FieldWrapper {...props}>
    <I18n
      render={translate => (
        <input
          className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
          type="datetime-local"
          id={props.id}
          name={props.name}
          value={props.value}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          placeholder={translate(props.placeholder)}
          disabled={!props.enabled}
        />
      )}
    />
  </FieldWrapper>
);
