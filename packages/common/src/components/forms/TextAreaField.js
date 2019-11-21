import React from 'react';
import { I18n } from '@kineticdata/react';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const TextAreaField = props => (
  <FieldWrapper {...props}>
    <I18n
      render={translate => (
        <textarea
          rows="5"
          className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
          id={props.id || props.name}
          name={props.name}
          cols={props.cols}
          value={props.value || ''}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          placeholder={translate(props.placeholder)}
        />
      )}
    />
  </FieldWrapper>
);
