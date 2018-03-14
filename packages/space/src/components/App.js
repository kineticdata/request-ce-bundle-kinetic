import React from 'react';
import { Helmet } from 'react-helmet';

import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/scss/font-awesome.scss';
import 'typeface-open-sans/index.css';

import 'react-kinops-common/styles/master.scss';
import 'react-kinops-discussions/styles/master.scss';

import '../styles/master.scss';
import { LayoutContainer } from './Layout';
import { SidebarContent } from './SidebarContent';

export const App = ({ loading }) => (
  <div>
    <Helmet>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
    </Helmet>
    {loading ? (
      <div />
    ) : (
      <div className="app">
        <LayoutContainer sidebarContent={<SidebarContent />} />
      </div>
    )}
  </div>
);
