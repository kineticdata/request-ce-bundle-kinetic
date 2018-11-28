import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { actions as discussionActions } from 'discussions';

import { modalFormActions, Utils } from 'common';

import { buildHierarchy } from '../../utils';

import {
  actions,
  selectTeam,
  selectTeamMemberships,
  selectIsTeamMember,
} from '../../redux/modules/team';
import { actions as teamListActions } from '../../redux/modules/teamList';
import {
  actions as spaceFormsActions,
  selectFormsForTeam,
} from '../../redux/modules/spaceForms';

import { Team } from './Team';

const mapStateToProps = state => {
  const team = selectTeam(state);
  const me = state.app.profile;

  const heirarchy = buildHierarchy((team && team.name) || '');
  const teamsMap = state.space.teamList.data.reduce((memo, item) => {
    memo[item.name] = item;
    return memo;
  }, {});

  return {
    loading:
      state.space.team.loading ||
      state.space.teamList.loading ||
      state.space.spaceForms.loading,
    space: state.app.space,
    catalogSlug: Utils.getAttributeValue(
      state.app.space,
      'Catalog Kapp Slug',
      'catalog',
    ),
    me,
    team,
    adminKappSlug: Utils.getAttributeValue(
      state.app.space,
      'Admin Kapp Slug',
      'admin',
    ),
    discussionId:
      !state.space.team.loading && team
        ? Utils.getAttributeValue(team, 'Discussion Id', null)
        : null,
    memberships: selectTeamMemberships(state).map(member => member.user),
    userIsMember: selectIsTeamMember(state, me),
    parent: heirarchy.parent && teamsMap[heirarchy.parent.name],
    subteams:
      team &&
      (state.space.teamList.data || []).filter(
        item =>
          item.name !== team.name &&
          item.name.replace(/::[^:]+$/, '') === team.name,
      ),
    services: selectFormsForTeam(state),
  };
};

const mapDispatchToProps = {
  openForm: modalFormActions.openForm,
  fetchTeam: actions.fetchTeam,
  fetchTeams: teamListActions.fetchTeams,
  fetchForms: spaceFormsActions.fetchForms,
  resetTeam: actions.resetTeam,
  openModal: discussionActions.openModal,
};

const openRequestToJoinForm = ({
  space,
  adminKappSlug,
  team,
  openForm,
}) => config =>
  openForm({
    kappSlug: adminKappSlug,
    formSlug: 'request-to-join-team',
    title: 'Request to Join',
    confirmationMessage: 'Your request has been submitted.',
    values: {
      'Team Name': team.name,
    },
  });

const openRequestToLeaveForm = ({
  space,
  adminKappSlug,
  team,
  openForm,
}) => config =>
  openForm({
    kappSlug: adminKappSlug,
    formSlug: 'request-to-leave-team',
    title: 'Request to Leave',
    confirmationMessage: 'Your request has been submitted.',
    values: {
      'Team Name': team.name,
    },
  });

export const TeamContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchTeam(this.props.match.params.slug);
      this.props.fetchTeams();
      this.props.fetchForms(this.props.catalogSlug);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.slug !== nextProps.match.params.slug) {
        this.props.fetchTeam(nextProps.match.params.slug);
      }
    },
    componentWillUnmount() {
      this.props.resetTeam();
    },
  }),
  withHandlers({
    openRequestToJoinForm,
    openRequestToLeaveForm,
    openDiscussion: ({ discussionId, openModal }) => () => {
      openModal(discussionId, 'discussion');
    },
  }),
)(Team);
