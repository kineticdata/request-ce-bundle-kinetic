import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Header } from './Header';
import * as selectors from '../redux/selectors';

export const mapStateToProps = state => ({
  loading: state.kinops.loading,
  space: state.kinops.space,
  profile: state.kinops.profile,
  // Selectors
  hasAccessToManagement: selectors.selectHasAccessToManagement(state),
  hasAccessToSupport: selectors.selectHasAccessToSupport(state),
  isGuest: selectors.selectIsGuest(state),
  adminKapp: selectors.selectAdminKapp(state),
  predefinedKapps: selectors.selectPredefinedKapps(state),
  additionalKapps: selectors.selectAdditionalKapps(state),
  currentKapp: selectors.selectCurrentKapp(state),
});

export const HeaderContainer = compose(connect(mapStateToProps))(Header);
