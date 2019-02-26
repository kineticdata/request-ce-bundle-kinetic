import React from 'react';
import { KappLink as Link, Icon } from 'common';
import { I18n } from '../../../../app/src/I18nProvider';

export const ServiceCard = ({ path, form }) => (
  <I18n context={`kapps.${form.kapp && form.kapp.slug}.forms.${form.slug}`}>
    <Link to={path} className="card card--service">
      <h1>
        <Icon image={form.icon} background="blueSlate" />
        <I18n>{form.name}</I18n>
      </h1>
      <p>
        <I18n>{form.description}</I18n>
      </p>
    </Link>
  </I18n>
);
