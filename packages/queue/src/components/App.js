import React from 'react';
import { Helmet } from 'react-helmet';
import 'bootstrap/scss/bootstrap.scss';
import 'typeface-open-sans/index.css';
import 'react-kinops-common/styles/master.scss';
import 'react-kinops-discussions/styles/master.scss';
import '../styles/master.scss';
import { LayoutContainer } from './Layout';
import { SidebarContainer } from './SidebarContainer';
import { PageTitle } from './PageTitle';

export const App = ({ loading }) => (
  <div>
    <Helmet>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      {/*<link rel="stylesheet" href="//basehold.it/12/11/168/224/0.2" />*/}
    </Helmet>
    {loading ? (
      <div>
        <PageTitle parts={[]} />
      </div>
    ) : (
      <div className="app">
        <LayoutContainer sidebarContent={<SidebarContainer />} />
      </div>
    )}
  </div>
);
