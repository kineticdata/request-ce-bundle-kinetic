import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import { Profile } from './Profile';
import { actions } from '../redux/modules/modalForm';

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
  profile: state.kinops.profile,
});

const mapDispatchToProps = {
  openForm: actions.openForm,
};

export const ProfileContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    openHelpForm: props => () => props.openForm(HELP_FORM_CONFIG),
    openFeedbackForm: props => () => props.openForm(FEEDBACK_FORM_CONFIG),
    openInviteOthersForm: props => () =>
      props.openForm(INVITE_OTHERS_FORM_CONFIG),
    openKitchenSinkForm: props => () =>
      props.openForm(KITCHEN_SINK_FORM_CONFIG),
  }),
)(Profile);
