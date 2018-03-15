import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Redirect } from 'react-router-dom';

export const KappRedirectComponent = ({ kappSlug, to, ...rest }) => (
  <Redirect {...rest} to={kappSlug ? `/kapps/${kappSlug}${to}` : ''} />
);

export const mapStateToProps = state => ({
  kappSlug: state.kinops.kappSlug,
  // Need to map in the current pathname because the connect HOC will
  // not let the inner Redirect update if mapStateToProps doesn't return
  // a different value (its implicitly a pure component).
  pathname: state.router.location.pathname,
});

export const KappRedirect = compose(connect(mapStateToProps, {}))(
  KappRedirectComponent,
);
