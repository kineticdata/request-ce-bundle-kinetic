import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalForm } from './ModalForm';
import { actions as kinopsActions } from '../redux/modules/kinops';

export const mapStateToProps = state => ({
  form: state.kinops.getIn(['modal', 'form']),
  isCompleted: state.kinops.getIn(['modal', 'isCompleted']),
});

const mapDispatchToProps = {
  closeForm: kinopsActions.closeForm,
  completeForm: kinopsActions.completeForm,
};

export const ModalFormContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleCompleted: props => (submission, actions) => {
      actions.stop();
      props.completeForm();
    },
    handleClosed: props => event => {
      if (event) event.stopPropagation();
      props.closeForm();
    },
  }),
)(ModalForm);
