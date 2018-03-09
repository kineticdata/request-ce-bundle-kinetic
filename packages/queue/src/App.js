import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { List } from 'immutable';
import { KappRoute as Route, KappRedirect as Redirect } from 'common';
import { Sidebar } from './components/Sidebar';
import { actions, selectMyTeamForms } from './redux/modules/app';
import { actions as queueActions } from './redux/modules/queue';
import { actions as filterMenuActions } from './redux/modules/filterMenu';
import { QueueItemContainer } from './components/QueueItem/QueueItem';
import { QueueListContainer } from './components/queueList/QueueListContainer';
import { FilterMenuContainer } from './components/FilterMenu/FilterMenuContainer';
import { NewItemMenuContainer } from './components/newItemMenu/NewItemMenuContainer';
import { WorkMenuContainer } from './components/WorkMenu';

const mapStateToProps = (state, props) => ({
  loading: state.app.loading,
  defaultFilters: state.app.filters,
  myFilters: state.app.myFilters,
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
  loadAppSettings: actions.loadAppSettings,
  fetchList: queueActions.fetchList,
  openNewItemMenu: queueActions.openNewItemMenu,
  openFilterMenu: filterMenuActions.open,
};

export const AppComponent = props => {
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
    main: !props.loading && (
      <div style={{ marginTop: '49px' }} className="queue">
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
      this.props.defaultFilters
        .filter(
          filter =>
            !this.props.currentFilter ||
            !filter.equals(this.props.currentFilter),
        )
        .forEach(this.props.fetchList);
    },
  }),
);

export const App = enhance(AppComponent);
