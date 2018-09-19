import React from 'react';
import {
  Highlighter,
  Menu,
  MenuItem,
  Token,
  Typeahead,
} from 'react-bootstrap-typeahead';
import isMatch from 'lodash.ismatch';
import { CoreAPI } from 'react-kinetic-core';
import { Cache } from './Cache';

const EMAIL_PATTERN = /^.+@.+\..+$/;

const UserMenuItem = props => (
  <MenuItem option={props.option} position={props.position}>
    <Highlighter search={props.text}>{props.option.label}</Highlighter>
    <div>
      <small>{props.option.user.username}</small>
    </div>
  </MenuItem>
);

const TeamMenuItem = props => (
  <MenuItem option={props.option} position={props.position}>
    <Highlighter search={props.text}>{props.option.label}</Highlighter>
    <div>
      <small>Team</small>
    </div>
  </MenuItem>
);

const EmailMenuItem = props => {
  const validEmail = props.text.match(EMAIL_PATTERN);
  return (
    <MenuItem
      option={props.option}
      position={props.position}
      disabled={!validEmail}
    >
      {validEmail
        ? `Invite new user by email address: ${props.text}`
        : `Enter a valid email address to invite a new user: ${props.text}`}
      Add a new email? {props.text}
    </MenuItem>
  );
};

const renderMenu = (results, props) => (
  <Menu {...props}>
    {results.map((option, i) => {
      const CurrentMenuItem = option.user
        ? UserMenuItem
        : option.team
          ? TeamMenuItem
          : EmailMenuItem;
      return (
        <CurrentMenuItem
          key={i}
          option={option}
          position={i}
          text={props.text}
        />
      );
    })}
  </Menu>
);

const renderToken = (option, props, index) => (
  <Token
    key={index}
    onRemove={props.onRemove}
    className={option.user ? 'user' : option.team ? 'team' : 'new'}
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

const anyMatch = (array, source) =>
  !!array.find(entry => isMatch(entry, source));

const getSelected = (value, valueMapper, options) =>
  options.filter(option => anyMatch(value, valueMapper(option)));

export class PeopleSelect extends React.Component {
  state = { options: null };

  componentDidMount() {
    Promise.all([
      this.props.users ? userCache.get() : Promise.resolve([]),
      this.props.teams ? teamCache.get() : Promise.resolve([]),
    ]).then(([users, teams]) => {
      const options = [...users, ...teams].sort((a, b) =>
        a.label.localeCompare(b.label),
      );
      this.setState({ options });
    });
  }

  handleChange = value => {
    this.props.onChange({
      target: { id: this.props.id, value: value.map(this.props.valueMapper) },
    });
  };

  render() {
    return (
      this.state.options && (
        <Typeahead
          multiple
          options={this.state.options}
          renderMenu={renderMenu}
          renderToken={renderToken}
          selected={getSelected(
            this.props.value,
            this.props.valueMapper,
            this.state.options,
          )}
          onChange={this.handleChange}
        />
      )
    );
  }
}
