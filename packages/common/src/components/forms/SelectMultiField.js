import React, { Component, Fragment } from 'react';
import { I18n, StaticSelect } from '@kineticdata/react';
import { TypeaheadStatus as Status } from './TypeaheadStatus';
import { FieldWrapper } from './FieldWrapper';
import classNames from 'classnames';

const Input = props => <input {...props.inputProps} className="form-control" />;

const SelectionsContainer = ({ selections, input, multiple }) => (
  <div className={classNames('kinetic-typeahead', { multi: multiple })}>
    {selections}
    {input}
  </div>
);

const Selection = ({ selection, remove, ...other }) => {
  return selection ? (
    <div className="input-group selection">
      <input
        className="form-control"
        type="text"
        disabled
        value={selection.get('label')}
      />
      {remove && (
        <div className="input-group-append">
          <button
            className="btn btn-sm btn-danger pull-right"
            onClick={remove}
            type="button"
          >
            <i className="fa fa-fw fa-times" />
          </button>
        </div>
      )}
    </div>
  ) : null;
};

const Suggestion = ({ suggestion, active }) => (
  <div className={classNames('suggestion', { active })}>
    <div className="large">
      <I18n>{suggestion.get('label')}</I18n>
    </div>
  </div>
);

const SuggestionsContainer = ({ open, children, containerProps }) => (
  <div {...containerProps} className={classNames('suggestions', { open })}>
    {children}
  </div>
);

const components = {
  Input,
  SelectionsContainer,
  Selection,
  Status,
  SuggestionsContainer,
  Suggestion,
};

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
    const {
      typeahead,
      allowNew,
      minSearchLength,
    } = this.props.renderAttributes.toJS();

    return (
      <FieldWrapper {...this.props}>
        {typeahead ? (
          <StaticSelect
            components={components}
            multiple
            id={this.props.id}
            value={this.props.value.map(value =>
              this.props.options.find(
                option =>
                  option.get('value') === value ||
                  option.get('label') === value,
              ),
            )}
            options={this.props.options}
            search={this.props.search}
            allowNew={allowNew}
            minSearchLength={minSearchLength}
            onChange={value => {
              this.props.onChange(value.map(val => val.get('value')));
            }}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
            placeholder={this.props.placeholder}
          />
        ) : (
          <Fragment>
            {this.props.value.push('').map((selection, i) => (
              <div key={i} className="input-group selection mb-1">
                <I18n
                  render={translate => (
                    <select
                      className="form-control"
                      onBlur={this.props.onBlur}
                      onChange={selection ? this.onEdit(i) : this.onAdd}
                      onFocus={this.props.onFocus}
                      value={selection}
                    >
                      {!selection && (
                        <option value="">
                          {(!this.props.focused &&
                            !this.props.touched &&
                            translate(this.props.placeholder)) ||
                            ''}
                        </option>
                      )}
                      {this.props.options
                        .filter(
                          option =>
                            !this.props.value.includes(option.get('value')) ||
                            option.get('value') === selection,
                        )
                        .map((option, i) => (
                          <option key={i} value={option.get('value')}>
                            {translate(option.get('label'))}
                          </option>
                        ))}
                    </select>
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
                      <i className="fa fa-fw fa-times" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </Fragment>
        )}
      </FieldWrapper>
    );
  }
}
