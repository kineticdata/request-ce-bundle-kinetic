import React from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

export const KappLinkContainerComponent = ({ to, kappSlug, ...rest }) => (
  <LinkContainer {...rest} to={`/kapps/${kappSlug}${to}`} />
);

export const mapStateToProps = state => ({
  kappSlug: state.kinops.kappSlug,
});

export const KappLinkContainer = connect(mapStateToProps, {})(
  KappLinkContainerComponent,
);
