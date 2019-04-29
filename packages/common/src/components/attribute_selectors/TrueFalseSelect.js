import React from 'react';
import { I18n } from '@kineticdata/react';

const getValue = value => {
  if (value.first()) {
    return ['yes', 'true'].includes(value.first().toLowerCase());
  } else {
    return false;
  }
};

export class TrueFalseSelect extends React.Component {
  handleChange = event => {
    const value = event.target.value;
    this.props.onChange({
      target: {
        id: this.props.id,
        value: [value],
      },
    });
  };

  render() {
    return (
      <div className="form-group">
        <label>
          <I18n>{this.props.label}</I18n>
        </label>
        <div className="form-check form-check-inline">
          <input
            className={this.props.className || 'form-check-input'}
            name={this.props.name}
            value={true}
            type="radio"
            checked={getValue(this.props.value)}
            onChange={this.handleChange}
          />
          <label
            style={{ 'margin-right': '15px' }}
            className="form-check-label"
          >
            <I18n>Yes</I18n>
          </label>

          <input
            className={this.props.className || 'form-check-input'}
            name={this.props.name}
            value={false}
            type="radio"
            checked={!getValue(this.props.value)}
            onChange={this.handleChange}
          />
          <label className="form-check-label">
            <I18n>No</I18n>
          </label>
        </div>
        <small className="form-text text-muted">
          <I18n>{this.props.description}</I18n>
        </small>
      </div>
    );
  }
}
