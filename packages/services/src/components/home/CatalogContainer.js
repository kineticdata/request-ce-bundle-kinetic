import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Catalog } from './Catalog';
import { actions } from '../../redux/modules/submissions';
import { context } from '../../redux/store';

const mapStateToProps = state => ({
  kapp: state.app.kapp,
  forms: state.forms.data,
  submissions: state.submissions.data,
  appLocation: state.app.location,
});

const mapDispatchToProps = {
  fetchSubmissions: actions.fetchSubmissions,
};

export const CatalogContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmissions();
    },
  }),
)(Catalog);
