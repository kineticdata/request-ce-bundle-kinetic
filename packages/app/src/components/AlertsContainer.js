import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { Alerts } from './Alerts';
import { actions } from '../redux/modules/alerts';

export const mapStateToProps = state => ({
  alerts: state.alerts.data,
  error: state.alerts.error,
  isSpaceAdmin: state.app.profile.spaceAdmin,
});

const mapDispatchToProps = {
  fetchAlertsRequest: actions.fetchAlertsRequest,
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
