import React from 'react';
import { connect } from 'react-redux';
import { Router, Redirect } from '@reach/router';
import { compose, lifecycle, withHandlers } from 'recompose';
import { List } from 'immutable';
import { Loading } from 'common';
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
import { I18n } from '../../app/src/I18nProvider';
import './assets/styles/master.scss';
import { context } from './redux/store';

const CustomRedirect = props => (
  <Redirect to={`${props.appLocation}/item/${props.id}`} noThrow />
);

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
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
            <Redirect from="/" to={`${props.appLocation}/list/Mine`} noThrow />
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
};

const mapStateToProps = (state, props) => ({
  loading: state.queueApp.loading,
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
    null,
    { context },
  ),
  withHandlers({
    handleOpenNewItemMenu: ({ openNewItemMenu }) => () => openNewItemMenu(),
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
