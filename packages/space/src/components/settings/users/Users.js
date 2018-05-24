import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { UsersList } from './UsersList';
import { UserForm } from './UserForm';

const UsersError = () => <h1>Error loading Datastore</h1>;
const ImportUsers = () => <h1>Import Users</h1>;

export const Users = ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}/:mode`} component={UserForm} />
    <Route exact path={`${match.path}/import`} component={ImportUsers} />
    <Route exact path={`${match.path}/error`} component={UsersError} />
    <Route exact path={`${match.path}/:username/edit`} component={UserForm} />
    <Route component={UsersList} />
  </Switch>
);
