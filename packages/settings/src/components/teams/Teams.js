import React from 'react';
import { Router } from '@reach/router';
import { TeamsList } from './TeamsList';
import { TeamEdit } from './TeamEdit';

export const Teams = ({ match }) => (
  <Router>
    <TeamEdit path=":slug" />
    <TeamsList default />
  </Router>
);
