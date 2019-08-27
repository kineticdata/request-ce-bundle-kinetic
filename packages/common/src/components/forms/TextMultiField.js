import React, { Component } from 'react';
import { FieldWrapper } from './FieldWrapper';
import classNames from 'classnames';

export class TextMultiField extends Component {
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

  // When rendering the inputs we append an empty string to the list of values,
  // this is helpful because then the "new" input is in the keyed collection so
  // when text is entered there we get a smooth addition of another new input.
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
            {this.props.value.push('').map((selection, i) => (
              <tr key={i} className={selection ? '' : 'table-active'}>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    onBlur={this.props.onBlur}
                    onChange={selection ? this.onEdit(i) : this.onAdd}
                    onFocus={this.props.onFocus}
                    placeholder={this.props.placeholder}
                    value={selection}
                  />
                </td>
                <td>
                  {selection && (
                    <button
                      type="button"
                      className="btn btn-xs btn-danger pull-right"
                      onFocus={this.props.onFocus}
                      onBlur={this.props.onBlur}
                      onClick={this.onRemove(i)}
                    >
                      <span className="fa fa-times fa-fw" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FieldWrapper>
    );
  }
}
