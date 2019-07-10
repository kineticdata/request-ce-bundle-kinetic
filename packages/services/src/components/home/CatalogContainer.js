import { compose, lifecycle } from 'recompose';
import { Catalog } from './Catalog';
import { selectCurrentKapp } from 'common';
import { actions } from '../../redux/modules/submissions';
import { connect } from '../../redux/store';

const mapStateToProps = state => ({
  kapp: selectCurrentKapp(state),
  forms: state.forms.data,
  submissions: state.submissions.data,
  submissionsError: state.submissions.error,
  appLocation: state.app.location,
});

const mapDispatchToProps = {
  fetchSubmissions: actions.fetchSubmissionsRequest,
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
