import React from 'react';
import { I18n } from '@kineticdata/react';
import classNames from 'classnames';
import { hasErrors } from './utils';

export const FieldWrapper = props => {
  const { EmptyOptionsPlaceholder } = props.renderAttributes
    ? props.renderAttributes.toObject()
    : {};

  return props.visible ? (
    <div className="form-group">
      {!props.omitLabel && (
        <label
          htmlFor={props.id}
          id={`${props.name}-helpTarget`}
          className={classNames({ 'form-helper-popover': !!props.helpText })}
        >
          {props.label}
          {props.required && <abbr title="required">*</abbr>}
        </label>
      )}

      {!props.enabled && props.renderAttributes.get('disabledMessage') ? (
        <p className="no-data">
          {props.renderAttributes.get('disabledMessage')}
        </p>
      ) : props.options.isEmpty() && EmptyOptionsPlaceholder ? (
        <EmptyOptionsPlaceholder />
      ) : (
        props.children
      )}
      {props.helpText && (
        <small>
          <I18n>{props.helpText}</I18n>
        </small>
      )}
      {hasErrors(props) &&
        props.errors.map(error => (
          <span className="help-block text-danger" key={error}>
            {error}
          </span>
        ))}
    </div>
  ) : null;
};
