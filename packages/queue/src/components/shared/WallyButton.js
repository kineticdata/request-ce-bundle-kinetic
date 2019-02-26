import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { actions } from '../../redux/modules/workMenu';
import { actions as queueActions } from '../../redux/modules/queue';
import { I18n } from '../../../../app/src/I18nProvider';

const getButtonMode = (queueItem, profile) => {
  if (queueItem.coreState !== 'Draft') {
    return 'Review';
  } else if (queueItem.values['Assigned Individual'] === profile.username) {
    return 'Work';
  } else {
    return 'Grab';
  }
};

export const WallyButton = ({ className, buttonMode, handleClick }) => (
  <button type="button" className={className} onClick={handleClick}>
    <I18n>{buttonMode} It</I18n>
  </button>
);

export const mapStateToProps = state => ({
  profile: state.app.profile,
});
export const mapDispatchToProps = {
  openWorkMenu: actions.openWorkMenu,
  updateQueueItem: queueActions.updateQueueItem,
};

export const WallyButtonContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => ({
    buttonMode: getButtonMode(props.queueItem, props.profile),
  })),
  withHandlers({
    handleClick: props => () => {
      if (props.buttonMode === 'Grab') {
        props.updateQueueItem({
          id: props.queueItem.id,
          values: {
            'Assigned Individual': props.profile.username,
            'Assigned Individual Display Name': props.profile.displayName,
          },
          onSuccess: props.onGrabbed,
        });
      } else {
        props.openWorkMenu(props.queueItem, props.onWorked);
      }
    },
  }),
)(WallyButton);
