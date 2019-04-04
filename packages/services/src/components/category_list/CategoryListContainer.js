import { connect } from 'react-redux';
import { CategoryList } from './CategoryList';
import { context } from '../../redux/store';
const mapStateToProps = state => ({
  categories: state.categories.data,
});

export const CategoryListContainer = connect(
  mapStateToProps,
  null,
  null,
  { context },
)(CategoryList);
