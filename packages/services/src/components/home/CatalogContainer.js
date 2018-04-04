import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Catalog } from './Catalog';
import { actions } from '../../redux/modules/submissions';

const mapStateToProps = state => ({
  forms: state.forms.data,
  submissions: state.submissions.data,
});

const mapDispatchToProps = {
  fetchSubmissions: actions.fetchSubmissions,
};

export const CatalogContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmissions();
    },
  }),
)(Catalog);
