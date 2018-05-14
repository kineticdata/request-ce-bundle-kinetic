import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { Header } from './Header';
import * as selectors from '../redux/selectors';

export const mapStateToProps = state => ({
  loading: state.app.app.loading,
  space: state.app.app.space,
  profile: state.app.app.profile,
  // Selectors
  hasAccessToManagement: selectors.selectHasAccessToManagement(state),
  hasAccessToSupport: selectors.selectHasAccessToSupport(state),
  isGuest: selectors.selectIsGuest(state),
  adminKapp: selectors.selectAdminKapp(state),
  predefinedKapps: selectors.selectPredefinedKapps(state),
  additionalKapps: selectors.selectAdditionalKapps(state),
  currentKapp: selectors.selectCurrentKapp(state),
});

export const HeaderContainer = compose(
  connect(mapStateToProps),
  withState('kappDropdownOpen', 'setKappDropdownOpen', false),
  withHandlers({
    kappDropdownToggle: props => () => props.setKappDropdownOpen(open => !open),
  }),
)(Header);
