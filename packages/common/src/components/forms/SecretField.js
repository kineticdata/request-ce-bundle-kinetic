import React, { Fragment } from 'react';
import { hasErrors } from './utils';
import classNames from 'classnames';
import { PopoverBody, PopoverHeader, UncontrolledPopover } from 'reactstrap';

export const SecretField = props => (
  <Fragment>
    <label
      className={classNames({
        'form-helper-popover': !!props.helpText,
      })}
      id={`${props.name}-helpTarget`}
      htmlFor={props.id}
    >
      {props.label}
      {props.required && <abbr title="required">*</abbr>}
    </label>
    {props.helpText && (
      <UncontrolledPopover
        placement="top"
        trigger="legacy"
        target={`${props.name}-helpTarget`}
      >
        <PopoverHeader>{props.label}</PopoverHeader>
        <PopoverBody>{props.helpText}</PopoverBody>
      </UncontrolledPopover>
    )}
    {props.visible && (
      <input
        className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
        type="password"
        id={props.id}
        name={props.name}
        value={props.value}
        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
        onBlur={props.onBlur}
        onChange={props.onChange}
        onFocus={props.onFocus}
        disabled={!props.enabled}
      />
    )}
    {hasErrors(props) &&
      props.errors.map(error => (
        <span className="help-block text-danger" key={error}>
          {error}
        </span>
      ))}
  </Fragment>
);
