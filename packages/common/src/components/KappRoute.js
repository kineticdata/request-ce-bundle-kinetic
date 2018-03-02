import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Route } from 'react-router-dom';

export const KappRouteComponent = ({ kappSlug = 'services', path, ...rest }) =>
  kappSlug && <Route {...rest} path={`/kapps/${kappSlug}${path}`} />;

export const mapStateToProps = state => ({
  kappSlug: state.kinops.kappSlug,
  // Need to map in the current pathname because the connect HOC will
  // not let the inner Route update if mapStateToProps doesn't return
  // a different value (its implicitly a pure component).
  pathname: state.router.location.pathname,
});

export const KappRoute = compose(connect(mapStateToProps, {}))(
  KappRouteComponent,
);
