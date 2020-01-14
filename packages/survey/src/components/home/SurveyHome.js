import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { SurveyCard } from '../shared/SurveyCard';
import { PageTitle } from '../shared/PageTitle';
// import { StateListWrapper } from 'common';
// import { getSubmissionPath } from '../../utils';
import { I18n } from '@kineticdata/react';
import { compose, lifecycle } from 'recompose';
import { actions } from '../../redux/modules/submissions';
import { connect } from '../../redux/store';

const handleNewSurvey = () => console.log('new survey button clicked');

const SurveyHomeComponent = ({
  kapp,
  forms,
  submissions,
  submissionsError,
  homePageMode,
  homePageItems,
  fetchSubmissions,
  appLocation,
}) => {
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container">
        <div className="page-panel">
          <div className="page-panel__body">
            <div className="column-container">
              <div className="column-panel">
                <div className="page-title">
                  <div className="page-title__wrapper">
                    <h3 className="text-lowercase">
                      <I18n>{kapp.name}</I18n> /
                    </h3>
                    <h1>
                      <I18n>Current Surveys</I18n> {/*homePageMode */}
                    </h1>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sidebar-action"
                    onClick={handleNewSurvey}
                  >
                    <I18n>New Survey</I18n>
                  </button>
                </div>
                <div className="cards__wrapper cards__wrapper--seconds">
                  {forms &&
                    forms.map((survey, x) => {
                      console.log('item:', survey);
                      return <SurveyCard key={x} survey={survey} />;
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  kapp: state.app.kapp,
  forms: state.surveyApp.forms,
  submissions: state.submissions.data,
  submissionsError: state.submissions.error,
  appLocation: state.app.location,
});

const mapDispatchToProps = {
  fetchSubmissions: actions.fetchSubmissionsRequest,
};

export const SurveyHome = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmissions();
    },
  }),
)(SurveyHomeComponent);
