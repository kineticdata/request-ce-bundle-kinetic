import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';

export const AssignmentSection = ({
  filter,
  errors,
  toggleAssignmentHandler,
  appliedAssignments,
}) => (
  <ModalBody className="filter-section">
    <h5>
      Assignment<br />
      {errors.get('Assignment') && (
        <small className="text-danger text-small">
          {errors.get('Assignment')}
        </small>
      )}
    </h5>
    <label htmlFor="assignment-mine">
      <input
        type="checkbox"
        id="assignment-mine"
        value="mine"
        checked={filter.assignments.mine}
        onChange={toggleAssignmentHandler}
      />
      Mine
    </label>
    <label htmlFor="assignment-teammates">
      <input
        type="checkbox"
        id="assignment-teammates"
        value="teammates"
        checked={filter.assignments.teammates}
        onChange={toggleAssignmentHandler}
      />
      Teammates
    </label>
    <label htmlFor="assignment-unassigned">
      <input
        type="checkbox"
        id="assignment-unassigned"
        value="unassigned"
        checked={filter.assignments.unassigned}
        onChange={toggleAssignmentHandler}
      />
      Unassigned
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
