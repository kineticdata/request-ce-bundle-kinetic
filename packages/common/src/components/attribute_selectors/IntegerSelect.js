import React from 'react';
import { I18n } from '../../../../app/src/I18nProvider';

const getValue = value => value.first();

export class IntegerSelect extends React.Component {
  state = { options: null };

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
        <I18n
          render={translate => (
            <input
              className={this.props.className || 'form-control'}
              name={this.props.name}
              value={getValue(this.props.value)}
              type="number"
              onChange={this.handleChange}
              placeholder={translate(
                this.props.placeholder || 'Select a Number',
              )}
            />
          )}
        />
        <small className="form-text text-muted">
          <I18n>{this.props.description}</I18n>
        </small>
      </div>
    );
  }
}
