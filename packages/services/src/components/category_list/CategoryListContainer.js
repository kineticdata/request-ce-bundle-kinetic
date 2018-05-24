import { connect } from 'react-redux';
import { CategoryList } from './CategoryList';

const mapStateToProps = state => ({
  categories: state.services.categories.data,
});

export const CategoryListContainer = connect(mapStateToProps)(CategoryList);
