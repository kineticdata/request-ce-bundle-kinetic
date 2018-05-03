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

export const mapStateToProps = (state, { match: { params } }) => ({
  category: params.categorySlug
    ? state.categories.data.find(
        category => category.slug === params.categorySlug,
      )
    : null,
  forms: state.forms.data,
  values: valuesFromQueryParams(state.router.location.search),
  kappSlug: state.kinops.kappSlug,
});

export const getSubmissionId = props =>
  props.match.isExact
    ? props.match.params.submissionId
    : props.location.pathname.replace(props.match.url, '').replace('/', '');

export const handleCompleted = props => response => {
  if (!response.submission.currentPage) {
    props.push(
      `/kapps/${props.kappSlug}/requests/request/${
        response.submission.id
      }/confirmation`,
    );
  }
};

export const handleCreated = props => response => {
  if (!response.submission.currentPage) {
    props.push(
      response.submission.coreState === 'Submitted'
        ? `/kapps/${props.kappSlug}/requests/request/${
            response.submission.id
          }/confirmation`
        : `${props.match.url}/${response.submission.id}`,
    );
  }
};

export const handleLoaded = props => form => {
  props.setFormSlug(form.slug());
};

export const mapDispatchToProps = { push };

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('submissionId', '_', getSubmissionId),
  withState('formSlug', 'setFormSlug', props => props.match.params.formSlug),
  withProps(props => ({
    form: props.forms.find(form => form.slug === props.formSlug),
  })),
  withHandlers({ handleCompleted, handleCreated, handleLoaded }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (
        this.props.match.params.formSlug !== nextProps.match.params.formSlug
      ) {
        this.props.setFormSlug(nextProps.match.params.formSlug);
      }
    },
  }),
);

export const FormContainer = enhance(Form);
