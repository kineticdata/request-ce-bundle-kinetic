import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { actions } from '../../redux/modules/surveys';
import { compose, withProps } from 'recompose';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';

const SurveyConfirmationComponent = props => {
  const customFormText = props.form.attributes.filter(
    a => a.name === 'Confirmation Page Text' && a.values[0].length,
  );
  const customKappText = props.kapp.attributes.filter(
    a => a.name === 'Confirmation Page Text' && a.values[0].length,
  );
  const customText = customFormText[0]
    ? customFormText[0].values[0]
    : customKappText[0]
      ? customKappText[0].values[0]
      : null;

  return (
    <Fragment>
      <PageTitle parts={['Survey Confirmation']} />
      <div className="page-container page-container--color-bar">
        <div className="page-panel">
          <I18n
            context={`kapps.${props.kappSlug}.forms.${props.slug}`}
            public={!props.authenticated}
          >
            <h4>
              {customText
                ? customText
                : 'Thank you for taking the time to complete this survey.'}
            </h4>
          </I18n>
        </div>
      </div>
    </Fragment>
  );
};

export const mapStateToProps = state => ({
  authenticated: state.app.authenticated,
  kapp: state.app.kapp,
  surveys: state.surveyApp.forms,
  loading: state.surveyApp.loading,
});

export const mapDispatchToProps = {
  fetchSubmission: actions.fetchSubmissionRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    form:
      props.surveys && props.surveys.find(survey => survey.slug === props.slug),
  })),
);

export const SurveyConfirmation = enhance(SurveyConfirmationComponent);
