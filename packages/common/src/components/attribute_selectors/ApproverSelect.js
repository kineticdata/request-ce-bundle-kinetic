import React, { Fragment } from 'react';
import {
  Menu,
  Token,
  Typeahead,
  Highlighter,
  MenuItem,
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import isMatch from 'lodash.ismatch';
import memoize from 'memoize-one';
import { CoreAPI } from 'react-kinetic-core';

import { Cache } from './Cache';

export const TeamMenuItem = props => {
  const disabledReason = props.disabledFn && props.disabledFn(props.option);
  return (
    <MenuItem
      option={props.option}
      position={props.position}
      disabled={!!disabledReason}
    >
      <div className="team-menu-item">
        <div>
          <Highlighter search={props.text}>{props.option.label}</Highlighter>
          <div>
            <small>Team</small>
          </div>
        </div>
        {disabledReason && <small>{disabledReason}</small>}
      </div>
    </MenuItem>
  );
};

export const UserMenuItem = props => {
  const disabledReason = props.disabledFn && props.disabledFn(props.option);
  return (
    <MenuItem
      option={props.option}
      position={props.position}
      disabled={!!disabledReason}
    >
      <div className="user-menu-item">
        <div>
          <Highlighter search={props.text}>{props.option.label}</Highlighter>
          <div>
            <small>{props.option.user.username}</small>
          </div>
        </div>
        {disabledReason && <small>{disabledReason}</small>}
      </div>
    </MenuItem>
  );
};

const EMAIL_PATTERN = /^.+@.+\..+$/;

export const EmailMenuItem = props => {
  const disabledReason = props.disabledFn && props.disabledFn(props.option);
  const isValidEmail = props.text.match(EMAIL_PATTERN);
  return (
    <MenuItem
      option={props.option}
      position={props.position}
      disabled={!isValidEmail || !!disabledReason}
    >
      {disabledReason ? (
        `${disabledReason}: ${props.text}`
      ) : isValidEmail ? (
        <Fragment>
          <strong>Add email</strong>: {props.text}
        </Fragment>
      ) : (
        `Invalid email address: ${props.text}`
      )}
    </MenuItem>
  );
};

export const ManagerMenuItem = props => {
  return (
    <MenuItem option={props.option} position={props.position}>
      <div className="manager-menu-item">
        <div>
          <Highlighter search={props.text}>{props.option.label}</Highlighter>
          <div>
            <small>Manager</small>
          </div>
        </div>
      </div>
    </MenuItem>
  );
};

export const NoneMenuItem = props => {
  return (
    <MenuItem option={props.option} position={props.position}>
      <div className="none-menu-item">
        <div>
          <Highlighter search={props.text}>{props.option.label}</Highlighter>
          <div>
            <small>{props.option.label}</small>
          </div>
        </div>
      </div>
    </MenuItem>
  );
};

const renderMenu = memoize(disabledFn => (results, props) => (
  <Menu {...props}>
    {results.map((option, i) => {
      const CurrentMenuItem = option.user
        ? UserMenuItem
        : option.team
          ? TeamMenuItem
          : option.manager
            ? ManagerMenuItem
            : option.none
              ? NoneMenuItem
              : EmailMenuItem;
      return (
        <CurrentMenuItem
          key={i}
          option={option}
          position={i}
          text={props.text}
          disabledFn={disabledFn}
        />
      );
    })}
  </Menu>
));

const renderToken = (option, props, index) => (
  <Token
    key={index}
    onRemove={props.onRemove}
    className={
      option.user
        ? 'user'
        : option.team
          ? 'team'
          : option.manager
            ? 'manager'
            : option.none
              ? 'none'
              : 'new'
    }
  >
    {option.label}
  </Token>
);

const userCache = new Cache(() =>
  CoreAPI.fetchUsers().then(response =>
    response.users.map(user => ({
      label: user.displayName || user.username,
      user,
    })),
  ),
);
const teamCache = new Cache(() =>
  CoreAPI.fetchTeams().then(response =>
    response.teams.map(team => ({
      label: team.name,
      team,
    })),
  ),
);

const optionalSelections = () => [
  {
    label: 'None',
    none: {
      name: 'none',
      slug: 'none',
    },
  },
  {
    label: 'Users Manager',
    manager: {
      name: 'Manger',
      slug: 'manager',
    },
  },
];

const anyMatch = (array, source) => !!array.find(entry => entry === source);

const getSelected = (value, valueMapper, options) =>
  options.filter(option =>
    anyMatch(value, valueMapper ? valueMapper(option) : option),
  );

const valueMapper = value => {
  if (value.user) {
    return value.user.username;
  } else if (value.team) {
    return value.team.name;
  } else if (value.manager) {
    return value.manager.slug;
  } else {
    return 'none';
  }
};

export class ApproverSelect extends React.Component {
  state = { options: null };

  static getDerivedStateFromProps(props) {
    return { renderMenu: renderMenu(props.disabledFn) };
  }

  componentDidMount() {
    Promise.all([userCache.get(), teamCache.get(), optionalSelections()]).then(
      ([users, teams, optional]) => {
        const options = [...users, ...teams, ...optional].sort((a, b) => {
          if (a.manager && b.none) {
            return 1;
          } else if (a.none || a.manager) {
            return -1;
          } else if (b.none || b.manager) {
            return 1;
          } else {
            return a.label.localeCompare(b.label);
          }
        });
        this.setState({ options });
      },
    );
  }

  handleChange = value => {
    this.props.onChange({
      target: {
        id: this.props.id,
        value: value.map(valueMapper),
      },
    });
  };

  render() {
    return (
      this.state.options && (
        <div className="form-group">
          <label>{this.props.label}</label>

          <Typeahead
            options={this.state.options}
            renderMenu={this.state.renderMenu}
            renderToken={renderToken}
            selected={getSelected(
              this.props.value,
              valueMapper,
              this.state.options,
            )}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
          />
          <small className="form-text text-muted">
            {this.props.description}
          </small>
        </div>
      )
    );
  }
}
