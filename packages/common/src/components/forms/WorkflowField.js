import React from 'react';
import { List } from 'immutable';
import { I18n } from '@kineticdata/react';
import classNames from 'classnames';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const WorkflowField = ({
  taskSourceName,
  kappSlug,
  formSlug,
}) => props => (
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
        <I18n>Submission {props.label}: Use Custom Workflow</I18n>
      </label>{' '}
      {taskSourceName &&
        (!props.value || !props.dirty ? (
          <a
            href={encodeURI(
              [
                '/app/#/space/workflow/trees/details/',
                taskSourceName,
                ' :: Submissions > ',
                kappSlug,
                ...(props.value && !props.dirty ? [' > ', formSlug] : []),
                ' :: ',
                props.label,
              ].join(''),
            )}
            target="_blank"
            className={classNames('btn btn-xs', {
              'btn-primary': props.value,
              'btn-subtle': !props.value,
            })}
          >
            <span className="fa fa-fw fa-external-link-square" />{' '}
            <I18n>
              {props.value ? 'View Custom Workflow' : 'View Default Workflow'}
            </I18n>
          </a>
        ) : (
          <button className="btn btn-xs btn-primary" disabled="disabled">
            <I18n>Save changes to view Custom Workflow</I18n>
          </button>
        ))}
    </div>
  </FieldWrapper>
);

WorkflowField.defaultProps = {
  errors: List(),
};
