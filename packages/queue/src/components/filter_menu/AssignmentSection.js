import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';
import { I18n } from '../../../../app/src/I18nProvider';
import { context } from '../../redux/store';

export const AssignmentSection = ({
  filter,
  errors,
  toggleAssignmentHandler,
  appliedAssignments,
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
    <label htmlFor="assignment-mine">
      <input
        type="checkbox"
        id="assignment-mine"
        value="mine"
        checked={filter.assignments.mine}
        onChange={toggleAssignmentHandler}
      />
      <I18n>Mine</I18n>
    </label>
    <label htmlFor="assignment-teammates">
      <input
        type="checkbox"
        id="assignment-teammates"
        value="teammates"
        checked={filter.assignments.teammates}
        onChange={toggleAssignmentHandler}
      />
      <I18n>Teammates</I18n>
    </label>
    <label htmlFor="assignment-unassigned">
      <input
        type="checkbox"
        id="assignment-unassigned"
        value="unassigned"
        checked={filter.assignments.unassigned}
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
    null,
    { context },
  ),
  withHandlers({
    toggleAssignmentHandler: props => event =>
      props.toggleAssignment(event.target.value),
  }),
)(AssignmentSection);
