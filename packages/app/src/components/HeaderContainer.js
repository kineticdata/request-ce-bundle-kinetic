import { connect } from 'react-redux';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { Header } from './Header';
import { Utils } from 'common';

import * as selectors from '../redux/selectors';

export const mapStateToProps = state => ({
  loading: state.app.loading,
  space: state.app.space,
  profile: state.app.profile,
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
  // Filter out Kapps that have an attribute of "Hidden" set to True or Yes
  withProps(props => ({
    predefinedKapps: props.predefinedKapps.filter(
      kapp =>
        !['yes', 'true'].includes(
          Utils.getAttributeValue(kapp, 'Hidden', 'false').toLowerCase(),
        ),
    ),
    additionalKapps: props.additionalKapps.filter(
      kapp =>
        !['yes', 'true'].includes(
          Utils.getAttributeValue(kapp, 'Hidden', 'false').toLowerCase(),
        ),
    ),
  })),
  withHandlers({
    kappDropdownToggle: props => () => props.setKappDropdownOpen(open => !open),
  }),
)(Header);
