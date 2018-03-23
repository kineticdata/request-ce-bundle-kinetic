import React from 'react';
import { Helmet } from 'react-helmet';

import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/scss/font-awesome.scss';
import 'typeface-open-sans/index.css';

import 'common/src/assets/styles/master.scss';
import 'discussions/src/assets/styles/master.scss';

import '../assets/styles/master.scss';
import { LayoutContainer } from './Layout';
import { SidebarContent } from './Sidebar';

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
