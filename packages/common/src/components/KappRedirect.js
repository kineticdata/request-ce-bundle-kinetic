import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Redirect } from 'react-router-dom';

/**
 * Builds a Redirect to a kapp given a relative path, or uses the current kapp.
 * @constructor
 * @param {string} kappSlug - Optional Kapp Slug can be provided if not redirecting to the current kapp.
 * @param {string} to - The relative path to redirect to.
 */
export const KappRedirectComponent = ({
  to,
  kappSlug,
  currentKappSlug,
  ...rest
}) => {
  const destinationKapp = kappSlug ? kappSlug : currentKappSlug;
  const destination = destinationKapp ? `/kapps/${destinationKapp}${to}` : to;

  return <Redirect {...rest} to={destination} />;
};

export const mapStateToProps = state => ({
  currentKappSlug: state.app.config.kappSlug,
  // Need to map in the current pathname because the connect HOC will
  // not let the inner Redirect update if mapStateToProps doesn't return
  // a different value (its implicitly a pure component).
  pathname: state.router.location.pathname,
});

export const KappRedirect = compose(
  connect(
    mapStateToProps,
    {},
  ),
)(KappRedirectComponent);
