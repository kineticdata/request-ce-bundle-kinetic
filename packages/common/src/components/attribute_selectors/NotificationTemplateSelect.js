import React from 'react';
import { Link } from 'react-router-dom';
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

import { Cache } from '../../cache';

export const TeamMenuItem = props => {
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
            <small>{props.option.submission.values['Subject']}</small>
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
  <Token key={index} onRemove={props.onRemove} className="notification">
    {option.label}
  </Token>
);

const notificationTemplateCache = new Cache(() => {
  const query = new CoreAPI.SubmissionSearch(true)
    .limit('999')
    .includes(['values'])
    .index('values[Type]')
    .eq(`values[Type]`, 'Template');
  return CoreAPI.searchSubmissions({
    search: query.build(),
    datastore: true,
    form: 'notification-data',
  }).then(response =>
    response.submissions.map(submission => ({
      label: submission.values['Name'],
      submission,
    })),
  );
});

const anyMatch = (array, source) => {
  return !!array.find(entry => entry === source);
};

const getSelected = (value, valueMapper, options) =>
  options.filter(option =>
    anyMatch(value, valueMapper ? valueMapper(option) : option),
  );

export class NotificationTemplateSelect extends React.Component {
  state = { options: null };

  static getDerivedStateFromProps(props) {
    return { renderMenu: renderMenu(props.disabledFn) };
  }

  componentDidMount() {
    notificationTemplateCache.get().then(submissions => {
      const options = [...submissions].sort((a, b) =>
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

  templateLocation = () => {
    if (this.props.value) {
      const selectedOptions = this.state.options.filter(option =>
        anyMatch(
          this.props.value,
          this.props.valueMapper ? this.props.valueMapper(option) : option,
        ),
      );
      return selectedOptions.length > 0
        ? `/settings/notifications/templates/${
            selectedOptions[0].submission.id
          }`
        : undefined;
    } else {
      return undefined;
    }
  };

  render() {
    return (
      this.state.options && (
        <div className="form-group">
          <label>{this.props.label}</label>
          <div className="input-group">
            {this.templateLocation() && (
              <span className="input-group-addon input-group-prepend">
                <Link className="input-group-text" to={this.templateLocation()}>
                  View Template
                </Link>
              </span>
            )}
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
          </div>
          <small className="form-text text-muted">
            {this.props.description}
          </small>
        </div>
      )
    );
  }
}
