import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from '../../../redux/store';
import { compose, withState } from 'recompose';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { PageTitle } from '../../shared/PageTitle';
import { I18n } from '@kineticdata/react';
import { SurveyCard } from './SurveyCard';
import { SurveyTable } from './SurveyTable';

const WallyEmptyMessage = () => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>
        <I18n>No Surveys Found</I18n>
      </h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        <I18n>
          Surveys are Kapp Forms with additional configuration attributes.
        </I18n>
      </h6>
    </div>
  );
};

const SurveyListComponent = ({
  kapp,
  surveys,
  homepageMode,
  setHomepageMode,
  loading,
}) => {
  return (
    <div className="page-container page-container--panels">
      <PageTitle parts={[]} />
      <div className="page-panel page-panel--two-thirds">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <I18n>{kapp.name} </I18n>
              /{` `}
            </h3>
            <h1>
              <I18n>Surveys</I18n>
            </h1>
          </div>
          <div className="page-title__actions">
            <Link to="new" className="btn btn-secondary">
              <I18n>New Survey</I18n>
            </Link>
          </div>
        </div>

        <div className="forms-list-wrapper">
          {loading ? (
            <h3>
              <I18n>Loading</I18n>
            </h3>
          ) : surveys && surveys.size > 0 ? (
            <Fragment>
              <div className="survey-view-toggle btn-group">
                <button
                  className={`btn ${
                    homepageMode === 'cards' ? 'btn-primary' : 'btn-subtle'
                  }`}
                  onClick={() =>
                    setHomepageMode(homepageMode === 'cards' ? 'list' : 'cards')
                  }
                >
                  <I18n>
                    <i className="fa fa-th-large" />
                  </I18n>
                </button>
                <button
                  className={`btn ${
                    homepageMode === 'list' ? 'btn-primary' : 'btn-subtle'
                  }`}
                  onClick={() =>
                    setHomepageMode(homepageMode === 'cards' ? 'list' : 'cards')
                  }
                >
                  <I18n>
                    <i className="fa fa-th-list" />
                  </I18n>
                </button>
              </div>

              {homepageMode === 'list' ? (
                <SurveyTable surveyData={surveys} />
              ) : (
                <div className="cards__wrapper cards__wrapper--seconds">
                  {surveys.map((survey, i) => (
                    <SurveyCard key={i} survey={survey} />
                  ))}
                </div>
              )}
            </Fragment>
          ) : (
            <WallyEmptyMessage />
          )}
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.surveyApp.loading,
  kapp: state.app.kapp,
  appLocation: state.app.location,
  surveys: state.surveyApp.surveys,
});

export const mapDispatchToProps = {};

export const SurveyList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('homepageMode', 'setHomepageMode', 'cards'),
)(SurveyListComponent);
