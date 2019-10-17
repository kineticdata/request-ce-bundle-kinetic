import React from 'react';
import { StaticSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { FieldWrapper } from './FieldWrapper';
import { fromJS } from 'immutable';
import icons from '../../assets/fa-icons';
import { Map } from 'immutable';

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

const Input = props => <input {...props.inputProps} className="form-control" />;

const SelectionsContainer = ({ input, value }) => (
  <div className="kinetic-typeahead input-group">
    <div className="input-group-prepend">
      <div className="input-group-text">
        <span className={`fa fa-fw fa-lg ${value && value.get('value')}`} />
      </div>
    </div>
    {input}
  </div>
);

const Suggestion = ({ suggestion, active }) => (
  <div className={`suggestion ${active ? 'active' : ''}`}>
    <div className="large">
      <span className={`fa fa-fw fa-lg ${suggestion.get('value')}`} />{' '}
      {suggestion.get('label')}
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
  Status,
  SuggestionsContainer,
  Suggestion,
};

export const IconField = props => {
  return (
    <FieldWrapper {...props}>
      <StaticSelect
        components={components}
        textMode
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
