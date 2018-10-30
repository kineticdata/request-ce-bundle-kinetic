import React, { Fragment } from 'react';

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
          None
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
          Last {numberOfDays} Days
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
        Custom
      </label>
      {isCustom && (
        <div
          className={`form-group date-range-date ${hasError(props, 'start')}`}
        >
          <label htmlFor="date-range-custom-start">Start Date*</label>
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
                {v.error}
              </p>
            ))}
        </div>
      )}
      {isCustom && (
        <div className={`form-group date-range-date ${hasError(props, 'end')}`}>
          <label htmlFor="date-range-custom-end">End Date</label>
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
                {v.error}
              </p>
            ))}
        </div>
      )}
    </Fragment>
  );
};
