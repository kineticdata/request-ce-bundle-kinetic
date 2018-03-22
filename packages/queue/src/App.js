import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { List } from 'immutable';
import { Filter } from './records/index';
import { KappRoute as Route, KappRedirect as Redirect } from 'common';
import { Loading } from './components/app/Loading';
import { Sidebar } from './components/Sidebar';
import { actions, selectMyTeamForms } from './redux/modules/queueApp';
import { actions as queueActions } from './redux/modules/queue';
import { actions as filterMenuActions } from './redux/modules/filterMenu';
import { QueueItemContainer } from './components/QueueItem/QueueItem';
import { QueueListContainer } from './components/queueList/QueueListContainer';
import { FilterMenuContainer } from './components/FilterMenu/FilterMenuContainer';
import { NewItemMenuContainer } from './components/newItemMenu/NewItemMenuContainer';
import { WorkMenuContainer } from './components/WorkMenu';
import './assets/styles/master.scss';

const mapStateToProps = (state, props) => ({
  loading: state.queueApp.loading,
  defaultFilters: state.queueApp.filters,
  myFilters: state.queueApp.myFilters,
  counts: state.queueApp.filters
    .toMap()
    .mapEntries(([_, filter]) => [
      filter.name,
      state.queue.getIn(['lists', filter], List()).size,
    ]),
  hasTeammates: state.queueApp.myTeammates.size > 0,
  hasTeams: state.queueApp.myTeams.size > 0,
  hasForms:
    selectMyTeamForms(state).filter(form => form.type === 'Task').length > 0,
});

const mapDispatchToProps = {
  loadAppSettings: actions.loadAppSettings,
  fetchList: queueActions.fetchList,
  openNewItemMenu: queueActions.openNewItemMenu,
  openFilterMenu: filterMenuActions.open,
};

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
  return props.render({
    sidebar: (
      <Sidebar
        myFilters={props.myFilters}
        counts={props.counts}
        hasTeammates={props.hasTeammates}
        hasTeams={props.hasTeams}
        hasForms={props.hasForms}
        handleOpenNewItemMenu={props.handleOpenNewItemMenu}
        handleNewPersonalFilter={props.handleNewPersonalFilter}
      />
    ),
    main: (
      <div className="queue">
        <Route
          path="/submissions/:id"
          exact
          render={({ match }) => <Redirect to={`/item/${match.params.id}`} />}
        />
        <Route path="/" exact render={() => <Redirect to="/list/Mine" />} />
        <Route path="/list/:filter" component={QueueListContainer} />
        <Route path="/custom/:filter" component={QueueListContainer} />
        <Route path="/adhoc" component={QueueListContainer} />
        <Route
          path="/(list|custom|adhoc)?/:filter?/item/:id"
          component={QueueItemContainer}
        />
        <Route
          path="/queue/filter/__show__/details/:id/summary"
          render={({ match }) => <Redirect to={`/item/${match.params.id}`} />}
        />
        <FilterMenuContainer />
        <NewItemMenuContainer />
        <WorkMenuContainer />
      </div>
    ),
  });
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleOpenNewItemMenu: ({ openNewItemMenu }) => () => openNewItemMenu(),
    handleNewPersonalFilter: ({ openFilterMenu }) => () =>
      openFilterMenu(Filter({ type: 'custom' })),
  }),
  lifecycle({
    componentWillMount() {
      this.props.loadAppSettings();
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.loading && !nextProps.loading) {
        this.props.defaultFilters
          .filter(
            filter =>
              !this.props.currentFilter ||
              !filter.equals(this.props.currentFilter),
          )
          .forEach(this.props.fetchList);
      }
    },
  }),
);

export const App = enhance(AppComponent);
