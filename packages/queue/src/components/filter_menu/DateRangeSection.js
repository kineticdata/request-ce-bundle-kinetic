import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';
import { DateRangeSelector } from 'common/src/components/DateRangeSelector';
import { I18n } from '../../../../app/src/I18nProvider';

const convertDateRangeValue = dateRange =>
  !dateRange.custom
    ? dateRange.preset
    : { start: dateRange.start, end: dateRange.end };

export const DateRangeSection = ({
  filter,
  errors,
  setDateRangeTimelineHandler,
  setDateRange,
}) => (
  <ModalBody className="filter-section">
    <h5>
      <I18n>Date Range</I18n>
      <br />
      {errors.get('Date Range') && (
        <small className="text-danger text-small">
          <I18n>{errors.get('Date Range')}</I18n>
        </small>
      )}
    </h5>
    <select
      value={filter.dateRange.timeline}
      onChange={setDateRangeTimelineHandler}
    >
      <option value="createdAt">
        <I18n>Created At</I18n>
      </option>
      <option value="updatedAt">
        <I18n>Updated At</I18n>
      </option>
      <option value="completedAt">
        <I18n>Completed At</I18n>
      </option>
    </select>
    <DateRangeSelector
      allowNone
      value={convertDateRangeValue(filter.dateRange)}
      onChange={setDateRange}
    />
  </ModalBody>
);

export const DateRangeSectionContainer = compose(
  connect(
    null,
    {
      setDateRangeTimeline: actions.setDateRangeTimeline,
      setDateRange: actions.setDateRange,
    },
  ),
  withHandlers({
    setDateRangeTimelineHandler: props => event =>
      props.setDateRangeTimeline(event.target.value),
  }),
)(DateRangeSection);
