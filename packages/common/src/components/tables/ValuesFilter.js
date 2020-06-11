import React, { Component } from 'react';
import { I18n } from '@kineticdata/react';
import { Map } from 'immutable';

const availableFields = (options, value) =>
  options.filter(option => {
    // If it is empty, all options are available.
    if (value.isEmpty()) return true;

    // If it's the last value and it does not have a value yet we should
    // keep the option in the list so that it is in the dropdown.
    const isLast = value.last().get('field', '') === option.value;
    if (isLast && value.last().get('value', '') === '') {
      return true;
    }

    // Otherwise if it is used in a value elsewhere in the last we
    // should remove it from the list of available options.
    const isInList = value.find(v => v.get('field') === option.value);
    return !isInList;
  });

const defaultValue = () => Map({ value: '', field: '' });

const showNewEntry = (values, value) => {
  if (values.isEmpty()) return true;

  const v = value || values.last();
  return v.get('field', '') !== '' && v.get('value', '') !== '';
};

export class ValuesFilter extends Component {
  handleChangeField = index => e => {
    this.props.onChange(
      this.props.value.update(index, defaultValue(), v =>
        v.set('field', e.target.value),
      ),
    );
  };

  handleChangeValue = index => e => {
    this.props.onChange(
      this.props.value.update(index, defaultValue(), v =>
        v.set('value', e.target.value),
      ),
    );
  };

  handleRemove = index => _e => {
    this.props.onChange(this.props.value.delete(index));
  };

  render() {
    // Add an empty 'value' entry if the values list is empty or if both
    // `field` and `value` are have content.
    const values = showNewEntry(this.props.value)
      ? this.props.value.push(defaultValue())
      : this.props.value;

    return (
      <div>
        <div className="form-group">
          <label className="control-label">
            <I18n>{this.props.title}</I18n>
          </label>

          <table className="table table-sm">
            <thead>
              <tr>
                <th>
                  <I18n>Field</I18n>
                </th>
                <th>
                  <I18n>Value</I18n>
                </th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {values.map((v, idx) => (
                <tr key={idx}>
                  <td>
                    {v === values.last() ? (
                      <I18n
                        render={translate => (
                          <select
                            className="form-control form-control-sm"
                            value={v.get('field')}
                            onChange={this.handleChangeField(idx)}
                          >
                            <option value="">
                              {translate('Choose a Field')}
                            </option>
                            {availableFields(
                              this.props.options,
                              this.props.value,
                            ).map(o => (
                              <option key={o.value} value={o.value}>
                                {translate(o.label)}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    ) : (
                      <span className="form-select">
                        <I18n>{v.get('field', '')}</I18n>
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={v.get('value')}
                        onChange={this.handleChangeValue(idx)}
                      />
                      {(v.get('field') === '' && v.get('value') === '') ||
                        (showNewEntry(this.props.value, v) && (
                          <div className="input-group-append">
                            <button
                              className="btn btn-xs btn-danger pull-right"
                              type="button"
                              onClick={this.handleRemove(idx)}
                            >
                              <span className="sr-only">Remove</span>
                              <span className="fa fa-times fa-fw" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
