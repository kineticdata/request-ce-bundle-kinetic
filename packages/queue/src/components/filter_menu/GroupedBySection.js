import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';

export const GroupedBySection = ({ filter, setGroupedByHandler }) => (
  <ModalBody className="filter-section">
    <h5>Grouped By</h5>
    <label htmlFor="grouped-by">
      <input
        type="text"
        id="grouped-by"
        value={filter.groupBy}
        name="grouped-by"
        onChange={setGroupedByHandler}
      />
      Grouped By
    </label>
  </ModalBody>
);

export const GroupedBySectionContainer = compose(
  connect(
    null,
    {
      setGroupedBy: actions.setGroupedBy,
    },
  ),
  withHandlers({
    setGroupedByHandler: props => event =>
      props.setGroupedBy(event.target.value),
  }),
)(GroupedBySection);
