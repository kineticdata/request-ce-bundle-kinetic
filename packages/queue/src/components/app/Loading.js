import React from 'react';
import { PageTitle } from '../PageTitle';

export const Loading = ({ text }) => (
  <div className="loadingWrapper">
    <PageTitle parts={[]} />
    <div className="loading">
      <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
      <p className="lead m-0">{text || 'Loading...'}</p>
    </div>
  </div>
);
