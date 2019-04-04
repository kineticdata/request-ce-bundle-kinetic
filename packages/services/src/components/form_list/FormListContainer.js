import { connect } from 'react-redux';
import { FormList } from './FormList';
import { displayableFormPredicate } from '../../utils';
import { context } from '../../redux/store';

const mapStateToProps = state => ({
  forms: state.forms.data.filter(displayableFormPredicate),
});

export const FormListContainer = connect(
  mapStateToProps,
  null,
  null,
  { context },
)(FormList);
