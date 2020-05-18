import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Link } from 'react-router-dom';
import {
  openModalForm,
  Avatar,
  DiscussionsPanel,
  ErrorMessage,
  LoadingMessage,
  TeamCard,
  Utils,
  ViewDiscussionsModal,
} from 'common';
import { PageTitle } from './shared/PageTitle';
import { I18n } from '@kineticdata/react';

const CreationForm = ({ onChange, values, errors }) => (
  <div className="form-group">
    <label htmlFor="title">Title</label>
    <input
      id="title"
      name="title"
      type="text"
      value={values.title}
      onChange={onChange}
    />
    {errors.title && (
      <small className="form-text text-danger">{errors.title}</small>
    )}
  </div>
);

const TeamComponent = ({
  teams,
  error,
  team,
  parent,
  subteams,
  creationFields,
  openDiscussions,
  closeDiscussions,
  viewDiscussionsModal,
  isSmallLayout,
  me,
  userIsMember,
  openRequestToJoinForm,
  openRequestToLeaveForm,
}) => (
  <div className="page-container page-container--panels page-container--space-team">
    <PageTitle parts={[team && team.name, 'Teams']} />
    {error && <ErrorMessage />}
    {!error && !teams && <LoadingMessage />}
    {!error && teams && !team && <ErrorMessage title="Team not found" />}
    {team && (
      <Fragment>
        <div
          className={`page-panel page-panel--white page-panel--three-fifths`}
        >
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/teams">
                  <I18n>teams</I18n>
                </Link>{' '}
                /
              </h3>
              <h1>
                <I18n>Team Profile</I18n>
              </h1>
            </div>
            {me.spaceAdmin && (
              <Link
                to={`/settings/teams/${team.slug}`}
                className="btn btn-secondary"
              >
                <I18n>Edit Team</I18n>
              </Link>
            )}
          </div>
          {userIsMember && (
            <button
              onClick={openDiscussions}
              className="btn btn-inverse btn-discussion d-md-none d-lg-none d-xl-none"
            >
              <span className="fa fa-comments fa-fw icon" />
              <I18n>View Discussions</I18n>
            </button>
          )}
          <div className="card card--team">
            <div
              className="card--team__header"
              style={{ backgroundColor: Utils.getColor(team) }}
            >
              <span />
              <i
                className={`fa fa-${Utils.getIcon(team, 'users')} card-icon`}
              />
              <span />
            </div>
            <div className="card--team__body">
              <h1>
                <I18n>{team.name}</I18n>
              </h1>

              {team.description && (
                <pre>
                  <I18n>{team.description}</I18n>
                </pre>
              )}

              {userIsMember ? (
                <button
                  onClick={openRequestToLeaveForm}
                  className="btn btn-primary btn-sm"
                >
                  <I18n>Request to Leave</I18n>
                </button>
              ) : (
                <button
                  onClick={openRequestToJoinForm}
                  className="btn btn-primary btn-sm"
                >
                  <I18n>Request to Join</I18n>
                </button>
              )}

              {team.memberships.length === 0 && (
                <p>
                  <I18n>No members</I18n>
                </p>
              )}
            </div>
            {team.memberships.length > 0 && (
              <div className="card--team__footer">
                <h1>
                  <I18n>Members</I18n>
                </h1>
                <div className="card--team__footer__members">
                  {team.memberships.map(m => (
                    <Avatar user={m.user} key={m.user.username} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {parent && (
            <section className="mt-5">
              <h3 className="section__title">
                <I18n>Parent Team</I18n>
              </h3>
              <div className="parent">
                <TeamCard
                  key={parent.slug}
                  team={parent}
                  components={{ Link }}
                />
              </div>
            </section>
          )}
          {subteams.size > 0 && (
            <section className="mt-5">
              <h3 className="section__title">
                <I18n>Subteams</I18n>
              </h3>
              <div className="subteams">
                {subteams.map(subteam => (
                  <TeamCard
                    key={subteam.slug}
                    team={subteam}
                    components={{ Link }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
        <Fragment>
          {viewDiscussionsModal &&
            isSmallLayout && (
              <ViewDiscussionsModal
                close={closeDiscussions}
                itemType="Team"
                itemKey={team.slug}
                creationFields={creationFields}
                CreationForm={CreationForm}
                me={me}
              />
            )}
          <DiscussionsPanel
            itemType="Team"
            itemKey={team.slug}
            creationFields={creationFields}
            CreationForm={CreationForm}
            me={me}
          />
        </Fragment>
      </Fragment>
    )}
  </div>
);

const mapStateToProps = (state, props) => {
  const teams = state.teams.data;
  const team = state.teams.data
    ? state.teams.data.find(t => t.slug === props.match.params.teamSlug)
    : null;
  const heirarchy = Utils.buildTeamHierarchy((team && team.name) || '');
  const teamsMap = teams
    ? teams.reduce((memo, item) => {
        memo[item.name] = item;
        return memo;
      }, {})
    : {};
  return {
    error: state.teams.error,
    teams,
    team,
    space: state.app.space,
    me: state.app.profile,
    adminKappSlug: Utils.getAttributeValue(
      state.app.space,
      'Admin Kapp Slug',
      'admin',
    ),
    userIsMember: team ? Utils.isMemberOf(state.app.profile, team.name) : false,
    parent: heirarchy.parent && teamsMap[heirarchy.parent.name],
    subteams:
      team &&
      teams.filter(
        t =>
          t.name !== team.name && t.name.replace(/::[^:]+$/, '') === team.name,
      ),
    isSmallLayout: state.app.layoutSize === 'small',
  };
};

const openRequestToJoinForm = ({ space, adminKappSlug, team }) => config =>
  openModalForm({
    kappSlug: adminKappSlug,
    formSlug: 'join-team-request',
    title: 'Request to Join',
    confirmationMessage: 'Your request has been submitted.',
    values: {
      'Team Name': team.name,
    },
  });

const openRequestToLeaveForm = ({ space, adminKappSlug, team }) => config =>
  openModalForm({
    kappSlug: adminKappSlug,
    formSlug: 'leave-team-request',
    title: 'Request to Leave',
    confirmationMessage: 'Your request has been submitted.',
    values: {
      'Team Name': team.name,
    },
  });

const openDiscussions = props => () => props.setViewDiscussionsModal(true);

const closeDiscussions = props => () => props.setViewDiscussionsModal(false);

export const Team = compose(
  connect(mapStateToProps),
  withState('viewDiscussionsModal', 'setViewDiscussionsModal', false),
  withHandlers({
    openRequestToJoinForm,
    openRequestToLeaveForm,
    openDiscussions,
    closeDiscussions,
  }),
  withProps(
    props =>
      props.team && {
        creationFields: {
          title: props.team.name || 'Team Discussion',
          description: props.team.name || '',
          owningTeams: [{ name: props.team.name }],
        },
      },
  ),
)(TeamComponent);
