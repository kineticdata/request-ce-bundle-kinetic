import React from 'react';

import { Router } from '@reach/router';
import { UsersList } from './UsersList';
import { UserForm } from './UserForm';
import { I18n } from '@kineticdata/react';

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
  <Router>
    <UserForm path="new" />
    <ImportUsers path="import" />
    <UsersError path="/error" />
    <UserForm path=":username/:mode" />
    <UsersList default />
  </Router>
);
