import { connect } from 'react-redux';
import { FormList } from './FormList';
import { displayableFormPredicate } from '../../helpers';

const mapStateToProps = state => ({
  forms: state.forms.data.filter(displayableFormPredicate),
});

export const FormListContainer = connect(mapStateToProps)(FormList);
