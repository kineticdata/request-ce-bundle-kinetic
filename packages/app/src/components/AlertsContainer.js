import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { Alerts } from './Alerts';
import { actions } from '../redux/modules/alerts';

export const mapStateToProps = state => ({
  alerts: state.app.alerts.data,
  error: state.app.alerts.error,
  isSpaceAdmin: state.app.profile.spaceAdmin,
});

const mapDispatchToProps = {
  fetchAlerts: actions.fetchAlerts,
};

export const AlertsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('isOpen', 'setIsOpen', false),
  withHandlers({
    toggle: props => () => props.setIsOpen(open => !open),
  }),
)(Alerts);
