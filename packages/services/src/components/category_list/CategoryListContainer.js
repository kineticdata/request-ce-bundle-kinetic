import { connect } from 'react-redux';
import { CategoryList } from './CategoryList';

const mapStateToProps = state => ({
  categories: state.categories.data,
});

export const CategoryListContainer = connect(mapStateToProps)(CategoryList);
