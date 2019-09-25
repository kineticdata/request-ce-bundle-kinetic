import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  openModalForm,
  ErrorNotFound,
  StateListWrapper,
  TeamCard,
  Utils,
} from 'common';
import { actions } from '../redux/modules/teams';
import { I18n } from '@kineticdata/react';
import { PageTitle } from './shared/PageTitle';
import { Team } from './Team';

export const TeamsNavigation = compose(
  connect(
    null,
    { fetchTeamsRequest: actions.fetchTeamsRequest },
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchTeamsRequest();
    },
  }),
)(() => (
  <Switch>
    <Route exact path="/teams/:teamSlug" component={Team} />
    <Route exact path="/teams" component={Teams} />
    <Route component={ErrorNotFound} />
  </Switch>
));

const TeamsComponent = ({ error, teams, me, openRequestNewTeam }) => (
  <div className="page-container">
    <PageTitle parts={['Teams']} />
    <div className="page-panel">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h1>Teams</h1>
        </div>
        {me.spaceAdmin ? (
          <Link to="/settings/teams/new" className="btn btn-secondary">
            <I18n>New Team</I18n>
          </Link>
        ) : (
          <button onClick={openRequestNewTeam} className="btn btn-secondary">
            <I18n>Request New Team</I18n>
          </button>
        )}
      </div>
      <StateListWrapper
        data={teams}
        error={error}
        emptyTitle="There are no teams"
        emptyMessage=""
      >
        {data => (
          <div className="cards__wrapper cards__wrapper--thirds">
            {teams.map(team => {
              return (
                <TeamCard key={team.slug} team={team} components={{ Link }} />
              );
            })}
          </div>
        )}
      </StateListWrapper>
    </div>
  </div>
);

const mapStateToProps = state => ({
  me: state.app.profile,
  teams: state.teams.data,
  error: state.teams.error,
  adminKappSlug: Utils.getAttributeValue(
    state.app.space,
    'Admin Kapp Slug',
    'admin',
  ),
});

const openRequestNewTeam = ({ space, adminKappSlug, team }) => config =>
  openModalForm({
    kappSlug: adminKappSlug,
    formSlug: 'new-team-request',
    title: 'Request New Team',
    confirmationMessage: 'Your request has been submitted.',
  });

export const Teams = compose(
  connect(mapStateToProps),
  withHandlers({
    openRequestNewTeam,
  }),
)(TeamsComponent);
