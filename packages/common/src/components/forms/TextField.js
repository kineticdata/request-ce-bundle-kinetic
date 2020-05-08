import React, { Component } from 'react';
import { I18n } from '@kineticdata/react';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const TextField = props => (
  <FieldWrapper {...props}>
    <I18n
      render={translate => (
        <input
          className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
          type="text"
          id={props.id}
          name={props.name}
          value={props.value}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          placeholder={translate(props.placeholder)}
          disabled={!props.enabled}
        />
      )}
    />
  </FieldWrapper>
);

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
      <FieldWrapper {...this.props}>
        {this.props.value.push('').map((selection, i) => (
          <div key={i} className="input-group selection mb-1">
            <I18n
              render={translate => (
                <input
                  type="text"
                  className="form-control"
                  onBlur={this.props.onBlur}
                  onChange={selection ? this.onEdit(i) : this.onAdd}
                  onFocus={this.props.onFocus}
                  placeholder={translate(this.props.placeholder)}
                  value={selection}
                />
              )}
            />
            {selection && (
              <div className="input-group-append">
                <button
                  className="btn btn-sm btn-danger pull-right"
                  onClick={this.onRemove(i)}
                  onFocus={this.props.onFocus}
                  onBlur={this.props.onBlur}
                  type="button"
                >
                  <span className="sr-only">Remove</span>
                  <i className="fa fa-fw fa-times" />
                </button>
              </div>
            )}
          </div>
        ))}
      </FieldWrapper>
    );
  }
}
