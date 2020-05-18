import React from 'react';
import { I18n, StaticSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { FieldWrapper } from './FieldWrapper';
import { fromJS } from 'immutable';
import icons from '../../assets/fa-icons';
import { getIn, Map } from 'immutable';

const options = fromJS(
  icons.map(({ name, id, filter, aliases }) => ({
    label: name,
    value: `fa-${id}`,
    filter: [
      id,
      name.toLowerCase(),
      ...(filter || []).map(f => f.toLowerCase()),
      ...(aliases || []).map(a => a.toLowerCase()),
    ],
  })),
);

const Input = props => (
  <input
    {...props.inputProps}
    className="form-control"
    placeholder={getIn(props, ['inputProps', 'selection', 'label'], '')}
  />
);

const SelectionsContainer = ({ input, selections, value }) => (
  <div className="kinetic-typeahead input-group">
    <div className="input-group-prepend">
      <div className="input-group-text">
        <span className={`fa fa-fw fa-lg ${value && value.get('value')}`} />
      </div>
    </div>
    {selections}
    {input}
  </div>
);

const Suggestion = ({ suggestion, active }) => (
  <div className={`suggestion ${active ? 'active' : ''}`}>
    <div className="large">
      <span className={`fa fa-fw fa-lg ${suggestion.get('value')}`} />{' '}
      <I18n>{suggestion.get('label')}</I18n>
    </div>
  </div>
);

const Selection = ({ selection, disabled, edit, focusRef, remove }) => (
  <>
    <input
      className="form-control"
      type="text"
      value={selection ? selection.get('label') : ''}
      onChange={() => {}}
      onFocus={e => e.target.click()}
      onClick={edit}
      disabled={disabled}
    />
    {selection &&
      !disabled && (
        <div className="input-group-append">
          <button
            className="btn btn-sm btn-clear"
            onClick={remove}
            type="button"
          >
            <span className="sr-only">Remove</span>
            <i className="fa fa-fw fa-times" />
          </button>
        </div>
      )}
  </>
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

export const IconField = props => {
  return (
    <FieldWrapper {...props}>
      <StaticSelect
        components={components}
        id={props.id}
        value={options.find(
          option =>
            option.get('value') === props.value ||
            option.get('label') === props.value,
        )}
        options={options}
        search={(icons, searchValue) =>
          icons.filter(icon =>
            icon.filter.some(filter =>
              filter.includes(searchValue.replace(/^fa-/, '').toLowerCase()),
            ),
          )
        }
        onChange={value =>
          props.onChange(Map.isMap(value) ? value.get('value') : value)
        }
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
      />
    </FieldWrapper>
  );
};
