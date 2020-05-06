import React from 'react';
import {
  Menu,
  Token,
  Typeahead,
  Highlighter,
  MenuItem,
} from 'react-bootstrap-typeahead';
import { Set } from 'immutable';
import { I18n } from '@kineticdata/react';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

export const FieldMenuItem = props => {
  return (
    <MenuItem option={props.option} position={props.position}>
      <div className="kapp-menu-item">
        <div>
          <Highlighter search={props.text}>{props.option.label}</Highlighter>
          <div>
            <small>{props.option.type}</small>
          </div>
        </div>
      </div>
    </MenuItem>
  );
};

const renderMenu = (results, props) => {
  return (
    <Menu {...props}>
      {results.map((option, i) => {
        return (
          <FieldMenuItem
            key={i}
            option={option}
            position={i}
            text={props.text}
          />
        );
      })}
    </Menu>
  );
};

const renderToken = (option, props, index) => (
  <Token key={index} onRemove={props.onRemove} className="field">
    {option.label}
  </Token>
);

const valueMapper = option => option.value;

const getSelected = (value, options) =>
  options.filter(option => valueMapper(option) === value);

export class FieldSelect extends React.Component {
  state = { options: null };

  componentDidMount() {
    if (this.props.forms) {
      const fieldLists = this.props.forms.map(form => {
        return (form.fields || [])
          .filter(field => field.dataType === 'string')
          .map(field => field.name);
      });
      this.setState({
        options: Set(fieldLists.flat())
          .sort()
          .map(field => ({
            label: field,
            value: field,
            type: 'Field',
          }))
          .union([
            {
              label: 'Closed At',
              value: 'closedAt',
              type: 'System Property',
            },
            {
              label: 'Closed By',
              value: 'closedBy',
              type: 'System Property',
            },
            {
              label: 'Core State',
              value: 'coreState',
              type: 'System Property',
            },
            {
              label: 'Created At',
              value: 'createdAt',
              type: 'System Property',
            },
            {
              label: 'Created By',
              value: 'createdBy',
              type: 'System Property',
            },
            {
              label: 'Submitted At',
              value: 'submittedAt',
              type: 'System Property',
            },
            {
              label: 'Submitted By',
              value: 'submittedBy',
              type: 'System Property',
            },
            {
              label: 'Type',
              value: 'type',
              type: 'System Property',
            },
            {
              label: 'Updated At',
              value: 'updatedAt',
              type: 'System Property',
            },
            {
              label: 'Updated By',
              value: 'updatedBy',
              type: 'System Property',
            },
          ])
          .toJS(),
      });
    }
  }

  handleChange = value => {
    this.props.onChange({
      target: {
        value: value.map(valueMapper)[0],
      },
    });
  };

  render() {
    return (
      this.state.options && (
        <div className="form-group">
          {this.props.label && (
            <label>
              <I18n>{this.props.label}</I18n>
            </label>
          )}
          <I18n
            render={translate => (
              <Typeahead
                id="field-select-typeahead"
                className={this.props.className}
                options={this.state.options}
                renderMenu={renderMenu}
                renderToken={renderToken}
                selected={getSelected(this.props.value, this.state.options)}
                onChange={this.handleChange}
                placeholder={translate(
                  this.props.placeholder || 'Select a Field',
                )}
              />
            )}
          />
          <small className="form-text text-muted">
            <I18n>{this.props.description}</I18n>
          </small>
        </div>
      )
    );
  }
}
