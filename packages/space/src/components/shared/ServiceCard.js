import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Utils } from 'common';
import { I18n } from '../../../../app/src/I18nProvider';

export const ServiceCard = ({ path, form }) => (
  <Link to={path} className="card card--service">
    <h1>
      <Icon
        image={Utils.getAttributeValue(form, 'Icon', 'fa-sticky-note-o')}
        background="blueSlate"
      />
      <I18n>{form.name}</I18n>
    </h1>
    <p>
      <I18n>{form.description}</I18n>
    </p>
  </Link>
);
