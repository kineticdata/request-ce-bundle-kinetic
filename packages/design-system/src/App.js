import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import { GettingStartedPage } from './GettingStartedPage';
import { ButtonsPage } from './ButtonsPage';
import { ColorsPage } from './ColorsPage';
import { LayoutsPage } from './LayoutsPage';
import { ToastsPage } from './ToastsPage';
import { BreadcrumbsPage } from './BreadcrumbsPage';
import { CardsPage } from './CardsPage';
import { FormsPage } from './FormsPage';
import { ModalsPage } from './ModalsPage';
import { MarkupStylesPage } from './MarkupStylesPage';
import { NavigationsPage } from './NavigationsPage';
import { PaginationPage } from './PaginationPage';
import { PopoversPage } from './PopoversPage';
import { TypographyPage } from './TypographyPage';
import { Sidebar } from './Sidebar';

import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import 'common/src/assets/styles/master.scss';
import 'app/src/assets/styles/master.scss';
import 'services/src/assets/styles/master.scss';
import './assets/styles/master.scss';

class App extends Component {
  render() {
    return (
      <main className="package-layout package-layout--design-system">
        <div className="page-container page-container--panels">
          <Sidebar />
          <div className="page-panel page-panel--two-thirds">
            <Route path="/breadcrumbs" exact component={BreadcrumbsPage} />
            <Route path="/cards" exact component={CardsPage} />
            <Route path="/forms" exact component={FormsPage} />
            <Route path="/layouts" exact component={LayoutsPage} />
            <Route path="/modals" exact component={ModalsPage} />
            <Route path="/markupstyles" exact component={MarkupStylesPage} />
            <Route path="/navigations" exact component={NavigationsPage} />
            <Route path="/pagination" exact component={PaginationPage} />
            <Route path="/popovers" exact component={PopoversPage} />
            <Route path="/toasts" exact component={ToastsPage} />
            <Route path="/typography" exact component={TypographyPage} />
            <Route path="/" exact component={GettingStartedPage} />
            <Route path="/buttons" exact component={ButtonsPage} />
            <Route path="/colors" exact component={ColorsPage} />
            <Route path="/layout" exact component={LayoutsPage} />
          </div>
        </div>
      </main>
    );
  }
}

export default App;
