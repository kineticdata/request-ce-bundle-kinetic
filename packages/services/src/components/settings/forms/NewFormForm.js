import { fetchForm, fetchForms } from '@kineticdata/react';
import { generateForm } from '@kineticdata/react';

const dataSources = ({ kappSlug, formSlug }) => ({
  templateForms: !formSlug
    ? {
        fn: fetchForms,
        params: [{ kappSlug, type: 'Template' }],
        transform: result => result.forms,
      }
    : undefined,
  cloneForm: formSlug
    ? {
        fn: fetchForm,
        params: [{ kappSlug, formSlug }],
        transform: result => result.form,
      }
    : undefined,
});

const handleSubmit = ({ kappSlug, formSlug }) => values => {
  console.log('handleSubmit', kappSlug, formSlug, values);
  // const user = values.toJS();
  // return username ? updateUser({ username, user }) : createUser({ user });
};

const fields = ({ kappSlug, formSlug }) => ({ templateForms, cloneForm }) =>
  (templateForms || cloneForm) && [
    cloneForm
      ? {
          name: 'formToClone',
          label: 'Form to Clone',
          type: 'text',
          required: true,
          enabled: false,
          initialValue: cloneForm.slug,
        }
      : {
          name: 'formToClone',
          label: 'Template to Clone',
          type: 'select',
          options: templateForms.map(form => ({
            value: form.slug,
            label: form.name,
          })),
          enabled: true,
          initialValue: '',
        },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      initialValue: '',
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      initialValue: '',
    },
  ];

export const NewFormForm = generateForm({
  formOptions: ['kappSlug', 'formSlug'],
  dataSources,
  fields,
  handleSubmit,
});

NewFormForm.displayName = 'NewFormForm';
