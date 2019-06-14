import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { openModalForm, Utils } from 'common';

import { actions } from '../../redux/modules/teamList';
import { context } from '../../redux/store';

import { TeamsList } from './TeamsList';

export const mapStateToProps = state => ({
  loading: state.teamList.loading,
  teams: state.teamList.data,
  me: state.app.profile,
  adminKappSlug: Utils.getAttributeValue(
    state.app.space,
    'Admin Kapp Slug',
    'admin',
  ),
});
export const mapDispatchToProps = {
  fetchTeams: actions.fetchTeams,
};

const openRequestNewTeam = ({ space, adminKappSlug, team }) => config =>
  openModalForm({
    kappSlug: adminKappSlug,
    formSlug: 'new-team-request',
    title: 'Request New Team',
    confirmationMessage: 'Your request has been submitted.',
  });

export const TeamsListContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentWillMount() {
      //this.props.fetchTeams();
    },
  }),
  withHandlers({
    openRequestNewTeam,
  }),
)(TeamsList);
