import React, { Fragment } from 'react';
import { CoreForm } from '@kineticdata/react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withState } from 'recompose';
import { parse } from 'query-string';
import { I18n } from '../../I18nProvider';

import { PageTitle } from 'common';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

const UnauthenticatedFormComponent = props => {
  const {
    kappSlug,
    formSlug,
    submissionId,
    handleCreated,
    handleLoaded,
    formName,
    values,
    showHeader,
    handleUnauthorized,
  } = props;

  return (
    <I18n context={`kapps.${kappSlug}.forms.${formSlug}`}>
      <div className="page--container">
        <PageTitle parts={[formSlug]} />
        <div className="page-panel">
          {showHeader && (
            <div className="page-title">
              <div className="page-title__wrapper">
                <h1>
                  <I18n>{formName}</I18n>
                </h1>
              </div>
            </div>
          )}
          {submissionId ? (
            <Fragment>
              <CoreForm
                onUnauthorized={handleUnauthorized}
                submission={submissionId}
                globals={globals}
                created={handleCreated}
                loaded={handleLoaded}
              />
            </Fragment>
          ) : (
            <Fragment>
              <CoreForm
                onUnauthorized={handleUnauthorized}
                kapp={kappSlug}
                form={formSlug}
                globals={globals}
                created={handleCreated}
                loaded={handleLoaded}
                values={values}
              />
            </Fragment>
          )}
        </div>
      </div>
    </I18n>
  );
};

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
  showHeader: showHeader(state.router.location.search),
  values: valuesFromQueryParams(state.router.location.search),
  isPublic: state.router.location.search.includes('public'),
  isEmbedded: state.router.location.search.includes('embedded'),
  isCrossDomain: state.router.location.search.includes('cross_domain'),
});

export const handleCreated = props => response => {
  /*
   * Only modify the route if the router location does not
   * contain the embedded & cross_domain parameters. If these
   * headers are present it is an indication that the form
   * will implement it's own submitPage() callback function.
   * This was necessary to support unauthenticated forms inside
   * of iframes when using Safari. Safari will not send cookies
   * to a server if they cookie did not originate in a main parent
   * window request (third party cookies). This includes the
   * JSESSIONID cookie which is used to validate the submitter
   * access with an unauthenticated form.
   */
  if (!props.isEmbedded && !props.isCrossDomain) {
    props.push(
      `/kapps/${props.kappSlug}/submissions/${response.submission.id}${
        props.isPublic ? '?public' : ''
      }`,
    );
  }
};

export const handleLoaded = props => form => {
  props.setFormName(form.name());
};

export const UnauthenticatedForm = compose(
  connect(
    mapStateToProps,
    { push },
  ),
  withState('formName', 'setFormName', ''),
  withHandlers({ handleCreated, handleLoaded }),
)(UnauthenticatedFormComponent);
