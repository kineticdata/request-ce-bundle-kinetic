import React, { Component } from 'react';
import { FieldWrapper } from './FieldWrapper';
import classNames from 'classnames';

export class SelectMultiField extends Component {
  onEdit = index => event => {
    this.props.onChange(
      event.target.value
        ? this.props.value.set(index, event.target.value)
        : this.props.value.delete(index),
    );
  };

  onAdd = event => {
    this.props.onChange(this.props.value.push(event.target.value));
  };

  onRemove = index => () => {
    this.props.onChange(this.props.value.delete(index));
  };

  render() {
    return (
      <FieldWrapper {...this.props} omitLabel>
        <h5>
          <span
            className={classNames({
              'form-helper-popover': !!this.props.helpText,
            })}
            id={`${this.props.name}-helpTarget`}
          >
            {this.props.label}
          </span>
        </h5>
        <table className="table">
          <tbody>
            {this.props.value.map((selection, i) => (
              <tr key={i}>
                <td>
                  <select
                    className="form-control"
                    value={selection}
                    onBlur={this.props.onBlur}
                    onChange={this.onEdit(i)}
                    onFocus={this.props.onFocus}
                  >
                    <option />
                    {this.props.options
                      .filter(
                        option =>
                          !this.props.value.includes(option.get('value')) ||
                          option.get('value') === selection,
                      )
                      .map((option, i) => (
                        <option key={i} value={option.get('value')}>
                          {option.get('label')}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-xs btn-danger pull-right"
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    onClick={this.onRemove(i)}
                  >
                    <span className="fa fa-times fa-fw" />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="table-active">
              <td colSpan={2}>
                <select
                  className="form-control"
                  onBlur={this.props.onBlur}
                  onChange={this.onAdd}
                  onFocus={this.props.onFocus}
                  value=""
                >
                  <option value="">
                    {(!this.props.focused &&
                      !this.props.touched &&
                      this.props.placeholder) ||
                      ''}
                  </option>
                  {this.props.options
                    .filter(
                      option => !this.props.value.includes(option.get('value')),
                    )
                    .map((option, i) => (
                      <option key={i} value={option.get('value')}>
                        {option.get('label')}
                      </option>
                    ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </FieldWrapper>
    );
  }
}
