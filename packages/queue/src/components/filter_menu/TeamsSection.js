import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalBody } from 'reactstrap';
import { actions } from '../../redux/modules/filterMenu';
import { I18n } from '../../../../app/src/I18nProvider';

export const TeamsSection = ({ teams, filter, toggleTeamHandler }) => (
  <ModalBody className="filter-section">
    <h5>
      <I18n>Teams</I18n>
    </h5>
    {teams.map(team => (
      <label key={team.name} htmlFor={team.slug}>
        <input
          type="checkbox"
          id={team.slug}
          value={team.name}
          checked={filter.teams.includes(team.name)}
          onChange={toggleTeamHandler}
        />
        <I18n>{team.name}</I18n>
      </label>
    ))}
  </ModalBody>
);

export const TeamsSectionContainer = compose(
  connect(
    null,
    {
      toggleTeam: actions.toggleTeam,
    },
  ),
  withHandlers({
    toggleTeamHandler: props => event => props.toggleTeam(event.target.value),
  }),
)(TeamsSection);
