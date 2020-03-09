import React from 'react';
import { Router, Redirect } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { ErrorUnexpected, Loading } from 'common';
import { I18n } from '@kineticdata/react';
import { connect } from './redux/store';
import { Survey, SurveyConfirmation } from './components/survey/Survey';
import { SurveyPreview } from './components/survey/SurveyPreview';
import { SurveyList } from './components/survey/home/SurveyList';
import { SurveySubmissions } from './components/survey/submissions/SurveySubmissions';
import { SubmissionDetails } from './components/survey/submissions/SubmissionDetails';
import { SurveySettings } from './components/survey/settings/SurveySettings';
import { CreateSurvey } from './components/survey/CreateSurvey';
import { actions as appActions } from './redux/modules/surveyApp';

const SurveyError = () => (
  <h1>
    <I18n>Error loading Survey</I18n>
  </h1>
);

/*****************************************************************************
 *** PRIVATE APP
 *****************************************************************************/

const AppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      main: (
        <I18n>
          <main className={`package-layout package-layout--survey`}>
            <Router>
              <SurveyList path="/" />
              <CreateSurvey path="new" />
              <Survey path=":slug/submissions/:submissionId" />
              <Redirect
                from="forms/:slug/submissions/:submissionId"
                to="../../../../:slug/submissions/:submissionId"
                noThrow
              />
              <Survey path="survey-opt-out" />
              <SurveyPreview path="forms/:slug" />
              <Redirect from=":slug" to="../forms/:slug" noThrow />
              <SurveyError path="error" />
              <SurveySubmissions path=":slug/submissions" />
              <SurveySettings path=":slug/settings" />
              <SubmissionDetails path=":slug/submissions/:submissionId/details" />
              <SurveyConfirmation path="forms/:slug/confirmation" />
              <SurveyConfirmation path="survey-opt-out/confirmation" />
              <SurveyConfirmation path=":slug/submissions/:submissionId/confirmation" />
            </Router>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({
  loading: state.surveyApp.loading,
  error: state.surveyApp.error,
  surveys: state.surveyApp.forms,
  required: state.surveyApp.required,
});

const mapDispatchToProps = {
  fetchAppDataRequest: appActions.fetchAppDataRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppDataRequest();
    },
  }),
);

export const App = enhance(AppComponent);

/*****************************************************************************
 *** PUBLIC APP
 *****************************************************************************/

export const PublicAppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      main: (
        <I18n>
          <main className="package-layout package-layout--services">
            <Router>
              <Survey path=":slug/submissions/:submissionId" />
              <Redirect
                from="forms/:slug/submissions/:submissionId"
                to="../../../../:slug/submissions/:submissionId"
                noThrow
              />
              <Survey path="survey-opt-out" />
              <SurveyError path="error" />
              <Redirect from="*" to={props.authRoute} noThrow />
            </Router>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToPropsPublic = state => ({
  authRoute: state.app.authRoute,
  loading: state.surveyApp.loading,
  error: state.surveyApp.error,
});

const enhancePublic = compose(
  connect(
    mapStateToPropsPublic,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppDataRequest();
    },
  }),
);

export const PublicApp = enhancePublic(PublicAppComponent);
