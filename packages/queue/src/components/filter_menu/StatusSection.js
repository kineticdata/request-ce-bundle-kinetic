import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';
import { I18n } from '@kineticdata/react';
import { context } from '../../redux/store';

const STATUSES = ['Open', 'Pending', 'Complete', 'Cancelled'];

export const StatusSection = ({ filter, toggleStatusHandler }) => (
  <ModalBody className="filter-section">
    <h5>
      <I18n>Status</I18n>
    </h5>
    {STATUSES.map(status => (
      <label htmlFor={`filter-status-${status}`} key={status}>
        <input
          type="checkbox"
          id={`filter-status-${status}`}
          value={status}
          checked={filter.status.includes(status)}
          onChange={toggleStatusHandler}
        />
        <I18n>{status}</I18n>
      </label>
    ))}
  </ModalBody>
);

export const StatusSectionContainer = compose(
  connect(
    null,
    {
      toggleStatus: actions.toggleStatus,
    },
    null,
    { context },
  ),
  withHandlers({
    toggleStatusHandler: props => event =>
      props.toggleStatus(event.target.value),
  }),
)(StatusSection);
