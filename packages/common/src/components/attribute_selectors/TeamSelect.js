import React from 'react';
import {
  Menu,
  Token,
  Typeahead,
  Highlighter,
  MenuItem,
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
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

const renderMenu = memoize(disabledFn => (results, props) => (
  <Menu {...props}>
    {results.map((option, i) => {
      return (
        <TeamMenuItem
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
  <Token key={index} onRemove={props.onRemove} className="team">
    {option.label}
  </Token>
);

const teamCache = new Cache(() =>
  CoreAPI.fetchTeams({ include: 'attributesMap' }).then(response =>
    response.teams
      .filter(team => !team.name.startsWith('Role::'))
      .map(team => ({
        label: team.name,
        team,
      })),
  ),
);

const anyMatch = (array, source) => {
  return !!array.find(entry => entry === source);
};

const getSelected = (value, valueMapper, options) =>
  options.filter(option =>
    anyMatch(value, valueMapper ? valueMapper(option) : option),
  );

export class TeamSelect extends React.Component {
  state = { options: null };

  static getDerivedStateFromProps(props) {
    return { renderMenu: renderMenu(props.disabledFn) };
  }

  componentDidMount() {
    teamCache.get().then(teams => {
      const options = [...teams].sort((a, b) => a.label.localeCompare(b.label));
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
        <div className="form-group">
          <label>{this.props.label}</label>

          <Typeahead
            className={this.props.className}
            multiple={this.props.multiple}
            options={this.state.options}
            renderMenu={this.state.renderMenu}
            renderToken={renderToken}
            selected={getSelected(
              this.props.value,
              this.props.valueMapper,
              this.state.options,
            )}
            onChange={this.handleChange}
            placeholder={this.props.placeholder || 'Select a Team'}
          />
          <small className="form-text text-muted">
            {this.props.description}
          </small>
        </div>
      )
    );
  }
}
