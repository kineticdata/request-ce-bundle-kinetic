import React from 'react';
import { StaticSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { FieldWrapper } from './FieldWrapper';
import { fromJS } from 'immutable';
import icons from '../../assets/fa-icons';

const Input = props => (
  <div className="input-group">
    <div className="input-group-prepend">
      <div className="input-group-text">
        <span className={`fa fa-fw fa-lg ${props.inputProps.value}`} />
      </div>
    </div>
    <input {...props.inputProps} className="form-control" />
  </div>
);

const SelectionsContainer = ({ input }) => (
  <div className="kinetic-typeahead">{input}</div>
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
        value={props.value}
        options={fromJS(
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
        )}
        search={(icons, searchValue) =>
          icons.filter(icon =>
            icon.filter.some(filter =>
              filter.includes(searchValue.replace(/^fa-/, '').toLowerCase()),
            ),
          )
        }
        onChange={props.onChange}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
      />
    </FieldWrapper>
  );
};
