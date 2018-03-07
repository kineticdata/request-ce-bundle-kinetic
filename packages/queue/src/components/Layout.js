import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions } from '../redux/modules/app';
import Sidebar from 'react-sidebar';
import { HeaderContainer } from 'react-kinops-common';
import { Route, Redirect } from 'react-router-dom';
import { NotificationsContainer } from './notifications/NotificationsContainer';
import { FilterMenuContainer } from './FilterMenu/FilterMenuContainer';
import { QueueItemContainer } from './QueueItem/QueueItem';
import { QueueListContainer } from './queueList/QueueListContainer';
import { NewItemMenuContainer } from './newItemMenu/NewItemMenuContainer';
import { ModalFormContainer } from 'react-kinops-common';
import { ToastsContainer } from 'react-kinops-common';
import { WorkMenuContainer } from './WorkMenu';

import { FormPreview } from './FormPreview';

const globals = import('../globals');

export const Layout = ({
  sidebarOpen,
  isLarge,
  toggleSidebarOpen,
  setSidebarOpen,
  sidebarContent,
}) => (
  <div className="layout">
    <HeaderContainer hasSidebar toggleSidebarOpen={toggleSidebarOpen} />
    <Sidebar
      sidebar={sidebarContent}
      shadow={false}
      open={sidebarOpen && !isLarge}
      docked={sidebarOpen && isLarge}
      onSetOpen={setSidebarOpen}
      sidebarClassName={`sidebar-content ${isLarge ? 'drawer' : 'overlay'}`}
      contentClassName="main-content"
    >
      <ToastsContainer />
      <NotificationsContainer />
      <Route
        path="/submissions/:id"
        exact
        render={({ match }) => <Redirect to={`/item/${match.params.id}`} />}
      />
      <Route path="/forms/:slug" exact component={FormPreview} />
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
      <ModalFormContainer globals={globals} />
      <WorkMenuContainer />
    </Sidebar>
  </div>
);

export const mapStateToProps = state => ({
  isLarge: state.layout.get('size') !== 'small',
  sidebarOpen: state.app.sidebarOpen,
});

const mapDispatchToProps = {
  setSidebarOpen: actions.setSidebarOpen,
};

export const LayoutContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    toggleSidebarOpen: props => () => props.setSidebarOpen(!props.sidebarOpen),
  }),
)(Layout);
