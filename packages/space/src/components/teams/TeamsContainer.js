import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { modalFormActions, Utils } from 'common';

import { actions } from '../../redux/modules/teamList';

import { Teams } from './Teams';

export const mapStateToProps = state => ({
  loading: state.space.teamList.loading,
  teams: state.space.teamList.data,
  me: state.app.profile,
  adminKappSlug: Utils.getAttributeValue(
    state.app.space,
    'Admin Kapp Slug',
    'admin',
  ),
});
export const mapDispatchToProps = {
  fetchTeams: actions.fetchTeams,
  openForm: modalFormActions.openForm,
};

const openRequestNewTeam = ({
  space,
  adminKappSlug,
  team,
  openForm,
}) => config =>
  openForm({
    kappSlug: adminKappSlug,
    formSlug: 'request-a-new-team',
    title: 'Request New Team',
    confirmationMessage: 'Your request has been submitted.',
  });

export const TeamsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchTeams();
    },
  }),
  withHandlers({
    openRequestNewTeam,
  }),
)(Teams);
