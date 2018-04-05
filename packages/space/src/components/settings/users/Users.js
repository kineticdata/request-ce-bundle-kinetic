import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { UsersList } from './UsersList';
import { ViewUser } from './ViewUser';
import { EditUser } from './EditUser';

const UsersError = () => <h1>Error loading Datastore</h1>;
const NewUser = () => <h1>New User</h1>;
const ImportUsers = () => <h1>Import Users</h1>;

export const Users = ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}/new`} component={NewUser} />
    <Route exact path={`${match.path}/import`} component={ImportUsers} />
    <Route exact path={`${match.path}/error`} component={UsersError} />
    <Route exact path={`${match.path}/:username/edit`} component={EditUser} />
    <Route exact path={`${match.path}/:username`} component={ViewUser} />
    <Route component={UsersList} />
  </Switch>
);
