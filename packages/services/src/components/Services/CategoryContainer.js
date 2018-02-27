import { connect } from 'react-redux';
import { Category } from './Category';

const mapStateToProps = (state, props) => ({
  category: state.categories.data
    .filter(category => category.slug === props.match.params.categorySlug)
    .first(),
});

export const CategoryContainer = connect(mapStateToProps)(Category);
