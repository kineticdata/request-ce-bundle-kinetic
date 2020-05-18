import React from 'react';
import { TeamSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { FieldWrapper } from './FieldWrapper';
import classNames from 'classnames';
import { getIn } from 'immutable';

const splitTeamName = team => {
  const [local, ...parents] = team
    .get('name')
    .split('::')
    .reverse();
  return [parents.reverse().join('::'), local];
};

const Input = props => (
  <input
    {...props.inputProps}
    className="form-control"
    placeholder={getIn(props, ['inputProps', 'selection', 'name'], '')}
  />
);

const SelectionsContainer = ({ selections, input, multiple }) => (
  <div className={classNames('kinetic-typeahead', { multi: multiple })}>
    {selections}
    {input}
  </div>
);

const Selection = ({ selection, remove }) => (
  <div className="input-group selection">
    <input
      className="form-control"
      type="text"
      disabled
      value={selection.get('name')}
    />
    <div className="input-group-append">
      <button className="btn btn-sm btn-clear" onClick={remove} type="button">
        <i className="fa fa-fw fa-times" />
      </button>
    </div>
  </div>
);

const SingleSelection = ({ selection, disabled, edit, focusRef, remove }) => (
  <div className="input-group selection">
    <input
      className="form-control"
      type="text"
      value={selection ? selection.get('name') : ''}
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
            <i className="fa fa-fw fa-times" />
          </button>
        </div>
      )}
  </div>
);

const SuggestionsContainer = ({ open, children, containerProps }) => (
  <div {...containerProps} className={classNames('suggestions', { open })}>
    {children}
  </div>
);

const Suggestion = ({ suggestion, active }) => {
  const [parent, local] = splitTeamName(suggestion);
  return (
    <div className={classNames('suggestion', { active })}>
      {parent && <div className="small">{parent}</div>}
      <div className="large">{local}</div>
    </div>
  );
};

const components = {
  Input,
  SelectionsContainer,
  Selection,
  Status,
  SuggestionsContainer,
  Suggestion,
};

const singleComponents = {
  ...components,
  Selection: SingleSelection,
};

export const TeamField = props => (
  <FieldWrapper {...props}>
    <TeamSelect
      components={singleComponents}
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
    />
  </FieldWrapper>
);

export const TeamMultiField = props => (
  <FieldWrapper {...props}>
    <TeamSelect
      components={components}
      multiple
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
    />
  </FieldWrapper>
);
