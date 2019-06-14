import React from 'react';
import { Router } from '../../App';
import { TeamsListContainer } from './TeamsListContainer';
import { TeamForm } from './TeamForm';

export const Teams = ({ match }) => (
  <Router>
    <TeamForm path="new" component={TeamForm} />
    <TeamForm path=":slug/edit" component={TeamForm} />
    <TeamsListContainer path="/" />
  </Router>
);
