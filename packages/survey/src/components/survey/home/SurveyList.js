import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../../redux/modules/surveys';
import { context } from '../../../redux/store';
import { PageTitle } from '../../shared/PageTitle';
import { I18n } from '@kineticdata/react';
import { SurveyCard } from './SurveyCard';
import { SurveyTable } from './SurveyTable';
import { Icon } from 'common';

const WallyEmptyMessage = ({ filter }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>
        <I18n>No Surveys Found</I18n>
      </h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        <I18n>
          Surveys are Datastore Forms with additional Attributes. Their data can
          be used by other Kapps.
        </I18n>
      </h6>
    </div>
  );
};

const SurveyListComponent = ({
  kapp,
  datastoreForms,
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
              <I18n>survey </I18n>
              /{` `}
            </h3>
            <h1>
              <I18n>Survey List</I18n>
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
          ) : datastoreForms && datastoreForms.size > 0 ? (
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
                <SurveyTable surveyData={datastoreForms} />
              ) : (
                <div className="cards__wrapper cards__wrapper--seconds">
                  {datastoreForms.map((form, x) => {
                    return form.canManage ? (
                      <SurveyCard key={x} survey={form} />
                    ) : null;
                  })}
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
  loading: state.surveys.loading,
  datastoreForms: state.surveys.forms.filter(
    f => f.isHidden && f.isSurvey, // should be done in redux ?
  ),
  kapp: state.app.kapp,
  appLocation: state.app.location,
});

export const mapDispatchToProps = {
  push,
  fetchForms: actions.fetchForms,
  resetSearch: actions.resetSearchParams,
};

export const SurveyList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('homepageMode', 'setHomepageMode', 'cards'),
  lifecycle({
    componentWillMount() {
      this.props.resetSearch();
    },
  }),
)(SurveyListComponent);
