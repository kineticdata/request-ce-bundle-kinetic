import React from 'react';

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
        <label>{this.props.label}</label>
        <small className="form-text text-muted">{this.props.description}</small>
        <input
          className={this.props.className || 'form-control'}
          name={this.props.name}
          value={getValue(this.props.value)}
          type="number"
          onChange={this.handleChange}
          placeholder={this.props.placeholder || 'Select a Number'}
        />
      </div>
    );
  }
}
