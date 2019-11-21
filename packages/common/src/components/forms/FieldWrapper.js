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
          <I18n>{props.label}</I18n>
          {props.required && <abbr title="required">*</abbr>}
        </label>
      )}

      {!props.enabled && props.renderAttributes.get('disabledMessage') ? (
        <p className="no-data">
          <I18n>{props.renderAttributes.get('disabledMessage')}</I18n>
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
              <I18n>{error}</I18n>
            </span>
          ))}
        </div>
      )}
    </div>
  ) : null;
};
