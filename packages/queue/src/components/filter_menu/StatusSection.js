import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';

const STATUSES = ['Open', 'Pending', 'Complete', 'Cancelled'];

export const StatusSection = ({ filter, toggleStatusHandler }) => (
  <ModalBody className="filter-section">
    <h5>Status</h5>
    {STATUSES.map(status => (
      <label htmlFor={`filter-status-${status}`} key={status}>
        <input
          type="checkbox"
          id={`filter-status-${status}`}
          value={status}
          checked={filter.status.includes(status)}
          onChange={toggleStatusHandler}
        />
        {status}
      </label>
    ))}
  </ModalBody>
);

export const StatusSectionContainer = compose(
  connect(null, {
    toggleStatus: actions.toggleStatus,
  }),
  withHandlers({
    toggleStatusHandler: props => event =>
      props.toggleStatus(event.target.value),
  }),
)(StatusSection);
