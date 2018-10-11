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

import { Cache } from './Cache';

export const IconMenuItem = props => {
  const disabledReason = props.disabledFn && props.disabledFn(props.option);
  return (
    <MenuItem
      option={props.option}
      position={props.position}
      disabled={!!disabledReason}
    >
      <div className="notification-menu-item">
        <div>
          <Highlighter search={props.text}>{props.option.label}</Highlighter>
          <div>
            {props.option.paginationOption ? (
              <small>Narrow your search or load more</small>
            ) : (
              <i className={`fa ${props.option.icon.id}`} />
            )}
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
        <IconMenuItem
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
  <Token key={index} onRemove={props.onRemove} className="notification">
    {option.label}
  </Token>
);

const filterByCallback = (option, props) => {
  return (
    (option.icon.categories || []).some(
      c => c.toLowerCase().indexOf(props.text.toLowerCase()) !== -1,
    ) ||
    (option.icon.filter || []).some(
      c => c.toLowerCase().indexOf(props.text.toLowerCase()) !== -1,
    ) ||
    option.icon.name.toLowerCase().indexOf(props.text.toLowerCase()) !== -1
  );
};

const iconCache = new Cache(() =>
  import('./fa-icons').then(icons =>
    icons.map(icon => ({
      label: icon.name,
      icon: {
        ...icon,
        id: `fa-${icon.id}`,
      },
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

const getIconClass = (value, valueMapper, options) => {
  if (options) {
    const selectedOptions = options.filter(option =>
      anyMatch(value, valueMapper ? valueMapper(option) : option),
    );
    return selectedOptions.length > 0 ? selectedOptions[0].icon.id : undefined;
  } else {
    return undefined;
  }
};

const valueMapper = value => value.icon.id;

export class IconSelect extends React.Component {
  state = { options: null };

  static getDerivedStateFromProps(props) {
    return { renderMenu: renderMenu(props.disabledFn) };
  }

  componentDidMount() {
    iconCache.get().then(icons => {
      const options = [...icons].sort((a, b) => a.label.localeCompare(b.label));
      this.setState({ options });
    });
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
    const icon = getIconClass(
      this.props.value,
      valueMapper,
      this.state.options,
    );
    return (
      this.state.options && (
        <div className="form-group">
          <label>{this.props.label}</label>
          <small className="form-text text-muted">
            {this.props.description}
          </small>
          <div className="input-group">
            {icon && (
              <span className="input-group-addon input-group-prepend">
                <span className="input-group-text">
                  <i className={`fa ${icon}`} />
                </span>
              </span>
            )}
            <Typeahead
              filterBy={filterByCallback}
              className={this.props.className}
              multiple={this.props.multiple}
              options={this.state.options}
              renderMenu={this.state.renderMenu}
              renderToken={renderToken}
              selected={getSelected(
                this.props.value,
                valueMapper,
                this.state.options,
              )}
              onChange={this.handleChange}
              placeholder={this.props.placeholder || 'Select an Icon'}
            />
          </div>
        </div>
      )
    );
  }
}
