import { compose, withHandlers, withState } from 'recompose';
import { parse } from 'query-string';
import { Form } from './Form';
import { actions } from '../../redux/modules/submission';
import { actions as submissionsActions } from '../../redux/modules/submissions';
import { connect } from '../../redux/store';

const valuesFromQueryParams = queryParams => {
  const params = parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};

export const handleCompleted = props => response => {
  if (props.authenticated) {
    if (!response.submission.currentPage) {
      props.navigate(
        `${props.appLocation}/requests/request/${
          response.submission.id
        }/confirmation`,
      );
    }
    props.fetchCurrentPage();
  }
};

export const handleCreated = props => response => {
  if (
    response.submission.coreState !== 'Submitted' ||
    response.submission.currentPage
  ) {
    props.navigate(response.submission.id);
  }
};

export const handleUnauthorized = props => response => {
  if (!props.authenticated) {
    props.navigate(props.authRoute);
  }
};

export const handleLoaded = props => form => {
  props.setForm({
    slug: form.slug(),
    name: form.name(),
    description: form.description(),
  });
};

export const handleDelete = props => () => {
  const deleteCallback = () => {
    props.fetchCurrentPage();
    props.navigate(props.appLocation);
  };
  props.deleteSubmission({ id: props.submissionId, callback: deleteCallback });
};

export const mapStateToProps = (state, { categorySlug }) => ({
  category: state.servicesApp.categoryGetter(categorySlug),
  forms: state.forms.data,
  values: valuesFromQueryParams(state.router.location.search),
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
});

export const mapDispatchToProps = {
  deleteSubmission: actions.deleteSubmissionRequest,
  fetchCurrentPage: submissionsActions.fetchSubmissionsCurrent,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('form', 'setForm', props => props.form),
  withHandlers({
    handleCompleted,
    handleCreated,
    handleLoaded,
    handleDelete,
    handleUnauthorized,
  }),
);

export const FormContainer = enhance(Form);
