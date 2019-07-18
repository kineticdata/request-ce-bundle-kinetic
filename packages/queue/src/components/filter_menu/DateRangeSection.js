import React from 'react';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';
import { DateRangeSelector } from 'common/src/components/DateRangeSelector';
import { I18n } from '@kineticdata/react';
import { connect } from '../../redux/store';

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
    <I18n
      render={translate => (
        <select
          value={filter.dateRange.timeline}
          onChange={setDateRangeTimelineHandler}
        >
          <option value="createdAt">{translate('Created At')}</option>
          <option value="updatedAt">{translate('Updated At')}</option>
          <option value="completedAt">{translate('Completed At')}</option>
        </select>
      )}
    />
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
