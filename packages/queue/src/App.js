import React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { compose, lifecycle, withHandlers } from 'recompose';
import { List } from 'immutable';
import { Filter } from './records';
import { KappRoute as Route, KappRedirect as Redirect, Loading } from 'common';

import { actions, selectMyTeamForms } from './redux/modules/queueApp';
import { actions as queueActions } from './redux/modules/queue';
import { actions as filterMenuActions } from './redux/modules/filterMenu';
import { actions as formsActions } from './redux/modules/forms';

import { Sidebar } from './components/Sidebar';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { QueueItemContainer } from './components/queue_item/QueueItem';
import { QueueListContainer } from './components/queue_list/QueueListContainer';
import { FilterMenuContainer } from './components/filter_menu/FilterMenuContainer';
import { NewItemMenuContainer } from './components/new_item_menu/NewItemMenuContainer';
import { WorkMenuContainer } from './components/work_menu/WorkMenu';
import { Settings } from './components/settings/Settings';
import './assets/styles/master.scss';

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
  return props.render({
    sidebar: (
      <Switch>
        <Route
          path="/kapps/queue/settings"
          render={() => <SettingsSidebar />}
        />
        <Route
          render={() => (
            <Sidebar
              myFilters={props.myFilters}
              counts={props.counts}
              hasTeammates={props.hasTeammates}
              hasTeams={props.hasTeams}
              hasForms={props.hasForms}
              handleOpenNewItemMenu={props.handleOpenNewItemMenu}
              handleNewPersonalFilter={props.handleNewPersonalFilter}
            />
          )}
        />
      </Switch>
    ),
    main: (
      <main className="package-layout package-layout--queue">
        <Route path="/settings" component={Settings} />
        <Route
          path="/submissions/:id"
          exact
          render={({ match }) => <Redirect to={`/item/${match.params.id}`} />}
        />
        <Route
          path="/forms/:formSlug/submissions/:id"
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
      </main>
    ),
  });
};

const mapStateToProps = (state, props) => ({
  loading: state.queue.queueApp.loading,
  defaultFilters: state.queue.queueApp.filters,
  myFilters: state.queue.queueApp.myFilters,
  counts: state.queue.queueApp.filters
    .toMap()
    .mapEntries(([_, filter]) => [
      filter.name,
      state.queue.queue.getIn(['lists', filter], List()).size,
    ]),
  hasTeammates: state.queue.queueApp.myTeammates.size > 0,
  hasTeams: state.queue.queueApp.myTeams.size > 0,
  hasForms:
    selectMyTeamForms(state).filter(form => form.type === 'Task').length > 0,
});

const mapDispatchToProps = {
  loadAppSettings: actions.loadAppSettings,
  fetchList: queueActions.fetchList,
  openNewItemMenu: queueActions.openNewItemMenu,
  openFilterMenu: filterMenuActions.open,
  fetchForms: formsActions.fetchForms,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleOpenNewItemMenu: ({ openNewItemMenu }) => () => openNewItemMenu(),
    handleNewPersonalFilter: ({ openFilterMenu }) => () =>
      openFilterMenu(Filter({ type: 'custom' })),
  }),
  lifecycle({
    componentWillMount() {
      this.props.loadAppSettings();
      this.props.fetchForms();
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
