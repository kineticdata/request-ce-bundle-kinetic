import React from 'react';
import { Router } from '@reach/router';
import { connect } from 'react-redux';
import { LoadingMessage } from 'common';
import { Submission } from './submissions/Submission';
import { SurveySubmissions } from './submissions/SurveySubmissions';
import { SurveySettings } from './SurveySettings';
import { CreateSurvey } from './CreateSurvey';
import { I18n } from '@kineticdata/react';
import { context } from '../../redux/store';

const SurveyError = () => (
  <h1>
    <I18n>Error loading Survey</I18n>
  </h1>
);

export const SurveyRouterComponent = ({ match, loading }) =>
  !loading ? (
    <Router>
      <CreateSurvey path="new" />
      <SurveyError path="error" />
      <SurveySubmissions path=":slug/submissions" />
      <SurveySettings path=":slug/settings" />
      <Submission path=":slug/submissions/new" />
      <Submission path=":slug/submissions/:id" />
    </Router>
  ) : (
    <LoadingMessage />
  );

export const mapStateToProps = state => ({
  loading: state.app.loading,
});

export const SurveyRouter = connect(
  mapStateToProps,
  null,
  null,
  { context },
)(SurveyRouterComponent);
