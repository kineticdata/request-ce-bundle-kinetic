import React from 'react';
import { Router } from '@reach/router';
// import { TeamsListContainer } from './TeamsListContainer';
import { TeamsList } from './TeamsList';
import { TeamForm } from './TeamForm';

export const Teams = ({ match }) => (
  <Router>
    <TeamForm path="new" component={TeamForm} />
    <TeamForm path=":slug/edit" component={TeamForm} />
    {/* <TeamsListContainer path="/" /> */}
    <TeamsList path="/" />
  </Router>
);
