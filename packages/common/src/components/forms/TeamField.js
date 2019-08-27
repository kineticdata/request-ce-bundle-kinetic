import React from 'react';
import { TeamSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { FieldWrapper } from './FieldWrapper';
import classNames from 'classnames';

const splitTeamName = team => {
  const [local, ...parents] = team
    .get('name')
    .split('::')
    .reverse();
  return [parents.reverse().join('::'), local];
};

const Input = props => <input {...props.inputProps} className="form-control" />;

const Selection = ({ selection, edit, remove }) => {
  const [parent, local] = splitTeamName(selection);
  return (
    <tr className={`selection ${remove ? 'multi' : ''}`}>
      <td>
        {parent && <div className="small">{parent}</div>}
        <div className="large">{local}</div>
      </td>
      <td>
        {edit ? (
          <button
            className="btn btn-sm btn-subtle"
            onClick={edit}
            type="button"
          >
            <i className="fa fa-fw fa-pencil" />
          </button>
        ) : (
          <button
            className="btn btn-sm btn-danger"
            onClick={remove}
            type="button"
          >
            <i className="fa fa-fw fa-times" />
          </button>
        )}
      </td>
    </tr>
  );
};

const Suggestion = ({ suggestion, active }) => {
  const [parent, local] = splitTeamName(suggestion);
  return (
    <div className={`suggestion ${active ? 'active' : ''}`}>
      {parent && <div className="small">{parent}</div>}
      <div className="large">{local}</div>
    </div>
  );
};

export const TeamField = props => (
  <FieldWrapper {...props}>
    <TeamSelect
      components={{ Input, Selection, Status, Suggestion }}
      textMode
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
  <FieldWrapper {...props} omitLabel>
    <h5>
      <span
        className={classNames({
          'form-helper-popover': !!props.helpText,
        })}
        id={`${props.name}-helpTarget`}
      >
        {props.label}
      </span>
    </h5>
    <TeamSelect
      components={{ Input, Selection, Status, Suggestion }}
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
