import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { parse } from 'query-string';
import md5 from 'md5';
import { fromJS } from 'immutable';
import { Utils, Avatar } from 'common';

import { AddMemberModal } from './AddMemberModal';
import { buildHierarchy } from '../../utils';
import { IconPicker } from '../shared/IconPicker';
import { TeamCard } from '../shared/TeamCard';
import { PageTitle } from '../shared/PageTitle';

import {
  actions as teamListActions,
  selectSubTeams,
} from '../../redux/modules/teamList';
import {
  actions as teamActions,
  selectTeamMemberships,
} from '../../redux/modules/team';
import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

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
  <div className="page-container page-container--panels">
    <PageTitle
      parts={[editing ? team.name && `Edit: ${team.name}` : 'New', 'Teams']}
    />

    {!loading && (
      <Fragment>
        <div className="page-panel page-panel--two-thirds page-panel--white">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/settings">
                  <I18n>settings</I18n>
                </Link>{' '}
                /{' '}
                <Link to="/settings/teams">
                  <I18n>teams</I18n>
                </Link>{' '}
                /
              </h3>
              <h1>
                <I18n>{editing ? 'Edit' : 'New'} Team</I18n>
              </h1>
            </div>
          </div>

          <section>
            <h2 className="section__title">
              <I18n>General</I18n>
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group required">
                <label htmlFor="name">
                  <I18n>Display Name</I18n>
                </label>
                <input
                  id="name"
                  name="name"
                  onChange={handleFieldChange}
                  value={fieldValues.name}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  <I18n>Description</I18n>
                </label>
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
                <label htmlFor="parent">
                  <I18n>Parent Team</I18n>
                </label>
                <I18n
                  render={translate => (
                    <select
                      id="parent"
                      onChange={handleFieldChange}
                      name="parentName"
                      value={fieldValues.parentName}
                    >
                      <option key={''} value={''} />
                      {teams.map(team => (
                        <option key={team.slug} value={team.name}>
                          {translate(team.name)}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              <div className="form-group">
                <label htmlFor="assignable">
                  <I18n>Assignable</I18n>
                </label>
                <I18n
                  render={translate => (
                    <select
                      id="assignable"
                      onChange={handleFieldChange}
                      name="assignable"
                      value={fieldValues.assignable}
                    >
                      <option key={'true'} value={'True'}>
                        {translate('True')}
                      </option>
                      <option key={'false'} value={'False'}>
                        {translate('False')}
                      </option>
                    </select>
                  )}
                />
              </div>

              <div className="form-group">
                <label htmlFor="icon">
                  <I18n>Icon</I18n>
                </label>
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
                      <I18n>Delete</I18n>
                    </button>
                  )}
                </span>
                <span className="form__footer__right">
                  <button className="btn btn-link" onClick={handleCancel}>
                    <I18n>Cancel</I18n>
                  </button>
                  <button className="btn btn-primary">
                    {editing ? (
                      <I18n>Save Changes</I18n>
                    ) : (
                      <I18n>Create Team</I18n>
                    )}
                  </button>
                </span>
              </div>
            </form>
          </section>

          {editing && (
            <section className="team-members-wrapper">
              <AddMemberModal />
              <h3 className="section__title">
                <I18n>Members</I18n>
                <i
                  className={'fa fa-plus control'}
                  style={{ cursor: 'pointer' }}
                  onClick={handleAddMemberClick}
                  aria-label="Add Team member"
                />
              </h3>

              <div className="col-12">
                <table className="table table-striped table-sm table-responsive table--settings">
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th scope="col">
                        <I18n>Name</I18n>
                      </th>
                      <th scope="col">
                        <I18n>Username</I18n>
                      </th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map(user => (
                      <tr key={user.username}>
                        <td>
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
                            <span className="sr-only">Remove Member</span>
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
                <I18n>Subteams</I18n>
                <Link to={`/settings/teams/new?parent=${team.name}`}>
                  <i className={'fa fa-plus control'} />
                  <span className="sr-only">Add a Subteam</span>
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

        <div className="page-panel page-panel--one-thirds page-panel--sidebar">
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
    editing: props.slug !== undefined,
    loading:
      state.teamList.loading ||
      (props.slug !== undefined && state.team.loading),
    teams: state.teamList.data,
    team: state.team.data || {},
    memberships: selectTeamMemberships(state).map(member => member.user),
    subteams: selectSubTeams(state),
  };
};

export const TeamForm = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
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
        this.props.fetchTeam(this.props.slug);
      } else {
        const parentParameter = parse(this.props.location.search).parent;
        this.props.setFieldValues({
          ...this.props.fieldValues,
          parentName: parentParameter,
        });
      }
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.slug !== nextProps.slug) {
        this.props.fetchTeam(nextProps.slug);
      }
      if (this.props.editing && this.props.team !== nextProps.team) {
        this.props.setFieldValues(translateTeamToFieldValues(nextProps.team));
      }
    },
  }),
)(TeamFormComponent);
