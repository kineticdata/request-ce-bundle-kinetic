import { connect } from 'react-redux';
import { compose } from 'recompose';
import { loadable } from 'react-kinetic-core';
import { actions } from '../../redux/modules/errors';

import { SystemError } from './SystemError';

export const mapStateToProps = ({ errors }) => ({
  status: errors.system.status,
  statusText: errors.system.statusText,
});
export const mapDispatchToProps = actions;

export const SystemErrorContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  loadable({
    onUnmount: props => props.clearSystemError(),
  }),
)(SystemError);
