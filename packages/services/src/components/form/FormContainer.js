import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
  withProps,
} from 'recompose';
import { parse } from 'query-string';
import { Form } from './Form';
import { actions } from '../../redux/modules/submission';
import { actions as submissionsActions } from '../../redux/modules/submissions';
import { context } from '../../redux/store';

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

// export const getSubmissionId = props =>
//   props.match.isExact
//     ? props.submissionId
//     : props.location.pathname.replace(props.match.url, '').replace('/', '');

export const getSubmissionId = props => props.submissionId;

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
  props.push(
    response.submission.coreState === 'Submitted'
      ? `${props.appLocation}/requests/request/${
          response.submission.id
        }/confirmation`
      : `${props.match.url}/${response.submission.id}`,
  );
};

export const handleLoaded = props => form => {
  props.setFormSlug(form.slug());
};

export const handleDelete = props => () => {
  const deleteCallback = () => {
    props.fetchCurrentPage();
    props.push(props.appLocation);
  };
  props.deleteSubmission(props.submissionId, deleteCallback);
};

export const mapStateToProps = (state, { categorySlug }) => ({
  category: categorySlug
    ? state.categories.data.find(category => category.slug === categorySlug)
    : null,
  forms: state.forms.data,
  values: valuesFromQueryParams(state.router.location.search),
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
});

export const mapDispatchToProps = {
  push,
  deleteSubmission: actions.deleteSubmission,
  fetchCurrentPage: submissionsActions.fetchCurrentPage,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('submissionId', 'setSubmissionId', getSubmissionId),
  withState('formSlug', 'setFormSlug', props => props.formSlug),
  withProps(props => ({
    form: props.forms.find(form => form.slug === props.formSlug),
  })),
  withHandlers({ handleCompleted, handleCreated, handleLoaded, handleDelete }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.formSlug !== nextProps.formSlug) {
        this.props.setFormSlug(nextProps.formSlug);
      }
      if (this.props.submissionId !== nextProps.submissionId) {
        this.props.setSubmissionId(nextProps.submissionId);
      }
    },
  }),
);

export const FormContainer = enhance(Form);
