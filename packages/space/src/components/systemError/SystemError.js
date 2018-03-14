import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { loadable } from 'react-kinetic-core';
import { actions } from '../../redux/modules/errors';

export const SystemErrorComponent = ({ status, statusText }) => (
  <div>
    <h1>There was a problem!</h1>
    <h4>{status}</h4>
    <p>{statusText || 'Unknown error has occurred.'}</p>
  </div>
);

export const mapStateToProps = ({ errors }) => ({
  status: errors.system.status,
  statusText: errors.system.statusText,
});
export const mapDispatchToProps = actions;

export const SystemError = compose(
  connect(mapStateToProps, mapDispatchToProps),
  loadable({
    onUnmount: props => props.clearSystemError(),
  }),
)(SystemErrorComponent);
