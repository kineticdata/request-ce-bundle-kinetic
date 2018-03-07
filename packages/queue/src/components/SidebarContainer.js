import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { Filter } from '../records';
import { getFilterByPath, selectMyTeamForms } from '../redux/modules/app';
import { actions } from '../redux/modules/queue';
import { actions as filterMenuActions } from '../redux/modules/filterMenu';
import { Sidebar } from './Sidebar';

const mapStateToProps = state => ({
  documentationUrl: state.app.documentationUrl,
  supportUrl: state.app.supportUrl,
  defaultFilters: state.app.filters,
  myFilters: state.app.myFilters,
  currentFilter: getFilterByPath(state, state.router.location.pathname),
  // The route prop below is just a way to make sure this component updates when
  // the route changes, otherwise connect implicitly prevents the update.
  route: `${state.router.location.pathname} ${state.router.location.search}`,
  counts: state.app.filters
    .toMap()
    .mapEntries(([_, filter]) => [
      filter.name,
      state.queue.getIn(['lists', filter], List()).size,
    ]),
  hasTeammates: state.app.myTeammates.size > 0,
  hasTeams: state.app.myTeams.size > 0,
  hasForms:
    selectMyTeamForms(state).filter(form => form.type === 'Task').length > 0,
});

const mapDispatchToProps = {
  fetchList: actions.fetchList,
  openNewItemMenu: actions.openNewItemMenu,
  openFilterMenu: filterMenuActions.open,
};

export const SidebarContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleOpenNewItemMenu: ({ openNewItemMenu }) => () => openNewItemMenu(),
    handleNewPersonalFilter: ({ openFilterMenu }) => () =>
      openFilterMenu(Filter({ type: 'custom' })),
  }),
  lifecycle({
    componentWillMount() {
      this.props.defaultFilters
        .filter(
          filter =>
            !this.props.currentFilter ||
            !filter.equals(this.props.currentFilter),
        )
        .forEach(this.props.fetchList);
    },
  }),
)(Sidebar);
