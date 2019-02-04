import React, { Fragment } from 'react';
import { I18n } from '../../../app/src/I18nProvider';

const handleRadioChange = props => event => {
  props.onChange(
    event.target.value === 'custom'
      ? { start: '', end: '' }
      : event.target.value,
  );
};

const handleDateChange = (props, type) => event => {
  props.onChange({ ...props.value, [type]: event.target.value });
};

const hasError = (props, field) =>
  props.validations && props.validations.find(v => v.field === field)
    ? 'has-error'
    : '';

export const DateRangeSelector = props => {
  const isCustom = typeof props.value === 'object';
  return (
    <Fragment>
      {props.allowNone && (
        <label className="date-range-radio" htmlFor="date-range-none">
          <input
            type="radio"
            id="date-range-none"
            value=""
            name="date-range"
            checked={props.value === ''}
            onChange={handleRadioChange(props)}
          />
          <I18n>None</I18n>
        </label>
      )}
      {[7, 14, 30, 60, 90].map(numberOfDays => (
        <label
          className="date-range-radio"
          key={numberOfDays}
          htmlFor={`date-range-${numberOfDays}days`}
        >
          <input
            type="radio"
            id={`date-range-${numberOfDays}days`}
            value={`${numberOfDays}days`}
            name="date-range"
            checked={props.value === `${numberOfDays}days`}
            onChange={handleRadioChange(props)}
          />
          <I18n>Last {numberOfDays} Days</I18n>
        </label>
      ))}
      <label className="date-range-radio" htmlFor="date-range-custom">
        <input
          type="radio"
          id="date-range-custom"
          value="custom"
          name="date-range"
          checked={isCustom}
          onChange={handleRadioChange(props)}
        />
        <I18n>Custom</I18n>
      </label>
      {isCustom && (
        <div
          className={`form-group date-range-date ${hasError(props, 'start')}`}
        >
          <label htmlFor="date-range-custom-start">
            <I18n>Start Date</I18n>*
          </label>
          <input
            className="form-control"
            type="date"
            id="date-range-custom-start"
            value={props.value.start}
            onChange={handleDateChange(props, 'start')}
          />
          {props.validations &&
            props.validations.filter(v => v.field === 'start').map((v, i) => (
              <p key={i} className="text-danger">
                <I18n>{v.error}</I18n>
              </p>
            ))}
        </div>
      )}
      {isCustom && (
        <div className={`form-group date-range-date ${hasError(props, 'end')}`}>
          <label htmlFor="date-range-custom-end">
            <I18n>End Date</I18n>
          </label>
          <input
            className="form-control"
            type="date"
            id="date-range-custom-end"
            value={props.value.end}
            onChange={handleDateChange(props, 'end')}
          />
          {props.validations &&
            props.validations.filter(v => v.field === 'end').map((v, i) => (
              <p key={i} className="text-danger">
                <I18n>{v.error}</I18n>
              </p>
            ))}
        </div>
      )}
    </Fragment>
  );
};
