import React from 'react';
import { List } from 'immutable';
import classNames from 'classnames';
import { I18n } from '@kineticdata/react';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const CheckboxField = props => (
  <FieldWrapper {...props} omitLabel>
    <div className="form-check">
      <input
        className={classNames('form-check-input', {
          'is-invalid': hasErrors(props),
        })}
        type="checkbox"
        id={props.id}
        name={props.name}
        checked={props.value}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onFocus={props.onFocus}
      />
      <label
        className={classNames('form-check-label', {
          'form-helper-popover': !!props.helpText,
        })}
        htmlFor={props.id}
        id={`${props.name}-helpTarget`}
      >
        <I18n>{props.label}</I18n>
        {props.required && <abbr title="required">*</abbr>}
      </label>
    </div>
  </FieldWrapper>
);

CheckboxField.defaultProps = {
  errors: List(),
};
