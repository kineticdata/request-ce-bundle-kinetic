import React, { Fragment } from 'react';
import { I18n, StaticSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';

const Input = props => <input {...props.inputProps} className="form-control" />;

const SelectionsContainer = ({ input, selections, value }) => (
  <div className="kinetic-typeahead input-group">
    {selections}
    {input}
  </div>
);

const Selection = ({ selection, disabled, edit, focusRef, remove }) => (
  <Fragment>
    <div
      className="selection single form-control-plaintext"
      onClick={edit}
      onKeyDown={edit}
      role="button"
      ref={focusRef}
      tabIndex={0}
    >
      {selection ? selection.get('label') : <em>None</em>}
      {selection &&
        !disabled && (
          <button
            className="btn btn-subtle btn-xs"
            onClick={remove}
            type="button"
          >
            <i className="fa fa-fw fa-times" />
          </button>
        )}
    </div>
    {selection && (
      <Link
        className="input-group-text"
        to={`/settings/notifications/templates/${selection.get('slug')}`}
        target="_blank"
      >
        <I18n>View Template</I18n>
      </Link>
    )}
  </Fragment>
);

const Suggestion = ({ suggestion, active }) => (
  <div className={`suggestion ${active ? 'active' : ''}`}>
    <div className="large">
      <I18n>{suggestion.get('label')}</I18n>
    </div>
  </div>
);

const SuggestionsContainer = ({ open, children, containerProps }) => (
  <div {...containerProps} className={`suggestions ${open ? 'open' : ''}`}>
    {children}
  </div>
);

const components = {
  Input,
  SelectionsContainer,
  Selection,
  Status,
  SuggestionsContainer,
  Suggestion,
};

export const NotificationField = props => {
  const {
    typeahead,
    allowNew,
    minSearchLength,
  } = props.renderAttributes.toJS();

  return (
    <FieldWrapper {...props}>
      {typeahead ? (
        <StaticSelect
          components={components}
          id={props.id}
          value={props.options.find(
            option =>
              option.get('value') === props.value ||
              option.get('label') === props.value,
          )}
          options={props.options}
          search={props.search}
          allowNew={allowNew}
          minSearchLength={minSearchLength}
          onChange={value =>
            props.onChange(Map.isMap(value) ? value.get('value') : value)
          }
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          placeholder={props.placeholder}
        />
      ) : (
        <I18n
          render={translate => (
            <select
              className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
              id={props.id}
              name={props.name}
              value={props.value}
              onBlur={props.onBlur}
              onChange={props.onChange}
              onFocus={props.onFocus}
            >
              <option value="">{translate(props.placeholder) || ''}</option>
              {props.options.map((option, i) => (
                <option value={option.get('value')} key={i}>
                  {option.get('label')
                    ? translate(option.get('label'))
                    : option.get('value')}
                </option>
              ))}
            </select>
          )}
        />
      )}
    </FieldWrapper>
  );
};
