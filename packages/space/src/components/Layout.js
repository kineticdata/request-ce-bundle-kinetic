import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { HeaderContainer } from 'react-kinops-common';
import { ModalFormContainer } from 'react-kinops-common';
import { ToastsContainer } from 'react-kinops-common';
import { Route, Switch } from 'react-router-dom';
import Sidebar from 'react-sidebar';

import { About } from './about/About';
import { AlertForm } from './alerts/AlertForm';
import { Alerts } from './alerts/Alerts';
import { Datastore } from './datastore/Datastore';
import { Discussion } from './discussion/Discussion';
import { EditProfile } from './profile/EditProfile';
import { Home } from './home/Home';
import { Notifications } from './notifications/Notifications';
import { ViewProfile } from './profile/ViewProfile';
import { TeamContainer } from './teams/TeamContainer';
import { TeamForm } from './teams/TeamForm';
import { TeamsContainer } from './teams/TeamsContainer';
import { IsolatedForm } from './shared/IsolatedForm';


import { actions } from '../redux/modules/app';

const globals = import('../globals');

const Layout = ({
  sidebarContent,
  sidebarOpen,
  setSidebarOpen,
  isLarge,
  toggleSidebarOpen,
}) => (
  <div>
    <HeaderContainer hasSidebar toggleSidebarOpen={toggleSidebarOpen} />
    <Sidebar
      sidebar={sidebarContent}
      shadow={false}
      open={sidebarOpen && !isLarge}
      docked={sidebarOpen && isLarge}
      onSetOpen={setSidebarOpen}
      sidebarClassName={`sidebar-content ${isLarge ? 'drawer' : 'overlay'}`}
      contentClassName="main-container"
    >
      <ToastsContainer />
      <Notifications />
      <div className="layout">
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/alerts" exact component={Alerts} />
        <Route path="/alerts/:id" exact component={AlertForm} />
        <Route path="/discussions/:id" exact component={Discussion} />
        <Route path="/profile" exact component={EditProfile} />
        <Route path="/profile/:username" exact component={ViewProfile} />
        <Route path="/datastore" component={Datastore} />
        <Route path="/teams" exact component={TeamsContainer} />
        <Switch>
          <Route path="/teams/new" exact component={TeamForm} />
          <Route path="/teams/:slug" exact component={TeamContainer} />
        </Switch>
        <Route path="/teams/:slug/edit" exact component={TeamForm} />
        <Route path="/kapps/:kappSlug/forms/:formSlug" exact component={IsolatedForm} />
      </div>
      <ModalFormContainer globals={globals} />
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
