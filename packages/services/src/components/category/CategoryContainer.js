import { Category } from './Category';
import { connect } from '../../redux/store';

const mapStateToProps = (state, props) => ({
  category: state.servicesApp.categoryGetter(props.categorySlug),
});

export const CategoryContainer = connect(
  mapStateToProps,
  null,
)(Category);
