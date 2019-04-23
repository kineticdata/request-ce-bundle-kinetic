import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ModalForm } from './ModalForm';
import { actions } from '../redux/modules/modalForm';

export const mapStateToProps = state => ({
  form: state.modalForm.form,
  isCompleted: state.modalForm.formIsCompleted,
});

const mapDispatchToProps = {
  closeForm: actions.closeForm,
  completeForm: actions.completeForm,
};

export const ModalFormContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
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
