import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { Popover, PopoverBody } from 'reactstrap';
import { DateRangeSelector } from 'common/src/components/DateRangeSelector';
import { actions } from '../../redux/modules/spaceApp';

const getDisplayValue = value =>
  typeof value === 'object'
    ? 'Custom Date Range'
    : value === ''
    ? 'None'
    : `Last ${value.replace('days', '')} Days`;

export const DateRangeDropdownComponent = props => (
  <Fragment>
    <button
      id="date-range-dropdown"
      className="btn btn-inverse"
      onClick={props.openDateRangeDropdown}
    >
      {getDisplayValue(props.searchDateRange)}&nbsp;
      <i className="fa fa-fw fa-caret-down" />
    </button>
    <Popover
      isOpen={props.dateRangeDropdownOpen}
      toggle={props.resetDateRangeDropdown}
      target="date-range-dropdown"
      placement="bottom-end"
    >
      <PopoverBody className="date-range-filter">
        <form onSubmit={props.handleDateRangeSubmit}>
          <DateRangeSelector
            value={props.dirtySearchDateRange}
            onChange={props.setSearchDateRange}
            validations={props.searchDateRangeValidations}
          />
          <div className="date-range-buttons">
            <button
              type="button"
              className="btn btn-link"
              onClick={props.resetDateRangeDropdown}
            >
              Reset
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={props.searchDateRangeValidations.length > 0}
            >
              Apply
            </button>
          </div>
        </form>
      </PopoverBody>
    </Popover>
  </Fragment>
);

export const DateRangeDropdown = compose(
  connect(
    state => ({
      dateRangeDropdownOpen: state.spaceApp.dateRangeDropdownOpen,
      searchDateRange: state.spaceApp.searchDateRange,
      dirtySearchDateRange: state.spaceApp.dirtySearchDateRange,
      searchDateRangeValidations: state.spaceApp.searchDateRangeValidations,
    }),
    {
      openDateRangeDropdown: actions.openDateRangeDropdown,
      resetDateRangeDropdown: actions.resetDateRangeDropdown,
      submitDateRangeDropdown: actions.submitDateRangeDropdown,
      setSearchDateRange: actions.setSearchDateRange,
    },
  ),
  withHandlers({
    handleDateRangeSubmit: props => event => {
      event.preventDefault();
      props.submitDateRangeDropdown();
    },
  }),
)(DateRangeDropdownComponent);
