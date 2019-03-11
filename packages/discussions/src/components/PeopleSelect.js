import React, { Fragment } from 'react';
import {
  Highlighter,
  Menu,
  MenuItem,
  Token,
  Typeahead,
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import isMatch from 'lodash.ismatch';
import { fetchUsers, fetchTeams } from 'react-kinetic-lib';
import { Cache } from './Cache';

const EMAIL_PATTERN = /^.+@.+\..+$/;

const UserMenuItem = props => {
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

const TeamMenuItem = props => {
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

const EmailMenuItem = props => {
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

const renderMenu = disabledFn => (results, props) => (
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
  fetchUsers().then(response =>
    response.users.map(user => ({
      label: user.displayName || user.username,
      user,
    })),
  ),
);
const teamCache = new Cache(() =>
  fetchTeams({ include: 'memberships' }).then(response =>
    response.teams.map(team => ({
      label: team.name,
      team,
    })),
  ),
);

const justUsers = props => props.users && !props.teams && !props.emails;
const justTeams = props => props.teams && !props.users && !props.emails;
const anyMatch = (array, source) =>
  !!array.find(entry => isMatch(entry, source));

const getSelected = (value, optionMapper, options) =>
  options
    .filter(option => anyMatch(value, optionMapper(option)))
    .concat(value.filter(v => v.customOption));

export class PeopleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options: null };
    this.renderMenu = renderMenu(props.disabledFn);
    // If the menu is only showing one type of item (users or teams) then we
    // do not nest the values in objects like { label: '...', user: { ... } }.
    this.optionMapper = option =>
      justUsers(props)
        ? { username: option.user.username }
        : justTeams(props)
          ? { name: option.team.name }
          : option;
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
        value: value.map(this.optionMapper),
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
          renderMenu={this.renderMenu}
          renderToken={renderToken}
          selected={getSelected(
            this.props.value,
            this.optionMapper,
            this.state.options,
          )}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
        />
      )
    );
  }
}
