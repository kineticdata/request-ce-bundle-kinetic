import React from 'react';
import { I18n } from '@kineticdata/react';
import { hasErrors } from './utils';
import classNames from 'classnames';

export const FieldWrapper = props => {
  const { EmptyOptionsPlaceholder } = props.renderAttributes
    ? props.renderAttributes.toObject()
    : {};

  return props.visible ? (
    <div className={classNames('form-group', props.className)}>
      {!props.omitLabel && (
        <label htmlFor={props.id} id={props.name}>
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
      {hasErrors(props) && (
        <div>
          {props.errors.map(error => (
            <span className="help-block text-danger" key={error}>
              {error}
            </span>
          ))}
        </div>
      )}
    </div>
  ) : null;
};
