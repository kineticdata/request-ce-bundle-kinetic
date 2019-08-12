import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Redirect, LocationProvider, Router } from '@reach/router';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connectedHistory, connect, context, store } from './redux/store';
import { syncAppState } from './redux/modules/app';
import {
  CommonProvider,
  ErrorUnexpected,
  Loading,
  ModalFormContainer,
  ToastsContainer,
} from 'common';
import { List, is } from 'immutable';
import { I18n } from '@kineticdata/react';

import { actions, selectMyTeamForms } from './redux/modules/queueApp';
import { actions as queueActions } from './redux/modules/queue';
import { actions as filterMenuActions } from './redux/modules/filterMenu';
import { actions as formsActions } from './redux/modules/forms';

import { Sidebar } from './components/Sidebar';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { QueueItemContainer } from './components/queue_item/QueueItem';
import { QueueListContainer } from './components/queue_list/QueueListContainer';
import { NewItemMenuContainer } from './components/new_item_menu/NewItemMenuContainer';
import { WorkMenuContainer } from './components/work_menu/WorkMenu';
import { Settings } from './components/settings/Settings';

import './assets/styles/master.scss';

const CustomRedirect = props => (
  <Redirect to={`${props.appLocation}/item/${props.id}`} noThrow />
);

const AppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      sidebar: (
        <Router>
          <SettingsSidebar path="settings/*" />
          <Sidebar
            path="*"
            teamFilters={props.teamFilters}
            myFilters={props.myFilters}
            counts={props.counts}
            hasTeammates={props.hasTeammates}
            hasTeams={props.hasTeams}
            hasForms={props.hasForms}
            handleOpenNewItemMenu={props.handleOpenNewItemMenu}
          />
        </Router>
      ),
      main: (
        <I18n>
          <main className="package-layout package-layout--queue">
            <Router>
              <Settings path="settings/*" />
              <QueueListContainer path="list/:filter" />
              <QueueListContainer path="team/:filter" />
              <QueueListContainer path="custom/:filter" />
              <QueueListContainer path="adhoc" />
              <QueueItemContainer path="list/:filter/item/:id" />
              <QueueItemContainer path="team/:filter/item/:id" />
              <QueueItemContainer path="custom/:filter/item/:id" />
              <QueueItemContainer path="adhoc/item/:id" />
              <QueueItemContainer path="item/:id" />
              <Redirect
                from="/"
                to={`${props.appLocation}/list/Mine`}
                noThrow
              />
              <Redirect
                from="submissions/:id"
                to={`${props.appLocation}/item/:id`}
                noThrow
              />
              <CustomRedirect
                path="forms/:formSlug/submissions/:id"
                appLocation={props.appLocation}
              />
              <Redirect
                from="queue/filter/__show__/details/:id/summary"
                to={`${props.appLocation}/item/:id`}
                noThrow
              />
            </Router>
            <NewItemMenuContainer />
            <WorkMenuContainer />
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({
  loading: state.queueApp.loading,
  error: state.queueApp.error,
  defaultFilters: state.queueApp.filters,
  teamFilters: state.queueApp.teamFilters,
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
  appLocation: state.app.location,
});

const mapDispatchToProps = {
  fetchAppDataRequest: actions.fetchAppDataRequest,
  fetchList: queueActions.fetchList,
  openNewItemMenu: queueActions.openNewItemMenu,
  openFilterMenu: filterMenuActions.open,
  fetchFormsRequest: formsActions.fetchFormsRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleOpenNewItemMenu: ({ openNewItemMenu }) => () => openNewItemMenu(),
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppDataRequest();
      this.props.fetchFormsRequest();
    },
    componentDidUpdate(prevProps) {
      if (!this.props.loading && prevProps.loading) {
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

const App = enhance(AppComponent);

export class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
    // Listen to the local store to see if the embedded app is ready to be
    // re-rendered. Currently this just means that the required props have been
    // synced into the local store.
    this.unsubscribe = store.subscribe(() => {
      const ready = store.getState().app.ready;
      if (ready !== this.state.ready) {
        this.setState({ ready });
      }
    });
  }

  componentDidMount() {
    Object.entries(this.props.appState).forEach(syncAppState);
  }

  componentDidUpdate(prevProps) {
    Object.entries(this.props.appState)
      .filter(([key, value]) => !is(value, prevProps.appState[key]))
      .forEach(syncAppState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      this.state.ready && (
        <Provider store={store} context={context}>
          <CommonProvider>
            <LocationProvider hashRouting history={connectedHistory}>
              <ToastsContainer duration={5000} />
              <ModalFormContainer />
              <Router>
                <App
                  render={this.props.render}
                  path={`${this.props.appState.location}/*`}
                />
              </Router>
            </LocationProvider>
          </CommonProvider>
        </Provider>
      )
    );
  }
}
