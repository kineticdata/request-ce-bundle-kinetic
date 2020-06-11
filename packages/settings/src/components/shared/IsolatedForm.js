import React from 'react';
import { CoreForm } from '@kineticdata/react';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { compose, withHandlers, withState } from 'recompose';
import { parse } from 'query-string';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

const IsolatedFormComponent = ({
  kappSlug,
  formSlug,
  submissionId,
  handleCreated,
  handleLoaded,
  formName,
  values,
  showHeader,
}) => (
  <I18n context={`kapps.${kappSlug}.forms.${formSlug}`}>
    <div className="page--container">
      <PageTitle parts={[formName]} />
      <div className="page-panel">
        {showHeader && (
          <div className="page-title">
            <h1>
              <I18n>{formName}</I18n>
            </h1>
          </div>
        )}
        {submissionId ? (
          <div>
            <CoreForm
              submission={submissionId}
              globals={globals}
              created={handleCreated}
              loaded={handleLoaded}
            />
          </div>
        ) : (
          <div>
            <CoreForm
              kapp={kappSlug}
              form={formSlug}
              globals={globals}
              created={handleCreated}
              loaded={handleLoaded}
              values={values}
            />
          </div>
        )}
      </div>
    </div>
  </I18n>
);

const valuesFromQueryParams = queryParams => {
  const params = parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};

const showHeader = queryParams => {
  const params = parse(queryParams);
  return Object.keys(params).includes('showHeader');
};

const mapStateToProps = (state, { match: { params } }) => ({
  submissionId: params.id,
  kappSlug: params.kappSlug,
  formSlug: params.formSlug,
  values: valuesFromQueryParams(state.router.location.search),
  showHeader: showHeader(state.router.location.search),
});

export const handleCreated = props => response => {
  props.push(
    `/kapps/${props.kappSlug}/forms/${props.formSlug}/submissions/${
      response.submission.id
    }`,
  );
};

export const handleLoaded = props => form => {
  props.setFormName(form.name());
};

export const IsolatedForm = compose(
  connect(
    mapStateToProps,
    { push },
  ),
  withState('formName', 'setFormName', ''),
  withHandlers({ handleCreated, handleLoaded }),
)(IsolatedFormComponent);
