import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';

export const DateRangeSection = ({
  filter,
  errors,
  setDateRangeTimelineHandler,
  radioClickHandler,
  setDateRangeStartHandler,
  setDateRangeEndHandler,
}) => (
  <ModalBody className="filter-section">
    <h5>
      Date Range
      <br />
      {errors.get('Date Range') && (
        <small className="text-danger text-small">
          {errors.get('Date Range')}
        </small>
      )}
    </h5>
    <select
      value={filter.dateRange.timeline}
      onChange={setDateRangeTimelineHandler}
    >
      <option value="createdAt">Created At</option>
      <option value="updatedAt">Updated At</option>
      <option value="completedAt">Completed At</option>
    </select>
    <label htmlFor="date-range-none">
      <input
        type="radio"
        id="date-range-none"
        value=""
        name="date-range"
        checked={filter.dateRange.preset === '' && !filter.dateRange.custom}
        onChange={radioClickHandler}
      />
      None
    </label>
    {[7, 14, 30, 60, 90].map(numberOfDays => (
      <label key={numberOfDays} htmlFor={`date-range-${numberOfDays}days`}>
        <input
          type="radio"
          id={`date-range-${numberOfDays}days`}
          value={`${numberOfDays}days`}
          name="date-range"
          checked={filter.dateRange.preset === `${numberOfDays}days`}
          onChange={radioClickHandler}
        />
        Last {numberOfDays} Days
      </label>
    ))}
    <label htmlFor="date-range-custom">
      <input
        type="radio"
        id="date-range-custom"
        value="custom"
        name="date-range"
        checked={filter.dateRange.custom}
        onChange={radioClickHandler}
      />
      Custom
    </label>
    {filter.dateRange.custom && (
      <div>
        <label htmlFor="date-range-custom-start">Start Date*</label>
        <input
          type="date"
          id="date-range-custom-start"
          value={filter.dateRange.start}
          onChange={setDateRangeStartHandler}
        />
      </div>
    )}
    {filter.dateRange.custom && (
      <div>
        <label htmlFor="date-range-custom-end">End Date</label>
        <input
          type="date"
          id="date-range-custom-end"
          value={filter.dateRange.end}
          onChange={setDateRangeEndHandler}
        />
      </div>
    )}
  </ModalBody>
);

export const DateRangeSectionContainer = compose(
  connect(
    null,
    {
      setDateRangeTimeline: actions.setDateRangeTimeline,
      setDateRangePreset: actions.setDateRangePreset,
      toggleDateRangeCustom: actions.toggleDateRangeCustom,
      setDateRangeStart: actions.setDateRangeStart,
      setDateRangeEnd: actions.setDateRangeEnd,
    },
  ),
  withHandlers({
    setDateRangeTimelineHandler: props => event =>
      props.setDateRangeTimeline(event.target.value),
    radioClickHandler: props => event => {
      if (event.target.value === 'custom') {
        props.toggleDateRangeCustom();
      } else {
        props.setDateRangePreset(event.target.value);
      }
    },
    setDateRangeStartHandler: props => event =>
      props.setDateRangeStart(event.target.value),
    setDateRangeEndHandler: props => event =>
      props.setDateRangeEnd(event.target.value),
  }),
)(DateRangeSection);
