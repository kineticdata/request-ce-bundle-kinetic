import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';

import { Profile } from './Profile';
import { commonActions } from 'common';
import * as selectors from '../redux/selectors';


const HELP_FORM_CONFIG = {
  formSlug: 'help',
  kappSlug: 'admin',
  title: 'Get Help',
  confirmationMessage: "We'll get you a response as soon as possible.",
};

const FEEDBACK_FORM_CONFIG = {
  formSlug: 'feedback',
  kappSlug: 'admin',
  title: 'Give Feedback',
  confirmationMessage:
    "Thanks for your feedback. We'll get that routed to the right team.",
};

const INVITE_OTHERS_FORM_CONFIG = {
  formSlug: 'kinops-invite-others',
  kappSlug: 'admin',
  title: 'Invite Others',
  confirmationMessage: "We'll send those invitations out right away.",
};

const KITCHEN_SINK_FORM_CONFIG = {
  formSlug: 'kitchen-sink-form',
  kappSlug: 'queue',
  title: 'Kitchen Sink',
  confirmationMessage: 'That was the kitchen sink, how fun.',
};

export const mapStateToProps = state => ({
  profile: state.app.profile,
  isGuest: selectors.selectIsGuest(state),
});

const mapDispatchToProps = {
  openForm: commonActions.openForm,
};

export const ProfileContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('isOpen', 'setIsOpen', false),
  withHandlers({
    openHelpForm: props => () => {
      props.setIsOpen(false);
      props.openForm(HELP_FORM_CONFIG);
    },
    openFeedbackForm: props => () => {
      props.setIsOpen(false);
      props.openForm(FEEDBACK_FORM_CONFIG);
    },
    openInviteOthersForm: props => () => {
      props.setIsOpen(false);
      props.openForm(INVITE_OTHERS_FORM_CONFIG);
    },
    openKitchenSinkForm: props => () => {
      props.setIsOpen(false);
      props.openForm(KITCHEN_SINK_FORM_CONFIG);
    },
    toggle: props => () => props.setIsOpen(open => !open),
  }),
)(Profile);
