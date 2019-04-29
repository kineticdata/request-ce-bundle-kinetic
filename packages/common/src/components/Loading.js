import React from 'react';
import { PageTitle } from './PageTitle';
import { I18n } from '@kineticdata/react';

export const Loading = ({ text }) => (
  <div className="loadingWrapper">
    <PageTitle pageTitleParts={[]} />
    <div className="loading">
      <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
      <p className="lead m-0">
        <I18n>{text || 'Loading...'}</I18n>
      </p>
    </div>
  </div>
);
