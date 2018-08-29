import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { TeamsListContainer } from './TeamsListContainer';
import { TeamForm } from './TeamForm';

export const Teams = ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}/new`} component={TeamForm} />
    <Route exact path={`${match.path}/:slug/edit`} component={TeamForm} />
    <Route component={TeamsListContainer} />
  </Switch>
);
