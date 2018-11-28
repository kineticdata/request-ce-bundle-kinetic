import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { parse } from 'query-string';
import md5 from 'md5';
import { fromJS } from 'immutable';
import { Utils, PageTitle } from 'common';
import { AddMemberModal } from './AddMemberModal';
import { buildHierarchy } from '../../../utils';
import { IconPicker } from '../../shared/IconPicker';
import { TeamCard } from '../../shared/TeamCard';
import { Avatar } from 'common';

import {
  actions as teamListActions,
  selectSubTeams,
} from '../../../redux/modules/teamList';
import {
  actions as teamActions,
  selectTeamMemberships,
} from '../../../redux/modules/team';

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
  handleRemoveMember,
  handleCancel,
  handleDelete,
  handleFieldChange,
  handleSubmit,
}) => (
  <div className="page-container page-container--panels page-container--space-team-form">
    <PageTitle
      parts={[editing ? team.name && `Edit: ${team.name}` : 'New', 'Teams']}
    />

    {!loading && (
      <Fragment>
        <div className="page-panel page-panel--two-thirds page-panel--scrollable">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">home</Link> / <Link to="/settings">settings</Link>{' '}
                / <Link to="/settings/teams">teams</Link> /
              </h3>
              <h1>{editing ? 'Edit' : 'New'} Team</h1>
            </div>
          </div>

          <section>
            <h2 className="section__title">General</h2>
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

              <div className="form__footer">
                <span className="form__footer__left">
                  {editing && (
                    <button
                      className="btn btn-link text-danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  )}
                </span>
                <span className="form__footer__right">
                  <button className="btn btn-link" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="btn btn-primary">
                    {editing ? 'Save Changes' : 'Create Team'}
                  </button>
                </span>
              </div>
            </form>
          </section>

          {editing && (
            <section className="team-members-wrapper">
              <AddMemberModal />
              <h3 className="section__title">
                Members
                <i
                  className={'fa fa-plus control'}
                  style={{ cursor: 'pointer' }}
                  onClick={handleAddMemberClick}
                />
              </h3>

              <div className="col-12">
                <table className="table table-striped table-sm table-responsive table--settings">
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th scope="col">Name</th>
                      <th scope="col">Username</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map(user => (
                      <tr key={user.username}>
                        <td scope="row">
                          <Avatar user={user} />
                        </td>
                        <td>
                          <Link to={`/profile/${user.username}`}>
                            {user.displayName}
                          </Link>
                        </td>
                        <td>{user.username}</td>
                        <td>
                          <button
                            onClick={handleRemoveMember(user.username)}
                            className="btn btn-danger btn-sm"
                          >
                            <span className="fa fa-remove" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {editing && (
            <section className="team-subteams-wrapper">
              <h3 className="section__title">
                Subteams
                <Link to={`/settings/teams/new?parent=${team.name}`}>
                  <i className={'fa fa-plus control'} />
                </Link>
              </h3>

              <div className="t-card-wrapper">
                {subteams.map(subteam => (
                  <TeamCard key={subteam.slug} team={subteam} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="page-panel page-panel--one-thirds page-panel--sidebar page-panel--card page-panel--team-edit-sidebar">
          <TeamCard
            team={Object.assign(translateFieldValuesToTeam(fieldValues, team), {
              memberships: team.memberships,
            })}
          />
        </div>
      </Fragment>
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
    loading:
      state.space.teamList.loading ||
      (props.match.params.slug !== undefined && state.space.team.loading),
    teams: state.space.teamList.data,
    team: state.space.team.data || {},
    memberships: selectTeamMemberships(state).map(member => member.user),
    subteams: selectSubTeams(state),
  };
};

export const TeamForm = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
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
    handleRemoveMember: props => username => event => {
      event.preventDefault();
      const team = props.team;
      const memberships = props.team.data.memberships.filter(
        user => user.username === username,
      );
      props.updateTeam(...team, memberships);
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
