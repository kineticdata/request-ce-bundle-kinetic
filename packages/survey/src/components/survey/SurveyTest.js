import React from 'react';
import { Link } from '@reach/router';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';

export const SurveyTest = ({ form }) => (
  <div className="page-container">
    <PageTitle parts={[form && form.name, `Forms`]} />
    <div className="page-panel page-panel--white">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="../../">
              <I18n>survey</I18n>
            </Link>{' '}
            /{` `}
            <I18n>{form && form.name}</I18n> /{` `}
          </h3>
          <h1>
            <I18n>Test Page</I18n>
          </h1>
        </div>
      </div>
      <div>
        <div className="data-list data-list--fourths">
          {form ? JSON.stringify(form) : 'No form found'}
        </div>
      </div>
    </div>
  </div>
);
