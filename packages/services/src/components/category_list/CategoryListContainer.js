import { CategoryList } from './CategoryList';
import { connect } from '../../redux/store';

const mapStateToProps = state => ({
  categories: state.servicesApp.categories,
});

export const CategoryListContainer = connect(
  mapStateToProps,
  null,
)(CategoryList);
