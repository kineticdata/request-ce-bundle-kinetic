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

const renderMenu = memoize(disabledFn => (results, props) => (
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
  options
    .filter(option =>
      anyMatch(value, valueMapper ? valueMapper(option) : option),
    )
    .concat(value.filter(v => v.customOption));

export class DiscussionInviteSelect extends React.Component {
  state = { options: null };

  static getDerivedStateFromProps(props) {
    return { renderMenu: renderMenu(props.disabledFn) };
  }

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
      target: {
        id: this.props.id,
        value: this.props.valueMapper
          ? value.map(this.props.valueMapper)
          : value,
      },
    });
  };

  render() {
    return (
      this.state.options && (
        <Typeahead
          multiple
          allowNew={this.props.emails}
          options={this.state.options}
          renderMenu={this.state.renderMenu}
          renderToken={renderToken}
          selected={getSelected(
            this.props.value,
            this.props.valueMapper,
            this.state.options,
          )}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
        />
      )
    );
  }
}
