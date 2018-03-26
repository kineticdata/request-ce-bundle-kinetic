import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { List } from 'immutable';
import moment from 'moment';
import { Alerts } from './Alerts';
import { actions } from '../redux/modules/alerts';

export const mapStateToProps = state => ({
  alerts: List(state.alerts.get('data'))
    .filter(
      alert =>
        !alert.values['End Date Time'] ||
        moment(alert.values['End Date Time']).isAfter(),
    )
    .filter(
      alert =>
        !alert.values['Start Date Time'] ||
        moment(alert.values['Start Date Time']).isBefore(),
    )
    .sortBy(alert =>
      moment(alert.values['Start Date Time'] || alert.createdAt).unix(),
    )
    .reverse(),
  isSpaceAdmin: state.kinops.profile.spaceAdmin,
});

const mapDispatchToProps = {
  fetchAlerts: actions.fetchAlerts,
};

export const AlertsContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('isOpen', 'setIsOpen', false),
  withHandlers({
    toggle: props => () => props.setIsOpen(open => !open),
  }),
)(Alerts);
