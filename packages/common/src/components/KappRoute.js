import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Route } from 'react-router-dom';

/**
 * Builds a Kapp Route to a kapp given a relative path, or uses the current kapp.
 * @constructor
 * @param {string} kappSlug - Optional Kapp Slug can be provided if not linking to the current kapp.
 * @param {string} path - The relative path to route to.
 */
export const KappRouteComponent = ({
  path,
  kappSlug,
  currentKappSlug,
  ...rest
}) => {
  const destinationKapp = kappSlug ? kappSlug : currentKappSlug;
  const destination = destinationKapp
    ? `/kapps/${destinationKapp}${path}`
    : path;

  return <Route {...rest} path={destination} />;
};

export const mapStateToProps = state => ({
  currentKappSlug: state.app.config.kappSlug,
  // Need to map in the current pathname because the connect HOC will
  // not let the inner Route update if mapStateToProps doesn't return
  // a different value (its implicitly a pure component).
  pathname: state.router.location.pathname,
});

export const KappRoute = compose(
  connect(
    mapStateToProps,
    {},
  ),
)(KappRouteComponent);
