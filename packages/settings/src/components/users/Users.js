import React from 'react';
import { Router } from '@reach/router';
import { UsersList } from './UsersList';
import { UserEdit } from './UserEdit';
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
    <ImportUsers path="import" />
    <UsersError path="error" />
    <UserEdit path=":username" />
    <UsersList default />
  </Router>
);
