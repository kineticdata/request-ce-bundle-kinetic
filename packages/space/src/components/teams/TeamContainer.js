import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import { modalFormActions, Utils } from 'common';
import { buildHierarchy } from '../../utils';

import {
  actions,
  selectTeam,
  selectTeamMemberships,
  selectIsTeamMember,
} from '../../redux/modules/team';
import { context } from '../../redux/store';
import { actions as teamListActions } from '../../redux/modules/teamList';

import { Team } from './Team';

export const openDiscussions = props => () =>
  props.setViewDiscussionsModal(true);

export const closeDiscussions = props => () =>
  props.setViewDiscussionsModal(false);

const mapStateToProps = state => {
  const team = selectTeam(state);
  const me = state.app.profile;

  const heirarchy = buildHierarchy((team && team.name) || '');
  const teamsMap = state.teamList.data.reduce((memo, item) => {
    memo[item.name] = item;
    return memo;
  }, {});

  return {
    loading: state.team.loading || state.teamList.loading,
    space: state.app.space,
    me,
    team,
    adminKappSlug: Utils.getAttributeValue(
      state.app.space,
      'Admin Kapp Slug',
      'admin',
    ),
    memberships: selectTeamMemberships(state).map(member => member.user),
    userIsMember: selectIsTeamMember(state, me),
    parent: heirarchy.parent && teamsMap[heirarchy.parent.name],
    subteams:
      team &&
      (state.teamList.data || []).filter(
        item =>
          item.name !== team.name &&
          item.name.replace(/::[^:]+$/, '') === team.name,
      ),
    isSmallLayout: state.app.layoutSize === 'small',
  };
};

const mapDispatchToProps = {
  openForm: modalFormActions.openForm,
  fetchTeam: actions.fetchTeam,
  fetchTeams: teamListActions.fetchTeams,
  resetTeam: actions.resetTeam,
};

const openRequestToJoinForm = ({
  space,
  adminKappSlug,
  team,
  openForm,
}) => config =>
  openForm({
    kappSlug: adminKappSlug,
    formSlug: 'join-team-request',
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
    formSlug: 'leave-team-request',
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
    null,
    { context },
  ),
  withState('viewDiscussionsModal', 'setViewDiscussionsModal', false),
  lifecycle({
    componentWillMount() {
      this.props.fetchTeam(this.props.slug);
      this.props.fetchTeams();
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.slug !== nextProps.slug) {
        this.props.fetchTeam(nextProps.slug);
      }
    },
    componentWillUnmount() {
      this.props.resetTeam();
    },
  }),
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
)(Team);
