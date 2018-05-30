import { connect } from 'react-redux';
import { FormList } from './FormList';
import { displayableFormPredicate } from '../../utils';

const mapStateToProps = state => ({
  forms: state.services.forms.data.filter(displayableFormPredicate),
});

export const FormListContainer = connect(mapStateToProps)(FormList);
