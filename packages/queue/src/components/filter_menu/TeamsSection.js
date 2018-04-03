import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';

export const TeamsSection = ({ teams, filter, toggleTeamHandler }) => (
  <ModalBody className="filter-section">
    <h5>Teams</h5>
    {teams.map(team => (
      <label key={team.name} htmlFor={team.slug}>
        <input
          type="checkbox"
          id={team.slug}
          value={team.name}
          checked={filter.teams.includes(team.name)}
          onChange={toggleTeamHandler}
        />
        {team.name}
      </label>
    ))}
  </ModalBody>
);

export const TeamsSectionContainer = compose(
  connect(null, {
    toggleTeam: actions.toggleTeam,
  }),
  withHandlers({
    toggleTeamHandler: props => event => props.toggleTeam(event.target.value),
  }),
)(TeamsSection);
