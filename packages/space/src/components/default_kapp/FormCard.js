import React from 'react';
import { Link } from '@reach/router';
import { Icon } from 'common';
import { I18n } from '@kineticdata/react';

export const FormCard = ({ path, form }) => (
  <Link to={path} className="card card--form">
    <h1>
      <Icon image={form.icon} background="blueSlate" />
      <I18n
        context={
          form.kapp ? `kapps.${form.kapp.slug}.forms.${form.slug}` : undefined
        }
      >
        {form.name}
      </I18n>
    </h1>
    <p>
      <I18n
        context={
          form.kapp ? `kapps.${form.kapp.slug}.forms.${form.slug}` : undefined
        }
      >
        {form.description}
      </I18n>
    </p>
  </Link>
);
