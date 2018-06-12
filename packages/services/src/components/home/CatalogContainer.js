import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Catalog } from './Catalog';
import { actions } from '../../redux/modules/submissions';

const mapStateToProps = state => ({
  forms: state.services.forms.data,
  submissions: state.services.submissions.data,
});

const mapDispatchToProps = {
  fetchSubmissions: actions.fetchSubmissions,
};

export const CatalogContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmissions();
    },
  }),
)(Catalog);
