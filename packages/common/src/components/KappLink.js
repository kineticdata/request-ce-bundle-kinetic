import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

/**
 * Builds a link to a kapp given a relative path, or uses the current kapp.
 * @constructor
 * @param {string} kappSlug - Optional Kapp Slug can be provided if not linking to the current kapp.
 * @param {string} to - The relative path to link to.
 */
export const KappLinkComponent = ({
  to,
  kappSlug,
  currentKappSlug,
  ...rest
}) => {
  const destinationKapp = kappSlug ? kappSlug : currentKappSlug;
  const destination = destinationKapp ? `/kapps/${destinationKapp}${to}` : to;

  return <Link {...rest} to={destination} />;
};

export const mapStateToProps = state => ({
  currentKappSlug: state.app.config.kappSlug,
});

export const KappLink = connect(
  mapStateToProps,
  {},
)(KappLinkComponent);
