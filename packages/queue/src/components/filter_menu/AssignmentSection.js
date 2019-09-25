import React from 'react';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';
import { I18n } from '@kineticdata/react';
import { connect } from '../../redux/store';

export const AssignmentSection = ({
  filter,
  errors,
  toggleAssignmentHandler,
}) => (
  <ModalBody className="filter-section">
    <h5>
      <I18n>Assignment</I18n>
      <br />
      {errors.get('Assignment') && (
        <small className="text-danger text-small">
          <I18n>{errors.get('Assignment')}</I18n>
        </small>
      )}
    </h5>
    <label htmlFor="assignment-any">
      <input
        type="radio"
        id="assignment-any"
        name="filter-menu-assignment-radio"
        value=""
        checked={!filter.assignments}
        onChange={toggleAssignmentHandler}
      />
      <I18n>Any</I18n>
    </label>
    <label htmlFor="assignment-mine">
      <input
        type="radio"
        id="assignment-mine"
        name="filter-menu-assignment-radio"
        value="mine"
        checked={filter.assignments === 'mine'}
        onChange={toggleAssignmentHandler}
      />
      <I18n>Mine</I18n>
    </label>
    <label htmlFor="assignment-unassigned">
      <input
        type="radio"
        id="assignment-unassigned"
        name="filter-menu-assignment-radio"
        value="unassigned"
        checked={filter.assignments === 'unassigned'}
        onChange={toggleAssignmentHandler}
      />
      <I18n>Unassigned</I18n>
    </label>
  </ModalBody>
);

export const AssignmentSectionContainer = compose(
  connect(
    null,
    {
      toggleAssignment: actions.toggleAssignment,
    },
  ),
  withHandlers({
    toggleAssignmentHandler: props => event =>
      props.toggleAssignment(event.target.value),
  }),
)(AssignmentSection);
