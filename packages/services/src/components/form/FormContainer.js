import { push } from 'connected-react-router';
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
  if (!response.submission.currentPage) {
    props.push(
      `/kapps/${props.kappSlug}/requests/request/${
        response.submission.id
      }/confirmation`,
    );
  }
  props.fetchCurrentPage();
};

export const handleCreated = props => response => {
  if (
    response.submission.coreState !== 'Submitted' ||
    response.submission.currentPage
  ) {
    props.push(`${props.location.pathname}/${response.submission.id}`);
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
    props.push(props.appLocation);
  };
  props.deleteSubmission({ id: props.submissionId, callback: deleteCallback });
};

export const mapStateToProps = (state, { categorySlug }) => ({
  category: state.servicesApp.categoryGetter(categorySlug),
  forms: state.forms.data,
  values: valuesFromQueryParams(state.router.location.search),
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
});

export const mapDispatchToProps = {
  push,
  deleteSubmission: actions.deleteSubmissionRequest,
  fetchCurrentPage: submissionsActions.fetchSubmissionsCurrent,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('form', 'setForm', props => props.form),
  withHandlers({ handleCompleted, handleCreated, handleLoaded, handleDelete }),
);

export const FormContainer = enhance(Form);
