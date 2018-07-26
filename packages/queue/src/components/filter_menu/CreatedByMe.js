import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions } from '../../redux/modules/filterMenu';

export const CreatedByMe = ({ filter, toggleCreatedByMeHandler }) => (
  <button
    type="button"
    className="btn btn-link icon-wrapper"
    onClick={toggleCreatedByMeHandler}
  >
    <span className="button-title">Created By Me</span>
    <span>
      <input
        type="checkbox"
        id={`filter-created-by-me`}
        value={filter.createdByMe}
        checked={filter.createdByMe}
        onChange={toggleCreatedByMeHandler}
      />
    </span>
  </button>
);

export const CreatedByMeContainer = compose(
  connect(
    null,
    {
      toggleCreatedByMe: actions.toggleCreatedByMe,
    },
  ),
  withHandlers({
    toggleCreatedByMeHandler: props => event =>
      props.toggleCreatedByMe(!props.filter.createdByMe),
  }),
)(CreatedByMe);
