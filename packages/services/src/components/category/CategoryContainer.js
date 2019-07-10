import { Category } from './Category';
import { connect } from '../../redux/store';

const mapStateToProps = (state, props) => ({
  category: state.servicesApp.categories
    .filter(category => category.slug === props.categorySlug)
    .first(),
});

export const CategoryContainer = connect(
  mapStateToProps,
  null,
)(Category);
