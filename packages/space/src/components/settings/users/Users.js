import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { UsersList } from './UsersList';
import { UserForm } from './UserForm';
import { I18n } from '../../../../../app/src/I18nProvider';

const UsersError = () => (
  <h1>
    <I18n>Error loading users</I18n>
  </h1>
);
const ImportUsers = () => (
  <h1>
    <I18n>Import Users</I18n>
  </h1>
);

export const Users = ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}/new`} component={UserForm} />
    <Route exact path={`${match.path}/import`} component={ImportUsers} />
    <Route exact path={`${match.path}/error`} component={UsersError} />
    <Route exact path={`${match.path}/:username/:mode`} component={UserForm} />
    <Route component={UsersList} />
  </Switch>
);
