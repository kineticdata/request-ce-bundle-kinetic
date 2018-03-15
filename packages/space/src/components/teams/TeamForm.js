import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { parse } from 'query-string';
import md5 from 'md5';
import { fromJS } from 'immutable';
import { Utils } from 'common';

import { AddMemberModal } from './AddMemberModal';
import { buildHierarchy } from '../helpers/utils';
import { IconPicker } from '../helpers/IconPicker';
import { PageTitle } from '../shared/PageTitle';
import { ProfileCard } from '../shared/ProfileCard';
import { TeamCard } from '../shared/TeamCard';
import { Hoverable } from '../shared/Hoverable';
import { TeamMemberAvatar } from './TeamMemberAvatar';

import {
  actions as teamListActions,
  selectSubTeams,
} from '../../redux/modules/teamList';
import {
  actions as teamActions,
  selectTeamMemberships,
} from '../../redux/modules/team';

const TeamFormComponent = ({
  editing,
  loading,
  teams,
  memberships,
  team,
  subteams,
  fieldValues,
  handleAddMemberClick,
  handleAddSubteamClick,
  handleCancel,
  handleDelete,
  handleFieldChange,
  handleSubmit,
}) => (
  <div className="team-form-container">
    <PageTitle
      parts={[editing ? team.name && `Edit: ${team.name}` : 'New', 'Teams']}
    />

    {!loading && (
      <div className="fragment">
        <div className="team-form-content pane">
          <div className="page-title-wrapper">
            <div className="page-title">
              <h3>
                <Link to="/">home</Link> / <Link to="/teams">teams</Link> /
              </h3>
              <h1>{editing ? 'Edit' : 'New'} Team</h1>
            </div>
          </div>
          <h3 className="section-title">General</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group required">
              <label htmlFor="name">Display Name</label>
              <input
                id="name"
                name="name"
                onChange={handleFieldChange}
                value={fieldValues.name}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-control"
                onChange={handleFieldChange}
                value={fieldValues.description}
                rows="3"
                name="description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="parent">Parent Team</label>
              <select
                id="parent"
                onChange={handleFieldChange}
                name="parentName"
                value={fieldValues.parentName}
              >
                <option key={''} value={''} />
                {teams.map(team => (
                  <option key={team.slug} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assignable">Assignable</label>
              <select
                id="assignable"
                onChange={handleFieldChange}
                name="assignable"
                value={fieldValues.assignable}
              >
                <option key={'true'} value={'True'}>
                  True
                </option>
                <option key={'false'} value={'False'}>
                  False
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="icon">Icon</label>
              <IconPicker
                id="icon"
                controls={{
                  onChange: handleFieldChange,
                  name: 'icon',
                  value: fieldValues.icon,
                }}
              />
            </div>

            <div className="form-button-wrapper">
              <span className="left-side">
                {editing && (
                  <button
                    className="btn btn-link danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                )}
              </span>
              <span className="right-side">
                <button className="btn btn-default">Save</button>
                <button className="btn btn-link" onClick={handleCancel}>
                  Cancel
                </button>
              </span>
            </div>
          </form>

          {editing && (
            <div className="team-members-wrapper">
              <AddMemberModal />
              <h3 className="section-title">
                Members
                <i
                  className={'fa fa-plus control'}
                  style={{ cursor: 'pointer' }}
                  onClick={handleAddMemberClick}
                />
              </h3>

              <div className="t-card-wrapper">
                {memberships.map(user => (
                  <Hoverable
                    key={user.username}
                    render={() => (
                      <ProfileCard
                        user={user}
                        button={
                          <button className="btn btn-primary">
                            Remove Member
                          </button>
                        }
                      />
                    )}
                  >
                    <TeamMemberAvatar user={user} />
                  </Hoverable>
                ))}
              </div>
            </div>
          )}

          {editing && (
            <div className="team-subteams-wrapper">
              <h3 className="section-title">
                Subteams
                <Link to={`/teams/new?parent=${team.name}`}>
                  <i className={'fa fa-plus control'} />
                </Link>
              </h3>

              <div className="t-card-wrapper">
                {subteams.map(subteam => (
                  <TeamCard key={subteam.slug} team={subteam} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="team-form-sidebar pane">
          <TeamCard
            team={Object.assign(translateFieldValuesToTeam(fieldValues, team), {
              memberships: team.memberships,
            })}
          />
        </div>
      </div>
    )}
  </div>
);

const translateTeamToFieldValues = team => {
  const heirarchy = buildHierarchy(team.name || '');

  return {
    parentName: (heirarchy.parent && heirarchy.parent.name) || '',
    name: heirarchy.localName || '',
    slug: team.name ? md5(team.name) : null,
    description: team.description || '',
    assignable: Utils.getAttributeValue(team, 'Assignable', 'True'),
    icon: Utils.getAttributeValue(team, 'Icon', 'fa-users'),
  };
};

const translateFieldValuesToTeam = (fieldValues, team) => {
  const attributes =
    team && team.attributes ? fromJS(team.attributes).toJS() : {};
  attributes.Assignable = [fieldValues.assignable];
  attributes.Icon = [fieldValues.icon];
  return {
    name: fieldValues.parentName
      ? `${fieldValues.parentName}::${fieldValues.name}`
      : fieldValues.name,
    slug: fieldValues.slug,
    description: fieldValues.description,
    attributes: attributes,
  };
};

const mapDispatchToProps = {
  cancelSaveTeam: teamActions.cancelSaveTeam,
  createTeam: teamActions.createTeam,
  deleteTeam: teamActions.deleteTeam,
  fetchTeam: teamActions.fetchTeam,
  fetchTeams: teamListActions.fetchTeams,
  updateTeam: teamActions.updateTeam,
  resetTeam: teamActions.resetTeam,
  setAddMemberModalOpen: teamActions.setAddMemberModalOpen,
};

const mapStateToProps = (state, props) => {
  return {
    editing: props.match.params.slug !== undefined,
    loading: state.teamList.loading || state.team.loading,
    teams: state.teamList.data,
    team: state.team.data || {},
    memberships: selectTeamMemberships(state).map(member => member.user),
    subteams: selectSubTeams(state),
  };
};

export const TeamForm = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('fieldValues', 'setFieldValues', translateTeamToFieldValues({})),
  withHandlers({
    handleAddMemberClick: props => event => {
      props.setAddMemberModalOpen(true);
    },
    handleCancel: props => event => {
      event.preventDefault();
      props.cancelSaveTeam(props.editing && props.team);
    },
    handleDelete: props => event => {
      event.preventDefault();
      const message =
        props.subteams && props.subteams.size > 0
          ? `Delete the ${props.team.name} team and ${props.subteams.size} ${
              props.subteams.size === 1 ? 'subteam?' : 'subteams?'
            }`
          : `Delete the ${props.team.name} team?`;
      if (window.confirm(message)) {
        props.deleteTeam(props.team);
      }
    },
    handleFieldChange: props => ({ target: { name, value } }) => {
      props.setFieldValues({ ...props.fieldValues, [name]: value });
    },
    handleSubmit: props => event => {
      event.preventDefault();
      const team = translateFieldValuesToTeam(props.fieldValues, props.team);
      if (props.editing) {
        props.updateTeam(team);
      } else {
        props.createTeam(team);
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      if (this.props.editing) {
        this.props.fetchTeam(this.props.match.params.slug);
      } else {
        const parentParameter = parse(this.props.location.search).parent;
        this.props.setFieldValues({
          ...this.props.fieldValues,
          parentName: parentParameter,
        });
      }
      this.props.fetchTeams();
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.slug !== nextProps.match.params.slug) {
        this.props.fetchTeam(nextProps.match.params.slug);
      }
      if (this.props.editing && this.props.team !== nextProps.team) {
        this.props.setFieldValues(translateTeamToFieldValues(nextProps.team));
      }
    },
  }),
)(TeamFormComponent);
