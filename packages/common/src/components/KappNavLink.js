import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

export const KappNavLinkComponent = ({ to, kappSlug, ...rest }) => (
  <NavLink {...rest} to={kappSlug ? `/kapps/${kappSlug}${to}` : to} />
);

export const mapStateToProps = state => ({
  kappSlug: state.app.app.kappSlug,
  // Need to map in the current pathname because the connect HOC will
  // not let the inner NavLink update if mapStateToProps doesn't return
  // a different value (its implicitly a pure component).
  pathname: state.router.location.pathname,
});

export const KappNavLink = connect(mapStateToProps, {})(KappNavLinkComponent);
