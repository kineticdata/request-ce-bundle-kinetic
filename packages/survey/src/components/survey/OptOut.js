import React, { Fragment } from 'react';
import { PageTitle } from '../shared/PageTitle';
import { I18n, FormForm } from '@kineticdata/react';

const FormLayout = ({ fields, error, buttons, kappSlug }) => (
  <Fragment>
    <div className="form-group__columns">
      {fields.get('email')}
      {fields.get('confirm')}
    </div>
    <br />
    {error}
    {buttons}
  </Fragment>
);

export const OptOut = () => {};
