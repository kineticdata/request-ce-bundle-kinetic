import { connect } from 'react-redux';
import { Category } from './Category';
import { context } from '../../redux/store';

const mapStateToProps = (state, props) => ({
  category: state.categories.data
    .filter(category => category.slug === props.categorySlug)
    .first(),
});

export const CategoryContainer = connect(
  mapStateToProps,
  null,
  null,
  { context },
)(Category);
